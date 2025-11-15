import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Bot, User } from 'lucide-react';
import { aiCharacterService, ConversationMessage, ConversationContext } from '../../services/aiCharacterService';
import { useAuth } from '../../contexts/AuthContext';

interface AICharacterProps {
  isOpen: boolean;
  onToggle: () => void;
  lessonContext?: string;
}

export const AICharacter: React.FC<AICharacterProps> = ({
  isOpen,
  onToggle,
  lessonContext
}) => {
  const [conversation, setConversation] = useState<ConversationContext | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !conversation) {
      initializeConversation();
    }
  }, [isOpen, lessonContext]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      // For now, use a mock user ID - in production this comes from auth
      const userId = 'demo_user';
      const newConversation = await aiCharacterService.initializeConversation(userId, lessonContext);
      setConversation(newConversation);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await aiCharacterService.sendMessage(conversation.conversationId, message);

      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, response]
        };
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse"
        aria-label="Chat with Sky"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></span>
        <div className="absolute bottom-full mb-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
          Chat with Sky! 🌟
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[90vw] bg-slate-800 rounded-lg shadow-2xl border border-slate-700 flex flex-col z-50 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Sky</h3>
            <p className="text-xs opacity-90">Your Python Coach</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
        {isLoading && !conversation ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          conversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'sky'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-slate-600'
              }`}>
                {message.type === 'sky' ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`max-w-[70%] ${
                message.type === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1 px-1">
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-700 rounded-lg px-3 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Python! 🐍"
            className="flex-1 bg-slate-700 text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {lessonContext && (
          <p className="text-xs text-slate-400 mt-2 px-1">
            💡 I can help with your current lesson!
          </p>
        )}
      </div>
    </div>
  );
};