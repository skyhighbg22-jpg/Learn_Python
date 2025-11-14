import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Play, RotateCcw, Check, X, AlertCircle, Lightbulb, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark';
  height?: string;
  readOnly?: boolean;
  onRun?: () => void;
  hint?: string;
  expectedOutput?: string;
  showLineNumbers?: boolean;
  fontSize?: number;
  skyTips?: string[];
  onHintUsed?: (hintIndex: number) => void;
  showTips?: boolean;
}

// Default Monaco Python language definition
const pythonLanguage: monaco.languages.definitions['python'] = {
  // Monaco has built-in Python support, but we can customize if needed
  default: {
    tokenPostfix: '.py',
    comments: {
      lineComment: ['#', '//'],
      blockComment: [['\'', '\'']],
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: {
      '[': ']',
      '{': '}',
      '(': ')',
      '\'': '\'',
      '"': '"',
    },
    surroundingPairs: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
  },
};

export const CodeEditor = ({
  value = '',
  onChange,
  language = 'python',
  theme,
  height = '400px',
  readOnly = false,
  onRun,
  hint,
  expectedOutput,
  showLineNumbers = true,
  fontSize = 14,
  skyTips = [],
  onHintUsed,
  showTips = true
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<string>('');
  const [isValid, setIsValid] = useState(true);
  const [showSkyTips, setShowSkyTips] = useState(true);
  const { resolvedTheme } = useTheme();

  // Initialize Monaco Editor
  useEffect(() => {
    if (!editorRef.current) return;

    // Configure Monaco
    const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs';

    monaco.editor.defineTheme('pyLearn-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2D2D30',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3E3E46',
        'editorCursor.foreground': '#AEAFAD',
        'editorWhitespace.foreground': '#404040',
      }
    });

    monaco.editor.defineTheme('pyLearn-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '608B4A', fontStyle: 'italic' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'type', foreground: '267FAB' },
        { token: 'function', foreground: '7986CB' },
        { token: 'variable', foreground: '001080' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#F0F0F0',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5E5E5',
        'editorCursor.foreground': '#000000',
        'editorWhitespace.foreground': '#D3D3D3',
      }
    });

    // Create editor instance
    const editor = monaco.editor.create(editorRef.current, {
      value,
      language: 'python',
      theme: resolvedTheme === 'dark' ? 'pyLearn-dark' : 'pyLearn-light',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbersMinChars: 1,
      glyphMargin: true,
      folding: true,
      renderLineHighlight: 'line',
      renderWhitespace: 'all',
      fontSize: fontSize,
      fontFamily: 'Fira Code, Monaco, monospace',
    });

    editorInstanceRef.current = editor;

    // Add syntax highlighting for Python built-in
    monaco.languages.setMonarchTokensProvider('python', pythonLanguage);

    // Setup editor change handler
    if (onChange) {
      editor.onDidChangeModelContent((e) => {
        onChange(e);
      });
    }

    // Validate code on change
    if (expectedOutput) {
      editor.onDidChangeModelContent(() => {
        // Basic Python syntax validation
        const content = editor.getValue();
        const hasPrintStatement = /print\s*\(/.test(content);
        const hasSyntaxError = content.match(/(\b|\s|;)\s*$/gm);

        setIsValid(!hasSyntaxError);
      });
    }

  }, [value, language, theme, height, readOnly, showLineNumbers, fontSize, expectedOutput]);

  // Execute Python code
  const executeCode = async () => {
    if (!onRun || isRunning) return;

    setIsRunning(true);
    setShowOutput(true);
    setCurrentOutput('Running...');

    try {
      // Create Python execution context
      const pythonCode = editorInstanceRef.current?.getValue() || '';

      // Use Pyodide to execute Python
      const { PyodideRunner } = await import('../utils/pyodide');
      const pyodide = new PyodideRunner();

      // Check if the code uses print() function
      const hasPrintStatement = /print\s*\(/.test(pythonCode);

      if (hasPrintStatement) {
        // Add print() wrapper if not present
        let codeToRun = pythonCode;
        if (!pythonCode.includes('def print_wrapper(')) {
          codeToRun = `def print_wrapper():
    original_print = print

    # Replace all print() calls with our wrapper
    import sys
    ${pythonCode.replace(/print\s*\(/g, 'print_wrapper(')}

# Execute the main function
if __name__ == '__main__':
    print_wrapper()`;
        }
      }

      pyodide.runPython(codeToRun);

    } else {
      setCurrentOutput('Code must use print() function to produce output');
      setIsRunning(false);
    }

    } catch (error) {
      console.error('Execution error:', error);
      setCurrentOutput(`Execution error: ${error}`);
      setIsRunning(false);
    }
  };

  // Reset output
  const resetOutput = () => {
    setCurrentOutput('');
    setShowOutput(false);
    setIsRunning(true);
  };

  // Clear editor
  const clearEditor = () => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue('');
      setIsValid(true);
      resetOutput();
    }
  };

  return (
    <div className="h-full flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      {/* Main Editor Section */}
      <div className="flex-1 flex flex-col" style={{ width: '70%' }}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
              Python
            </div>
            {hint && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-600 rounded-full text-xs">
                <Lightbulb size={14} />
                <span className="text-yellow-100">{hint}</span>
              </div>
            )}
            {expectedOutput && (
              <div className="text-xs text-slate-400">
                Expected: {expectedOutput}
              </div>
            )}
            {isValid && (
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Syntax Valid</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onRun && (
              <button
                onClick={executeCode}
                disabled={isRunning || !isValid}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={clearEditor}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              title="Clear editor"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              onClick={() => editorInstanceRef.current?.trigger('editor.action.formatDocument')()}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              title="Format code"
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Format</span>
            </button>
          </div>

          {!isValid && (
            <div className="flex items-center gap-2 text-red-400 text-sm absolute right-3 top-16 bg-slate-800 px-2 py-1 rounded border border-red-600">
              <AlertCircle size={14} />
              <span>Invalid Python syntax</span>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-1 flex" style={{ height: height }}>
          <div
            ref={editorRef}
            className="w-full"
            style={{
              height: '100%',
              minHeight: '300px',
            }}
          />
        </div>

        {/* Output Panel - Always visible but minimized when empty */}
        <div className={`bg-slate-800 border-t border-slate-600 transition-all duration-300 ${
          showOutput ? 'h-48' : 'h-8'
        } overflow-hidden`}>
          <div className="p-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowOutput(!showOutput)}
                className="text-white font-semibold flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                Output
                {isRunning && (
                  <div className="animate-pulse text-green-400">●</div>
                )}
                <div className={`w-2 h-2 border-l border-b border-slate-400 transform transition-transform ${
                  showOutput ? '-rotate-45 -translate-y-0.5' : 'rotate-45 translate-y-0.5'
                }`}></div>
              </button>
              {showOutput && (
                <button
                  onClick={resetOutput}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {showOutput && (
              <div className="mt-3 space-y-3">
                <div
                  className={`font-mono text-sm p-3 rounded bg-slate-900 border ${
                    currentOutput.includes('Error:')
                      ? 'text-red-400 border-red-600'
                      : currentOutput.includes('Running...')
                      ? 'text-blue-400 border-blue-600 animate-pulse'
                      : 'text-green-400 border-green-600'
                  }`}
                >
                  {currentOutput}
                </div>

                {expectedOutput && (
                  <div className="flex items-center gap-2 text-sm">
                    {currentOutput.includes(expectedOutput) ? (
                      <div className="flex items-center gap-2 text-green-400 animate-scale-in">
                        <Check size={16} />
                        <span>Test Passed! +15 XP</span>
                      </div>
                    ) : !currentOutput.includes('Running...') && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertCircle size={16} />
                        <span>Output doesn't match expected result</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel for Hints and Tips */}
      {showTips && skyTips.length > 0 && (
        <div className="w-80 bg-slate-800 border-l border-slate-600 flex flex-col">
          {/* Sky's Tips Section */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">🌟</span>
                </div>
                Sky's Tips
              </h3>
              <button
                onClick={() => setShowSkyTips(!showSkyTips)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {showSkyTips && (
              <div className="space-y-2">
                {skyTips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">{index + 1}</span>
                      </div>
                      <p className="text-slate-100 text-sm leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Help Section */}
          <div className="p-4 flex-1">
            <div className="bg-slate-700 rounded-lg p-3">
              <h4 className="text-white font-medium mb-2">Quick Help</h4>
              <div className="space-y-2 text-slate-300 text-sm">
                <div>• Use <code className="bg-slate-600 px-1 rounded">print()</code> to show output</div>
                <div>• Check syntax for missing colons <code className="bg-slate-600 px-1 rounded">:</code></div>
                <div>• Ensure proper indentation (4 spaces)</div>
                <div>• Strings need quotes: <code className="bg-slate-600 px-1 rounded">"text"</code></div>
              </div>
            </div>

            <div className="mt-3 bg-gradient-to-r from-purple-500 to-blue-500 bg-opacity-10 border border-purple-500 border-opacity-30 rounded-lg p-3">
              <p className="text-slate-100 text-sm leading-relaxed">
                <span className="font-semibold">💡 Pro Tip:</span> Try to solve without hints first for maximum XP! Hints are here to help you learn, not to give away the answer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};