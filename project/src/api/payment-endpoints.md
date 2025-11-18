# Payment API Endpoints

These are the API endpoints that need to be implemented in your backend/server to handle Razorpay payments.

## Required Environment Variables

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
VITE_RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
```

## API Endpoints to Implement

### 1. Create Payment Order
**Endpoint:** `POST /api/create-payment-order`

**Request Body:**
```json
{
  "amount": 5000, // Amount in paise (₹50 = 5000 paise)
  "currency": "INR",
  "receipt": "order_123",
  "notes": {
    "planId": "ad_free_lifetime",
    "userId": "user_123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "order_123",
  "razorpay_order_id": "order_XXXXXXXXXX",
  "amount": 5000,
  "currency": "INR",
  "key_id": "rzp_test_XXXXXXXXXXXXXXXX",
  "payment_url": "https://razorpay.com/pay/order_XXXXXXXXXX"
}
```

### 2. Verify Payment
**Endpoint:** `POST /api/verify-payment`

**Request Body:**
```json
{
  "razorpay_order_id": "order_XXXXXXXXXX",
  "razorpay_payment_id": "pay_XXXXXXXXXX",
  "razorpay_signature": "signature_string",
  "planId": "ad_free_lifetime",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order_id": "order_123"
}
```

## Node.js/Express Implementation Example

### server.js
```javascript
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create payment order
app.post('/api/create-payment-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Store order in database
    const { data, error } = await supabase
      .from('payment_orders')
      .insert({
        user_id: notes.userId,
        plan_id: notes.planId,
        amount: amount / 100, // Convert back to rupees
        currency: currency,
        razorpay_order_id: order.id,
        status: 'created'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }

    res.json({
      success: true,
      order_id: data.id,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: order.key_id
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order'
    });
  }
});

// Verify payment signature
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, userId } = req.body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        error: 'Payment not successful'
      });
    }

    // Update payment order status
    const { data: orderData, error: orderError } = await supabase
      .from('payment_orders')
      .update({
        status: 'paid',
        razorpay_payment_id: razorpay_payment_id,
        paid_at: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (orderError) {
      console.error('Error updating order:', orderError);
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }

    // Grant ad-free access
    if (planId === 'ad_free_lifetime') {
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
          amount: payment.amount / 100, // Convert to rupees
          currency: payment.currency,
          purchased_at: new Date().toISOString()
        });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      order_id: orderData.id
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
```

## Frontend Integration

The frontend already calls these endpoints from:
- `src/services/paymentService.ts`
- `src/components/ui/PaymentModal.tsx`

## Testing

### Test Key IDs
You can use Razorpay test keys for development:
- Key ID: `rzp_test_XXXXXXXXXXXXXXXX`
- Key Secret: Use the one from Razorpay dashboard

### Test Cards
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

## Security Notes

1. **Never expose key secret** in frontend code
2. **Always verify Razorpay signatures** on the server
3. **Use HTTPS** in production
4. **Implement proper error handling** and logging
5. **Validate user authentication** before processing payments
6. **Store transactions securely** in database
7. **Implement refund handling** if needed

## Production Deployment

1. Replace test keys with live keys
2. Set up proper webhooks for real-time payment notifications
3. Implement email notifications for payment confirmations
4. Set up monitoring for payment failures
5. Configure SSL certificates
6. Implement proper rate limiting