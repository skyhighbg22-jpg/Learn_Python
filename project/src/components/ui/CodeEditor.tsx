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
  fontSize = 14
}: CodeEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<string>('');
  const [isValid, setIsValid] = useState(true);
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
      const pyodide = await import('pyodide').then(module => {
        return new module.default({
          stdout: (output) => {
            setCurrentOutput(output);
            setIsRunning(false);
          },
          stderr: (output) => {
            setCurrentOutput(`Error: ${output}`);
            setIsRunning(false);
          },
        });
      });

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
    <div className="h-full flex flex-col bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
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
        </div>

        <div className="flex items-center gap-2">
          {onRun && (
            <button
              onClick={executeCode}
              disabled={isRunning || !isValid}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
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
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw size={16} />
            <span>Clear</span>
          </button>

          <button
            onClick={() => editorInstanceRef.current?.trigger('editor.action.formatDocument')()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <Monitor size={16} />
            <span>Format</span>
          </button>
        </div>

        {!isValid && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={16} />
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

      {/* Output Panel */}
      {showOutput && (
        <div className="h-48 bg-slate-800 border-t border-slate-600 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              Output
              {isRunning && (
                <div className="animate-pulse text-green-400">●</div>
              )}
            </h3>
            <button
              onClick={resetOutput}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div
            className={`font-mono text-sm p-3 rounded bg-slate-900 border border-slate-700 ${
              currentOutput.includes('Error:') ? 'text-red-400 border-red-600' : 'text-green-400 border-green-600'
            }`}
          >
            {currentOutput}
          </div>

          {expectedOutput && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              {currentOutput.includes(expectedOutput) ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Check size={16} />
                  <span>Test Passed! +15 XP</span>
                </div>
              ) : (
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
  );
};