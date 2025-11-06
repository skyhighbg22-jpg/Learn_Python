type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  initialCode?: string;
};

export const CodeEditor = ({ value, onChange, initialCode = '' }: CodeEditorProps) => {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-slate-400 text-sm ml-2">main.py</span>
      </div>
      <textarea
        value={value || initialCode}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Write your Python code here..."
        className="w-full bg-slate-900 text-white p-4 font-mono text-sm resize-none focus:outline-none min-h-[300px]"
        spellCheck={false}
      />
    </div>
  );
};
