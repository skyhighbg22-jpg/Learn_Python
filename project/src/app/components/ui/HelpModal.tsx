import React from 'react';
import { X, Keyboard, Zap, Search, Moon, Sun, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Array<{
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: string;
    description?: string;
  }>;
}

export const HelpModal = ({ isOpen, onClose, shortcuts }: HelpModalProps) => {
  if (!isOpen) return null;

  const formatKey = (shortcut: any) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    parts.push(shortcut.key);
    return parts.join(' + ');
  };

  const getShortcutIcon = (action: string) => {
    if (action.toLowerCase().includes('search')) return <Search size={16} />;
    if (action.toLowerCase().includes('theme')) return <Moon size={16} />;
    if (action.toLowerCase().includes('refresh')) return <RefreshCw size={16} />;
    if (action.toLowerCase().includes('next')) return <ArrowRight size={16} />;
    if (action.toLowerCase().includes('prev')) return <ArrowLeft size={16} />;
    return <Keyboard size={16} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto border border-slate-700 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Keyboard className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-mono text-blue-400 bg-slate-800 px-2 py-1 rounded">
                    {formatKey(shortcut)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getShortcutIcon(shortcut.action)}
                      <span className="text-white font-medium">{shortcut.action}</span>
                    </div>
                    {shortcut.description && (
                      <div className="text-sm text-slate-400">{shortcut.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Pro Tips</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p>Use <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl + /</kbd> to quickly access search from anywhere in the app</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p>Press <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Esc</kbd> to close any modal or dialog</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p>Use <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Tab</kbd> and <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Shift + Tab</kbd> to navigate through interactive elements</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p>Navigate lessons using arrow keys when in lesson list view</p>
              </div>
            </div>
          </div>

          {/* Accessibility Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Accessibility</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>• This app supports keyboard navigation for all major functions</p>
              <p>• Screen reader compatible with proper ARIA labels</p>
              <p>• High contrast mode available through theme settings</p>
              <p>• Focus indicators show current interactive element</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Press <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Esc</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">?</kbd> to close</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};