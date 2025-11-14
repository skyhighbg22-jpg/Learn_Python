/**
 * AI Chat Component - Secure Sky AI Assistant
 * Uses Supabase Edge Functions to securely communicate with AI providers
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Mic, MicOff, Settings, Trash2, Copy, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  response_time?: number;
}

interface AIChatProps {
  lessonContext?: string;
  className?: string;
  defaultPersonality?: 'motivational' | 'technical' | 'friendly';
}

export const AIChat: React.FC<AIChatProps> = ({
  lessonContext,
  className = '',
  defaultPersonality = 'motivational'
}) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [personality, setPersonality] = useState(defaultPersonality);
  const [conversationId, setConversationId] = useState<string>('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<{ provider: string; model: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation ID
  useEffect(() => {
    if (!conversationId && profile?.id) {
      setConversationId(`conv_${profile.id}_${Date.now()}`);
    }
  }, [profile?.id, conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI
  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'x-client-info': 'pylearn-ai-chat',
          'user-id': profile?.id || 'anonymous'
        },
        body: JSON.stringify({
          message: messageContent,
          conversation_id: conversationId,
          lesson_context: lessonContext,
          personality: personality
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        provider: data.provider,
        model: data.model,
        response_time: data.response_time
      };

      setMessages(prev => [...prev, aiMessage]);
      setProviderInfo({
        provider: data.provider,
        model: data.model
      });

    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now! 🌟 Could you try asking your question again in a moment? I'm excited to help you learn Python!",
        timestamp: new Date(),
        provider: 'fallback',
        model: 'error-handling'
      };

      setMessages(prev => [...prev, errorMessage]);
      setProviderInfo({
        provider: 'fallback',
        model: 'error-handling'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  // Copy message to clipboard
  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setProviderInfo(null);
    // Generate new conversation ID
    if (profile?.id) {
      setConversationId(`conv_${profile.id}_${Date.now()}`);
    }
  };

  // Handle voice recording (simplified mock - would need Web Speech API)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would use the Web Speech API
    // For now, it's just a visual indicator
  };

  const personalityOptions = [
    { value: 'motivational', label: 'Motivational', icon: '🌟', description: 'Encouraging and positive' },
    { value: 'technical', label: 'Technical', icon: '💻', description: 'Precise and detailed' },
    { value: 'friendly', label: 'Friendly', icon: '😊', description: 'Casual and approachable' }
  ];

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col h-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              Sky AI Assistant
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Online
              </span>
            </h3>
            {providerInfo && (
              <div className="text-xs text-slate-400">
                Powered by {providerInfo.provider}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Chat settings"
          >
            <Settings size={18} />
          </button>

          <button
            onClick={clearConversation}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-slate-700/50 border-b border-slate-600">
          <h4 className="text-white font-medium mb-3">Chat Settings</h4>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm">Sky's Personality:</label>
            <div className="grid grid-cols-3 gap-2">
              {personalityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setPersonality(option.value as any)}
                  className={`p-2 rounded-lg border transition-colors text-xs ${
                    personality === option.value
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  <div className="text-lg mb-1">{option.icon}</div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-75">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="text-white" size={32} />
            </div>
            <h3 className="text-white font-semibold mb-2">Hello! I'm Sky 🌟</h3>
            <p className="text-slate-400 text-sm mb-4">
              Your friendly Python learning assistant! Ask me anything about programming, or let me help you with your current lesson.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "How do I create variables?",
                "What's a for loop?",
                "Help me debug this code",
                "Explain functions to me"
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setInputMessage(prompt)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={16} />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 relative group ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>

              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${message.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {formatTimestamp(message.timestamp)}
                </span>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyMessage(message.id, message.content)}
                    className="p-1 hover:bg-black/10 rounded transition-colors"
                    title="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className={message.role === 'user' ? 'text-blue-200' : 'text-slate-400'} />
                    )}
                  </button>
                </div>
              </div>

              {message.provider && message.role === 'assistant' && (
                <div className="text-xs text-slate-500 mt-1">
                  {message.provider} {message.model}
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-slate-300" size={16} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white" size={16} />
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-slate-300 text-sm">Sky is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Sky anything about Python..."
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 pr-12 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={toggleRecording}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600'
              }`}
              title={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send size={16} />
            )}
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div className="mt-2 text-xs text-slate-400 text-center">
          Sky is powered by multiple AI providers for the best response
        </div>
      </div>
    </div>
  );
};

export default AIChat;