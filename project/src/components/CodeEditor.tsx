import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Terminal, Zap, Sparkles } from 'lucide-react';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  initialCode?: string;
  placeholder?: string;
  height?: string;
  showLineNumbers?: boolean;
  enableSyntaxHighlighting?: boolean;
  readOnly?: boolean;
};

export const CodeEditor = ({
  value,
  onChange,
  initialCode = '',
  placeholder = '# Write your Python code here...',
  height = '300px',
  showLineNumbers = true,
  enableSyntaxHighlighting = true,
  readOnly = false
}: CodeEditorProps) => {
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayValue = value || initialCode;

  // Update stats when content changes
  useEffect(() => {
    const lines = displayValue.split('\n').length;
    const words = displayValue.trim().split(/\s+/).filter(word => word.length > 0).length;
    setLineCount(lines);
    setWordCount(words);
  }, [displayValue]);

  // Copy to clipboard functionality
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Basic syntax highlighting (simplified version)
  const applySyntaxHighlighting = (code: string) => {
    if (!enableSyntaxHighlighting) return code;

    return code
      // Python keywords
      .replace(/\b(def|class|if|elif|else|for|while|try|except|finally|import|from|return|print|len|range|enumerate|zip|map|filter|lambda|yield|with|as|pass|break|continue|global|nonlocal|assert|del|in|is|and|or|not|True|False|None)\b/g,
        '<span class="text-purple-400 font-semibold">$1</span>')
      // Strings
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="text-emerald-400">$1$2$1</span>')
      // Comments
      .replace(/(#.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-warning-400">$1</span>')
      // Function calls
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-primary-400">$1</span>');
  };

  // Generate line numbers
  const generateLineNumbers = () => {
    const lines = displayValue.split('\n');
    return lines.map((_, index) => (
      <div key={index} className="text-right text-slate-500 select-none pr-3">
        {index + 1}
      </div>
    ));
  };

  return (
    <div className="card-enhanced overflow-hidden">
      {/* Enhanced Header */}
      <div className={`bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between transition-all duration-250 ${
        isFocused ? 'border-primary-500 bg-slate-750' : ''
      }`}>
        <div className="flex items-center gap-3">
          {/* Window controls */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors duration-200 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors duration-200 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors duration-200 cursor-pointer"></div>
          </div>

          {/* File name with icon */}
          <div className="flex items-center gap-2 ml-4">
            <Terminal className="text-primary-400" size={16} />
            <span className="text-slate-300 font-medium text-sm">main.py</span>
            {!readOnly && displayValue.length > 0 && (
              <span className="badge-primary text-xs animate-pulse">Editing</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Word count */}
          {displayValue.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-slate-400 mr-4">
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="btn-enhanced bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-all duration-250"
          >
            {copied ? (
              <>
                <Check size={16} className="text-success-400" />
                <span className="text-success-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code editor area */}
      <div className="relative bg-slate-900" style={{ minHeight: height }}>
        {/* Line numbers */}
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-950 border-r border-slate-800 pt-4 overflow-hidden">
            {generateLineNumbers()}
          </div>
        )}

        {/* Textarea for input */}
        <div className={`${showLineNumbers ? 'ml-12' : ''}`}>
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={readOnly}
            className={`w-full bg-transparent text-white font-mono text-sm resize-none focus:outline-none p-4 leading-relaxed transition-all duration-250 ${
              showLineNumbers ? 'pl-2' : ''
            } ${isFocused ? 'text-white' : 'text-slate-300'} ${readOnly ? 'cursor-not-allowed opacity-75' : ''}`}
            style={{ minHeight: height, lineHeight: '1.6' }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Syntax highlighting overlay (read-only mode) */}
          {readOnly && enableSyntaxHighlighting && (
            <div
              className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none whitespace-pre-wrap break-words"
              style={{ minHeight: height, marginLeft: showLineNumbers ? '3rem' : '0', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: applySyntaxHighlighting(displayValue) }}
            />
          )}
        </div>

        {/* Focus indicator */}
        {isFocused && !readOnly && (
          <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none animate-pulse"></div>
        )}

        {/* Loading/processing indicator */}
        {isFocused && !readOnly && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-slate-500">
            <Sparkles size={12} className="animate-pulse" />
            <span>Ready</span>
          </div>
        )}
      </div>

      {/* Enhanced footer */}
      <div className={`bg-slate-800 px-4 py-2 border-t border-slate-700 flex items-center justify-between transition-all duration-250 ${
        isFocused ? 'border-primary-500 bg-slate-750' : ''
      }`}>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Zap size={12} />
          <span>Python 3.9+</span>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {displayValue.length > 0 ? (
              <>
                <span>{displayValue.length} characters</span>
                <span>•</span>
                <span className="text-success-400">Auto-saved</span>
              </>
            ) : (
              <span className="text-slate-500 italic">Start typing to begin...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
