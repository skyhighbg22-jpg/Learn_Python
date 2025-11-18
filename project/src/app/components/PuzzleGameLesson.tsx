import { useState, useCallback, useEffect } from 'react';
import { Trophy, Clock, Zap, Lightbulb, Target, Star, Play, RotateCcw, Award } from 'lucide-react';

interface PuzzleQuestion {
  id: string;
  question: string;
  code: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: number; // seconds
}

interface PuzzleGameLessonProps {
  title: string;
  description: string;
  questions: PuzzleQuestion[];
  timeBonus: number;
  streakMultiplier: number;
  onLessonComplete: (score: number, correctAnswers: number, timeSpent: number) => void;
}

interface GameStats {
  score: number;
  streak: number;
  bestStreak: number;
  timeSpent: number;
  questionsAnswered: number;
  correctAnswers: number;
}

export const PuzzleGameLesson = ({
  title,
  description,
  questions,
  timeBonus,
  streakMultiplier,
  onLessonComplete
}: PuzzleGameLessonProps) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'completed'>('menu');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    timeSpent: 0,
    questionsAnswered: 0,
    correctAnswers: 0
  });
  const [questionTimer, setQuestionTimer] = useState(0);
  const [gameTimer, setGameTimer] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const timeRemaining = Math.max(0, currentQuestion?.timeLimit - questionTimer);
  const isTimeUp = timeRemaining === 0;

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'playing' && !showExplanation && !isTimeUp) {
      interval = setInterval(() => {
        setQuestionTimer(prev => prev + 1);
        setGameTimer(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, showExplanation, isTimeUp]);

  // Handle time up
  useEffect(() => {
    if (isTimeUp && gameState === 'playing' && !showExplanation) {
      handleAnswer(-1); // -1 indicates timeout
    }
  }, [isTimeUp]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuestionTimer(0);
    setGameTimer(0);
    setGameStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      timeSpent: 0,
      questionsAnswered: 0,
      correctAnswers: 0
    });
    setAchievements([]);
  };

  // Handle answer submission
  const handleAnswer = (answerIndex: number) => {
    if (isAnswering) return;

    setIsAnswering(true);
    setSelectedAnswer(answerIndex);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeBonusPoints = Math.max(0, Math.floor((timeRemaining / currentQuestion.timeLimit) * timeBonus));
    const streakPoints = gameStats.streak * streakMultiplier;
    const questionPoints = currentQuestion.points + (isCorrect ? timeBonusPoints + streakPoints : 0);

    const newStats = { ...gameStats };
    newStats.questionsAnswered++;

    if (isCorrect) {
      newStats.correctAnswers++;
      newStats.streak++;
      newStats.bestStreak = Math.max(newStats.bestStreak, newStats.streak);
      newStats.score += questionPoints;

      // Check for achievements
      checkAchievements(newStats);
    } else {
      newStats.streak = 0;
    }

    setGameStats(newStats);
    setShowExplanation(true);

    setTimeout(() => {
      setIsAnswering(false);
      moveToNextQuestion();
    }, 3000);
  };

  // Move to next question
  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionTimer(0);
    } else {
      endGame();
    }
  };

  // End game
  const endGame = () => {
    setGameState('completed');
    onLessonComplete(gameStats.score, gameStats.correctAnswers, gameTimer);
  };

  // Check for achievements
  const checkAchievements = (stats: GameStats) => {
    const newAchievements: string[] = [];

    if (stats.streak === 5) newAchievements.push('Hot Streak! 5 in a row');
    if (stats.streak === 10) newAchievements.push('On Fire! 10 in a row');
    if (stats.correctAnswers === questions.length) newAchievements.push('Perfect Score!');
    if (timeRemaining > currentQuestion.timeLimit * 0.8) newAchievements.push('Lightning Fast!');

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameState('menu');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuestionTimer(0);
    setGameTimer(0);
    setGameStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      timeSpent: 0,
      questionsAnswered: 0,
      correctAnswers: 0
    });
    setAchievements([]);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500 bg-opacity-20';
      case 'medium': return 'text-warning-400 bg-warning-500 bg-opacity-20';
      case 'hard': return 'text-red-400 bg-red-500 bg-opacity-20';
      default: return 'text-slate-400 bg-slate-500 bg-opacity-20';
    }
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    const percentage = (timeRemaining / currentQuestion?.timeLimit) * 100;
    if (percentage > 50) return 'text-success-400';
    if (percentage > 25) return 'text-warning-400';
    return 'text-red-400 animate-pulse';
  };

  // Game menu
  if (gameState === 'menu') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="text-warning-400" size={40} />
            <h1 className="text-3xl font-bold text-gradient">{title}</h1>
          </div>
          <p className="text-slate-300 text-lg">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-enhanced p-4 text-center">
            <Target className="text-primary-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-white">{questions.length}</p>
            <p className="text-slate-400 text-sm">Questions</p>
          </div>
          <div className="card-enhanced p-4 text-center">
            <Zap className="text-warning-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-white">{timeBonus}</p>
            <p className="text-slate-400 text-sm">Time Bonus</p>
          </div>
          <div className="card-enhanced p-4 text-center">
            <Star className="text-success-400 mx-auto mb-2" size={24} />
            <p className="text-2xl font-bold text-white">{streakMultiplier}x</p>
            <p className="text-slate-400 text-sm">Streak Multiplier</p>
          </div>
        </div>

        <div className="card-enhanced p-4">
          <h3 className="text-lg font-semibold text-primary-400 mb-3">How to Play</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span>Answer Python coding questions as quickly and accurately as possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span>Build streaks for bonus points</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span>Complete questions quickly for time bonuses</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400 mt-1">•</span>
              <span>Unlock achievements for special accomplishments</span>
            </li>
          </ul>
        </div>

        <button
          onClick={startGame}
          className="w-full btn-enhanced bg-gradient-primary text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
        >
          <Play size={24} />
          Start Game
        </button>
      </div>
    );
  }

  // Game completed
  if (gameState === 'completed') {
    const accuracy = Math.round((gameStats.correctAnswers / gameStats.questionsAnswered) * 100);
    const avgTimePerQuestion = Math.round(gameStats.timeSpent / gameStats.questionsAnswered);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in animate-scale-in">
        <div className="text-center space-y-4">
          <Award className="text-warning-400 mx-auto" size={60} />
          <h1 className="text-3xl font-bold text-gradient">Game Complete!</h1>
        </div>

        <div className="card-enhanced p-6 text-center">
          <div className="text-6xl font-bold text-warning-400 mb-2 animate-number-pop">
            {gameStats.score.toLocaleString()}
          </div>
          <p className="text-xl text-slate-300">Final Score</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-enhanced p-4 text-center">
            <Target className="text-primary-400 mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-white">{gameStats.correctAnswers}/{questions.length}</p>
            <p className="text-slate-400 text-sm">Correct</p>
          </div>
          <div className="card-enhanced p-4 text-center">
            <Zap className="text-warning-400 mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-white">{accuracy}%</p>
            <p className="text-slate-400 text-sm">Accuracy</p>
          </div>
          <div className="card-enhanced p-4 text-center">
            <Clock className="text-info-400 mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-white">{avgTimePerQuestion}s</p>
            <p className="text-slate-400 text-sm">Avg Time</p>
          </div>
          <div className="card-enhanced p-4 text-center">
            <Star className="text-success-400 mx-auto mb-2" size={20} />
            <p className="text-xl font-bold text-white">{gameStats.bestStreak}</p>
            <p className="text-slate-400 text-sm">Best Streak</p>
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="card-enhanced p-4">
            <h3 className="text-lg font-semibold text-primary-400 mb-3">Achievements Unlocked</h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-success-500 bg-opacity-10 rounded-lg border border-success-500 border-opacity-30 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Trophy className="text-success-400" size={20} />
                  <span className="text-success-400 font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={resetGame}
          className="w-full btn-enhanced bg-gradient-primary text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3"
        >
          <RotateCcw size={24} />
          Play Again
        </button>
      </div>
    );
  }

  // Game in progress
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="card-enhanced p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-warning-400 animate-number-pop" key={gameStats.score}>
                {gameStats.score.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Streak</p>
              <p className="text-2xl font-bold text-primary-400 flex items-center gap-1">
                <Zap size={20} className={gameStats.streak > 0 ? 'animate-pulse' : ''} />
                {gameStats.streak}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Question</p>
              <p className="text-lg font-semibold text-white">{currentQuestionIndex + 1}/{questions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Time</p>
              <p className={`text-lg font-semibold ${getTimerColor()} flex items-center gap-1`}>
                <Clock size={16} />
                {formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="progress-bar h-2">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Achievement Notifications */}
      {achievements.map((achievement, index) => (
        <div
          key={index}
          className="card-enhanced p-3 border-2 border-success-500 bg-success-500 bg-opacity-10 animate-slide-in animate-bounce-gentle"
        >
          <div className="flex items-center gap-3 text-success-400">
            <Trophy size={20} />
            <span className="font-medium">{achievement}</span>
          </div>
        </div>
      ))}

      {/* Question Card */}
      <div className="card-enhanced p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{currentQuestion.question}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Code Display */}
        <div className="bg-slate-900 rounded-lg p-4 mb-6 border border-slate-700">
          <pre className="text-slate-300 font-mono text-sm overflow-x-auto">
            <code>{currentQuestion.code}</code>
          </pre>
        </div>

        {/* Answer Options */}
        {!showExplanation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswering}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-250 btn-enhanced ${
                  selectedAnswer === index
                    ? 'border-primary-500 bg-primary-500 bg-opacity-20 text-primary-400'
                    : 'border-slate-600 hover:border-slate-500 text-slate-300 hover:bg-slate-700 hover:bg-opacity-50'
                } ${isAnswering ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              selectedAnswer === currentQuestion.correctAnswer
                ? 'border-success-500 bg-success-500 bg-opacity-10'
                : 'border-red-500 bg-red-500 bg-opacity-10'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <>
                    <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-success-400 font-semibold">Correct!</span>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    <span className="text-red-400 font-semibold">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-slate-300">
                The correct answer is: <strong>{String.fromCharCode(65 + currentQuestion.correctAnswer)}</strong> - {currentQuestion.options[currentQuestion.correctAnswer]}
              </p>
            </div>

            <div className="card-enhanced p-4">
              <h4 className="font-semibold text-info-400 mb-2 flex items-center gap-2">
                <Lightbulb size={18} />
                Explanation
              </h4>
              <p className="text-slate-300">{currentQuestion.explanation}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <button
                onClick={moveToNextQuestion}
                className="btn-primary px-4 py-2"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};