/**
 * AI Status Component - Shows provider status and connection info
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Zap, DollarSign, Clock } from 'lucide-react';

interface ProviderStatus {
  name: string;
  status: 'online' | 'offline' | 'testing';
  responseTime?: number;
  cost?: string;
  error?: string;
}

export const AIStatus: React.FC = () => {
  const [providers, setProviders] = useState<ProviderStatus[]>([
    { name: 'Groq', status: 'offline', responseTime: 0, cost: '$0.40/1M tokens' },
    { name: 'OpenAI', status: 'offline', responseTime: 0, cost: '$2.00/1M tokens' },
    { name: 'Gemini', status: 'offline', responseTime: 0, cost: 'Free tier' },
    { name: 'Claude', status: 'offline', responseTime: 0, cost: '$25/1M tokens' }
  ]);

  const [isTesting, setIsTesting] = useState(false);

  const testProvider = async (providerName: string) => {
    setProviders(prev => prev.map(p =>
      p.name === providerName
        ? { ...p, status: 'testing' }
        : p
    ));

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'x-client-info': 'ai-status-test'
        },
        body: JSON.stringify({
          message: 'Test connection',
          conversation_id: 'test_connection',
          personality: 'motivational'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(prev => prev.map(p =>
          p.name === data.provider
            ? { ...p, status: 'online', responseTime: data.response_time || 0 }
            : p
        ));
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      setProviders(prev => prev.map(p =>
        p.name === providerName
          ? { ...p, status: 'offline', error: 'Connection failed' }
          : p
      ));
    }
  };

  const testAllProviders = async () => {
    setIsTesting(true);

    // Test with a single request that will try all providers
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'x-client-info': 'ai-status-batch-test'
        },
        body: JSON.stringify({
          message: 'Quick connectivity test',
          conversation_id: 'status_test_batch',
          personality: 'motivational'
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update the successful provider
        setProviders(prev => prev.map(p =>
          p.name === data.provider
            ? { ...p, status: 'online', responseTime: data.response_time || 0 }
            : p
        ));
      }
    } catch (error) {
      console.error('Batch test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: ProviderStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />;
    }
  };

  const getSpeedIcon = (responseTime: number) => {
    if (responseTime < 500) return <Zap className="w-3 h-3 text-green-400" />;
    if (responseTime < 1000) return <Clock className="w-3 h-3 text-yellow-400" />;
    return <Clock className="w-3 h-3 text-red-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400" />
          AI Provider Status
        </h4>
        <button
          onClick={testAllProviders}
          disabled={isTesting}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1"
        >
          {isTesting ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          Test All
        </button>
      </div>

      <div className="space-y-2">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(provider.status)}
              <div>
                <div className="text-white font-medium text-sm">{provider.name}</div>
                <div className="text-slate-400 text-xs flex items-center gap-2">
                  <DollarSign className="w-3 h-3" />
                  {provider.cost}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {provider.responseTime > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  {getSpeedIcon(provider.responseTime)}
                  <span>{provider.responseTime}ms</span>
                </div>
              )}

              <button
                onClick={() => testProvider(provider.name)}
                disabled={provider.status === 'testing'}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                title="Test connection"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {providers.filter(p => p.status === 'online').length === 0 && (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm">No AI providers are currently online</p>
            <p className="text-slate-500 text-xs mt-1">
              Check your API keys in Supabase Edge Functions settings
            </p>
          </div>
        )}

        {providers.filter(p => p.status === 'online').length > 0 && (
          <div className="text-center py-2">
            <p className="text-green-400 text-sm">
              {providers.filter(p => p.status === 'online').length} provider(s) available
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div>• AI requests try providers in priority order: Groq → OpenAI → Gemini → Claude</div>
          <div>• System automatically falls back if a provider fails</div>
          <div>• Costs are tracked and optimized for best performance</div>
        </div>
      </div>
    </div>
  );
};

export default AIStatus;