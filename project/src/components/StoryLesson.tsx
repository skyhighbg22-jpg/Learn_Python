import { useState, useCallback } from 'react';
import { BookOpen, Code, Play, ChevronRight, ChevronLeft, Sparkles, MapPin, User, ArrowRight } from 'lucide-react';

interface StoryCharacter {
  id: string;
  name: string;
  avatar: string;
  role: string;
  personality: string;
}

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  character: StoryCharacter;
  background: string;
  objectives: string[];
  challenge: {
    description: string;
    starterCode: string;
    solution: string;
    hints: string[];
    explanation: string;
  };
  reward: {
    xp: number;
    message: string;
    item?: string;
  };
}

interface StoryLessonProps {
  title: string;
  description: string;
  setting: string;
  protagonist: StoryCharacter;
  chapters: StoryChapter[];
  onLessonComplete: (completed: boolean, timeSpent: number, chaptersCompleted: number) => void;
}

export const StoryLesson = ({
  title,
  description,
  setting,
  protagonist,
  chapters,
  onLessonComplete
}: StoryLessonProps) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentChapter = chapters[currentChapterIndex];
  const progress = ((completedChapters.length + (isCompleted ? 1 : 0)) / chapters.length) * 100;

  const nextChapter = useCallback(() => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      setShowChallenge(false);
      setShowSolution(false);
      setHintsUsed(0);
      setCurrentHint('');
      setUserCode('');
    } else {
      // Complete the story
      setIsCompleted(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onLessonComplete(true, timeSpent, completedChapters.length + 1);
    }
  }, [currentChapterIndex, chapters.length, completedChapters.length, startTime, onLessonComplete]);

  const previousChapter = useCallback(() => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      setShowChallenge(false);
      setShowSolution(false);
      setHintsUsed(0);
      setCurrentHint('');
    }
  }, [currentChapterIndex]);

  const startChallenge = () => {
    setShowChallenge(true);
    setUserCode(currentChapter.challenge.starterCode);
  };

  const submitSolution = () => {
    // Simple solution check (in real app, this would be more sophisticated)
    const isCorrect = userCode.trim() === currentChapter.challenge.solution.trim();

    if (isCorrect) {
      if (!completedChapters.includes(currentChapterIndex)) {
        setCompletedChapters(prev => [...prev, currentChapterIndex]);
      }
      setShowChallenge(false);
      setShowSolution(false);
    } else {
      setShowSolution(true);
    }
  };

  const showHint = () => {
    if (hintsUsed < currentChapter.challenge.hints.length) {
      setCurrentHint(currentChapter.challenge.hints[hintsUsed]);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const resetCode = () => {
    setUserCode(currentChapter.challenge.starterCode);
    setShowSolution(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in animate-fade-in">
      {/* Story Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gradient flex items-center justify-center gap-3">
          <BookOpen className="text-primary-400" size={32} />
          {title}
        </h1>
        <p className="text-slate-300 text-lg">{description}</p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Story Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Setting and Character Info */}
      {!showChallenge && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-enhanced p-4">
            <h3 className="text-lg font-semibold text-primary-400 mb-2 flex items-center gap-2">
              <MapPin size={18} />
              Setting
            </h3>
            <p className="text-slate-300">{setting}</p>
          </div>

          <div className="card-enhanced p-4">
            <h3 className="text-lg font-semibold text-info-400 mb-2 flex items-center gap-2">
              <User size={18} />
              Character
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-info-500 to-primary-500 rounded-full flex items-center justify-center text-2xl">
                {protagonist.avatar}
              </div>
              <div>
                <p className="text-white font-semibold">{protagonist.name}</p>
                <p className="text-slate-400 text-sm">{protagonist.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Content */}
      {!showChallenge && !isCompleted && (
        <div className="card-enhanced p-6 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-info-500 opacity-5"></div>

          <div className="relative">
            {/* Chapter Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Chapter {currentChapterIndex + 1}: {currentChapter.title}</h2>
                <div className="flex items-center gap-2 text-slate-400">
                  <Sparkles size={16} />
                  <span>Featuring {currentChapter.character.name}, {currentChapter.character.role}</span>
                </div>
              </div>
              <div className="text-3xl">{currentChapter.character.avatar}</div>
            </div>

            {/* Chapter Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                {currentChapter.content}
              </p>
            </div>

            {/* Chapter Objectives */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <h3 className="font-semibold text-warning-400 mb-2">Chapter Objectives:</h3>
              <ul className="space-y-2">
                {currentChapter.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300">
                    <ChevronRight className="text-warning-400 mt-1 flex-shrink-0" size={16} />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenge Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-500 to-info-500 bg-opacity-10 rounded-lg border border-primary-500 border-opacity-30">
              <h3 className="font-semibold text-primary-400 mb-2 flex items-center gap-2">
                <Code size={18} />
                Coding Challenge
              </h3>
              <p className="text-slate-300 mb-4">{currentChapter.challenge.description}</p>

              {!completedChapters.includes(currentChapterIndex) ? (
                <button
                  onClick={startChallenge}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play size={18} />
                  Start Challenge
                </button>
              ) : (
                <div className="flex items-center gap-2 text-success-400">
                  <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Chapter completed! Earned {currentChapter.reward.xp} XP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Coding Challenge Interface */}
      {showChallenge && (
        <div className="space-y-4">
          <div className="card-enhanced p-4">
            <h3 className="text-lg font-semibold text-primary-400 mb-2">Coding Challenge</h3>
            <p className="text-slate-300">{currentChapter.challenge.description}</p>
          </div>

          <div className="card-enhanced p-4">
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Your Code:</label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-48 bg-slate-900 border border-slate-600 rounded-lg p-4 font-mono text-sm text-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-all duration-250"
                placeholder="Write your Python code here..."
                spellCheck={false}
              />
            </div>

            {currentHint && (
              <div className="mb-4 p-3 bg-info-500 bg-opacity-10 border border-info-500 border-opacity-30 rounded-lg">
                <div className="flex items-start gap-2 text-info-400">
                  <Sparkles size={16} className="mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Hint {hintsUsed}</p>
                    <p className="text-sm">{currentHint}</p>
                  </div>
                </div>
              </div>
            )}

            {showSolution && (
              <div className="mb-4 p-3 bg-warning-500 bg-opacity-10 border border-warning-500 border-opacity-30 rounded-lg">
                <h4 className="font-semibold text-warning-400 mb-2">Solution Explanation:</h4>
                <p className="text-slate-300 text-sm mb-3">{currentChapter.challenge.explanation}</p>
                <div className="bg-slate-900 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-2">Correct solution:</p>
                  <pre className="text-success-400 font-mono text-xs">
                    <code>{currentChapter.challenge.solution}</code>
                  </pre>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {hintsUsed < currentChapter.challenge.hints.length && (
                  <button
                    onClick={showHint}
                    className="btn-enhanced bg-info-600 hover:bg-info-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Sparkles size={18} />
                    Get Hint ({currentChapter.challenge.hints.length - hintsUsed} left)
                  </button>
                )}
                <button
                  onClick={resetCode}
                  className="btn-enhanced bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                >
                  Reset Code
                </button>
              </div>

              <button
                onClick={submitSolution}
                className="btn-enhanced bg-success-600 hover:bg-success-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
              >
                <Play size={18} />
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Complete */}
      {isCompleted && (
        <div className="text-center space-y-6 animate-scale-in">
          <div className="card-enhanced p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gradient mb-4">Story Complete!</h2>
            <p className="text-slate-300 text-lg mb-6">
              Congratulations! You've completed the entire story and helped {protagonist.name} on their Python journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="card-enhanced p-4">
                <BookOpen className="text-primary-400 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-white">{chapters.length}</p>
                <p className="text-slate-400 text-sm">Chapters</p>
              </div>
              <div className="card-enhanced p-4">
                <Sparkles className="text-warning-400 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-white">
                  {chapters.reduce((total, chapter) => total + chapter.reward.xp, 0)}
                </p>
                <p className="text-slate-400 text-sm">Total XP</p>
              </div>
              <div className="card-enhanced p-4">
                <User className="text-info-400 mx-auto mb-2" size={24} />
                <p className="text-2xl font-bold text-white">{Math.round(progress)}%</p>
                <p className="text-slate-400 text-sm">Complete</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-success-500 to-primary-500 bg-opacity-10 rounded-lg border border-success-500 border-opacity-30">
              <p className="text-success-400 font-semibold text-lg">Story Hero Achievement Unlocked!</p>
              <p className="text-slate-300 mt-1">You've mastered Python through storytelling.</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!showChallenge && !isCompleted && (
        <div className="flex items-center justify-between">
          <button
            onClick={previousChapter}
            disabled={currentChapterIndex === 0}
            className="btn-enhanced bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            Previous Chapter
          </button>

          <div className="text-center text-slate-400">
            <span className="text-sm">Chapter {currentChapterIndex + 1} of {chapters.length}</span>
          </div>

          {completedChapters.includes(currentChapterIndex) ? (
            <button
              onClick={nextChapter}
              disabled={currentChapterIndex === chapters.length - 1}
              className="btn-enhanced bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Next Chapter
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={startChallenge}
              className="btn-enhanced bg-gradient-primary text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
            >
              Start Challenge
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};