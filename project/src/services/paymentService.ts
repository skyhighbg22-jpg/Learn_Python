import { supabase } from '../lib/supabase';

export interface PaymentPlan {
  id: string;
  name: string;
  price: number; // in INR (50 rupees)
  description: string;
  features: string[];
  isOneTime: boolean;
  duration: string; // 'lifetime'
}

export interface PaymentResponse {
  success: boolean;
  error?: string;
  payment_url?: string;
  order_id?: string;
}

export interface PaymentStatus {
  paid: boolean;
  order_id: string;
  payment_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export class PaymentService {
  // Payment plans
  private static readonly AD_FREE_PLAN: PaymentPlan = {
    id: 'ad_free_lifetime',
    name: 'Ad-Free Forever',
    price: 50, // 50 rupees
    description: 'Remove all ads permanently and enjoy an uninterrupted learning experience',
    features: [
      'No ads forever',
      'Unlimited access to all features',
      'Premium support',
      'Support PyLearn development'
    ],
    isOneTime: true,
    duration: 'lifetime'
  };

  // Price in cents for Stripe (₹50 = 50 USD cents approximated for simplicity)
  private static readonly AD_FREE_PRICE_CENTS = 500; // $5.00 USD (converted from ₹50)

  // Get available plans
  static getPlans(): PaymentPlan[] {
    return [this.AD_FREE_PLAN];
  }

  // Get specific plan
  static getPlan(planId: string): PaymentPlan | null {
    if (planId === 'ad_free_lifetime') {
      return this.AD_FREE_PLAN;
    }
    return null;
  }

  // Create payment session with Stripe
  static async createPaymentSession(planId: string, userId: string): Promise<PaymentResponse> {
    try {
      const plan = this.getPlan(planId);
      if (!plan) {
        return { success: false, error: 'Invalid plan selected' };
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('payment_orders')
        .insert({
          user_id: userId,
          plan_id: plan.id,
          amount: plan.price,
          currency: 'INR',
          status: 'created',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error('Error creating payment order:', orderError);
        return { success: false, error: 'Failed to create payment order' };
      }

      // Call Stripe API to create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: this.AD_FREE_PRICE_CENTS, // $5.00 in cents
          currency: 'usd',
          order_id: order.id,
          plan_id: plan.id,
          user_id: userId,
          success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/payment/canceled`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Stripe API error:', errorData);
        return { success: false, error: errorData.error || 'Payment service unavailable' };
      }

      const stripeSession = await response.json();

      return {
        success: true,
        order_id: order.id,
        payment_url: stripeSession.url
      };

    } catch (error) {
      console.error('Payment service error:', error);
      return { success: false, error: 'Payment service error' };
    }
  }

  // Process payment callback
  static async processPaymentCallback(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
    userId: string;
  }): Promise<PaymentResponse> {
    try {
      // Verify payment signature
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Payment verification failed' };
      }

      const verification = await response.json();

      if (!verification.success) {
        return { success: false, error: 'Payment verification failed' };
      }

      // Update payment order status
      await supabase
        .from('payment_orders')
        .update({
          status: 'paid',
          payment_id: paymentData.razorpay_payment_id,
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentData.razorpay_order_id);

      // Grant ad-free access to user
      await this.grantAdFreeAccess(paymentData.userId, paymentData.planId);

      return { success: true };

    } catch (error) {
      console.error('Payment callback error:', error);
      return { success: false, error: 'Payment processing error' };
    }
  }

  // Grant ad-free access to user
  private static async grantAdFreeAccess(userId: string, planId: string): Promise<void> {
    try {
      // Update user profile to mark as ad-free
      await supabase
        .from('profiles')
        .update({
          is_ad_free: true,
          ad_free_plan_id: planId,
          ad_free_purchased_at: new Date().toISOString()
        })
        .eq('id', userId);

      // Store purchase record
      await supabase
        .from('ad_free_purchases')
        .insert({
          user_id: userId,
          plan_id: planId,
          amount: this.AD_FREE_PLAN.price,
          currency: 'INR',
          purchased_at: new Date().toISOString()
        });

      // Update local storage
      localStorage.setItem('adFreeUser', 'true');

    } catch (error) {
      console.error('Error granting ad-free access:', error);
      throw error;
    }
  }

  // Check if user is ad-free
  static async checkAdFreeStatus(userId: string): Promise<boolean> {
    try {
      // Check local storage first for faster response
      const localStatus = localStorage.getItem('adFreeUser');
      if (localStatus === 'true') {
        return true;
      }

      // Check database
      const { data } = await supabase
        .from('profiles')
        .select('is_ad_free')
        .eq('id', userId)
        .single();

      if (data?.is_ad_free) {
        localStorage.setItem('adFreeUser', 'true');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking ad-free status:', error);
      return false;
    }
  }

  // Get user's payment history
  static async getPaymentHistory(userId: string): Promise<PaymentStatus[]> {
    try {
      const { data } = await supabase
        .from('payment_orders')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  // Get user's ad-free purchase info
  static async getAdFreePurchaseInfo(userId: string): Promise<any> {
    try {
      const { data } = await supabase
        .from('ad_free_purchases')
        .select('*')
        .eq('user_id', userId)
        .single();

      return data;
    } catch (error) {
      console.error('Error fetching ad-free purchase info:', error);
      return null;
    }
  }
}