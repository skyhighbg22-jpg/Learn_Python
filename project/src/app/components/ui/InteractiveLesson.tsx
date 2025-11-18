import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Play, Lightbulb, Code, Book, Target } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { interactiveLessons, InteractiveLesson } from '../../data/interactiveLessons';
import { useAuth } from '../../contexts/AuthContext';

interface InteractiveLessonProps {
  lessonId: string;
  onComplete: () => void;
  className?: string;
}

export const InteractiveLesson = ({ lessonId, onComplete, className = '' }: InteractiveLessonProps) => {
  const { profile } = useAuth();
  const [lesson, setLesson] = useState<InteractiveLesson | null>(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Load lesson data
  useEffect(() => {
    const lessonData = interactiveLessons.find(l => l.id === lessonId);
    if (lessonData) {
      setLesson(lessonData);
    }
  }, [lessonId]);

  // Handle lesson completion
  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  const handleCodeChange = (value: string) => {
    if (lesson) {
      // Validate against expected output (if any)
      if (lesson.expectedOutput) {
        const expected = lesson.expectedOutput.toLowerCase();
        const actual = value.toLowerCase();
        const isValid = expected.includes(actual) || value.includes(expected.split(' ')[0]);
        setValidationError(isValid ? '' : 'Output doesn\'t match expected result');
      }
    }
  };

  const handleRunCode = async () => {
    if (!lesson || !lesson.expectedOutput) return;

    setIsRunning(true);
    setOutput('Running...');
    setValidationError('');

    try {
      // Simulate code execution (in real app, this would use CodeEditor's run function)
      const result = await simulateCodeExecution(lesson.starterCode);

      setOutput(result.output);

      if (lesson.expectedOutput) {
        const expected = lesson.expectedOutput.toLowerCase();
        const actual = result.output.toLowerCase();
        const isCorrect = expected.includes(actual) || actual.includes(expected.split(' ')[0]);

        if (isCorrect) {
          setIsCompleted(true);
          if (profile && lesson.xpReward) {
            // In real app, this would update user XP
            console.log(`Lesson completed! +${lesson.xpReward} XP`);
          }
        }
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Simulate code execution (replace with actual CodeEditor.run in real app)
  const simulateCodeExecution = async (code: string): Promise<{ output: string; error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Basic Python simulation
          const lines = code.trim().split('\n');
          let output = '';

          // Very simple simulation - just return the last line or success message
          if (lines.length > 0) {
            const lastLine = lines[lines.length - 1].trim();
            if (lastLine.includes('print(')) {
              output = lastLine.replace(/^print\s*\(?(.+)?\)?/, '').replace(/['"]$/, '');
            } else {
              output = 'Code executed successfully';
            }
          } else {
            output = 'Hello, World!';
          }

          resolve({ output });
        } catch (error) {
          resolve({ output: `Simulation error: ${error}` });
        }
      }, 1000);
    });
  };

  const requestHint = () => {
    if (lesson && currentHintIndex < lesson.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const showHintText = () => {
    if (lesson && currentHintIndex < lesson.hints.length) {
      return lesson.hints[currentHintIndex];
    }
    return 'No more hints available';
  };

  const resetLesson = () => {
    setIsCompleted(false);
    setCurrentHintIndex(0);
    setShowSolution(false);
    setOutput('');
    setValidationError('');
    setIsRunning(false);
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading lesson...</div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Book className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-600 rounded-full text-white text-sm font-semibold">
              <CheckCircle size={16} />
              <span>Completed +{lesson.xpReward} XP</span>
            </div>
          )}
          <button
            onClick={resetLesson}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-300 mb-6">{lesson.description}</p>

      {/* Task */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Target className="text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Your Task:</h3>
        </div>
        <p className="text-slate-300">{lesson.task}</p>
      </div>

      {/* Code Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Write Your Code:</h3>
          </div>
          <div className="flex items-center gap-2">
            {showSolution && (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="text-slate-400 hover:text-white transition-colors px-3 py-1 rounded"
              >
                <Lightbulb size={16} />
                <span>{showSolution ? 'Hide Solution' : 'Show Solution'}</span>
              </button>
            )}
            <div className="text-sm text-slate-400">
              {showSolution && lesson.solution ? 'Solution visible' : 'Solution hidden'}
            </div>
          </div>
        </div>

        <CodeEditor
          value={lesson.starterCode}
          onChange={handleCodeChange}
          height="300px"
          showLineNumbers={true}
          readOnly={isRunning}
          fontSize={14}
          hint={currentHintIndex < lesson.hints.length ? showHintText() : undefined}
        />
      </div>

      {/* Hints */}
      {lesson.hints && lesson.hints.length > 0 && (
        <div className="bg-slate-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-yellow-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Hints:</h3>
            </div>
            <div className="text-sm text-slate-400">
              Hint {currentHintIndex + 1} of {lesson.hints.length}
            </div>
          </div>

          <div className="space-y-2">
            {lesson.hints.map((hint, index) => (
              <button
                key={hint.id}
                onClick={() => setCurrentHintIndex(index)}
                disabled={index > currentHintIndex}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  index <= currentHintIndex
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="flex items-center gap-2">
                    {index <= currentHintIndex ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center text-sm text-slate-400">
                        {index + 1}
                      </div>
                    )}
                    <span className="text-sm">{hint.text}</span>
                  </span>
                  {hint.revealedText && (
                    <span className="text-xs text-slate-400 block mt-2 italic">
                      💡 {hint.revealedText}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Output Panel */}
      {(output || isRunning || validationError) && (
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Play className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Output:</h3>
            </div>
            {!isRunning && (
              <button
                onClick={() => setOutput('')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div
            className={`
              font-mono text-sm p-4 rounded bg-slate-900 border border-slate-700
              ${output.includes('Error') ? 'text-red-400 border-red-600' : 'text-green-400 border-green-600'}
            `}
          >
            {output}
          </div>

          {validationError && (
            <div className="mt-3 text-red-400 text-sm">
              <AlertCircle size={16} className="inline-block mr-2" />
              {validationError}
            </div>
          )}
        </div>
      )}

      {/* Run Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRunCode}
          disabled={isRunning || !!validationError}
          className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={20} />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};