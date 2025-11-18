import { useState, useCallback } from 'react';
import { Code, CheckCircle, XCircle, Shuffle, Play, RotateCcw, Sparkles } from 'lucide-react';

interface DragDropItem {
  id: string;
  content: string;
  type: 'code' | 'comment' | 'function' | 'variable';
  indent: number;
}

interface DragDropLessonProps {
  title: string;
  description: string;
  instructions: string;
  initialCode: DragDropItem[];
  correctOrder: string[];
  hints: string[];
  onLessonComplete: (success: boolean, hintsUsed: number, timeSpent: number) => void;
}

interface DropZone {
  id: string;
  items: DragDropItem[];
  isValid: boolean;
}

export const DragDropLesson = ({
  title,
  description,
  instructions,
  initialCode,
  correctOrder,
  hints,
  onLessonComplete
}: DragDropLessonProps) => {
  const [availableBlocks, setAvailableBlocks] = useState<DragDropItem[]>(initialCode);
  const [dropZones, setDropZones] = useState<DropZone[]>([
    { id: 'solution', items: [], isValid: false }
  ]);
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [startTime] = useState(Date.now());
  const [isDragging, setIsDragging] = useState(false);

  // Shuffle code blocks on mount
  const shuffleBlocks = useCallback(() => {
    const shuffled = [...initialCode].sort(() => Math.random() - 0.5);
    setAvailableBlocks(shuffled);
    setDropZones([{ id: 'solution', items: [], isValid: false }]);
    setShowSuccess(false);
    setShowError(false);
  }, [initialCode]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, item: DragDropItem) => {
    setDraggedItem(item);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsDragging(false);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop in zone
  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove from available blocks
    setAvailableBlocks(prev => prev.filter(block => block.id !== draggedItem.id));

    // Add to drop zone
    setDropZones(prev => prev.map(zone => {
      if (zone.id === zoneId) {
        return {
          ...zone,
          items: [...zone.items, draggedItem]
        };
      }
      return zone;
    }));

    setDraggedItem(null);
    setIsDragging(false);
  };

  // Handle dropping back to available blocks
  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove from all drop zones
    setDropZones(prev => prev.map(zone => ({
      ...zone,
      items: zone.items.filter(item => item.id !== draggedItem.id)
    })));

    // Add back to available blocks
    setAvailableBlocks(prev => [...prev, draggedItem]);
    setDraggedItem(null);
    setIsDragging(false);
  };

  // Remove item from drop zone
  const removeFromZone = (zoneId: string, itemId: string) => {
    const item = dropZones.find(z => z.id === zoneId)?.items.find(i => i.id === itemId);
    if (!item) return;

    setDropZones(prev => prev.map(zone => {
      if (zone.id === zoneId) {
        return {
          ...zone,
          items: zone.items.filter(i => i.id !== itemId)
        };
      }
      return zone;
    }));

    setAvailableBlocks(prev => [...prev, item]);
  };

  // Check solution
  const checkSolution = () => {
    setIsChecking(true);
    setShowError(false);

    setTimeout(() => {
      const solution = dropZones[0]?.items || [];
      const userOrder = solution.map(item => item.id);
      const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

      if (isCorrect) {
        setShowSuccess(true);
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        setTimeout(() => {
          onLessonComplete(true, hintsUsed, timeSpent);
        }, 2000);
      } else {
        setShowError(true);
        // Shake animation for incorrect solution
        const element = document.getElementById('drop-zone');
        if (element) {
          element.classList.add('animate-shake');
          setTimeout(() => {
            element.classList.remove('animate-shake');
          }, 500);
        }
      }

      setIsChecking(false);
    }, 500);
  };

  // Show hint
  const showHint = () => {
    if (hintsUsed < hints.length) {
      setCurrentHint(hints[hintsUsed]);
      setHintsUsed(hintsUsed + 1);
    }
  };

  // Reset exercise
  const reset = () => {
    shuffleBlocks();
    setHintsUsed(0);
    setCurrentHint('');
    setShowSuccess(false);
    setShowError(false);
  };

  // Get code block styling based on type
  const getBlockStyle = (type: DragDropItem['type']) => {
    switch (type) {
      case 'function':
        return 'bg-purple-600 border-purple-500 hover:bg-purple-500';
      case 'comment':
        return 'bg-slate-600 border-slate-500 hover:bg-slate-500';
      case 'variable':
        return 'bg-emerald-600 border-emerald-500 hover:bg-emerald-500';
      case 'code':
        return 'bg-blue-600 border-blue-500 hover:bg-blue-500';
      default:
        return 'bg-slate-700 border-slate-600 hover:bg-slate-600';
    }
  };

  // Get syntax highlighting for code display
  const getSyntaxHighlighting = (content: string) => {
    // Simple syntax highlighting for demonstration
    return content
      .replace(/\b(def|if|else|for|while|return|import|from|class)\b/g, '<span class="text-purple-300">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-warning-300">$1</span>')
      .replace(/(['"])(.*?)\1/g, '<span class="text-emerald-300">$1$2$1</span>');
  };

  return (
    <div className="space-y-6 animate-in animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Code className="text-primary-400" size={24} />
          {title}
        </h2>
        <p className="text-slate-300">{description}</p>
      </div>

      {/* Instructions */}
      <div className="card-enhanced p-4">
        <h3 className="text-lg font-semibold text-primary-400 mb-2">Instructions</h3>
        <p className="text-slate-300 whitespace-pre-line">{instructions}</p>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="card-enhanced p-4 border-2 border-success-500 bg-success-500 bg-opacity-10 animate-scale-in">
          <div className="flex items-center gap-3 text-success-400">
            <CheckCircle size={24} className="animate-pulse" />
            <div>
              <p className="font-bold">Excellent work!</p>
              <p className="text-sm">You've successfully arranged the code blocks in the correct order.</p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="card-enhanced p-4 border-2 border-red-500 bg-red-500 bg-opacity-10 animate-shake">
          <div className="flex items-center gap-3 text-red-400">
            <XCircle size={24} />
            <div>
              <p className="font-bold">Not quite right</p>
              <p className="text-sm">The code blocks aren't in the correct order. Try again!</p>
            </div>
          </div>
        </div>
      )}

      {/* Available Code Blocks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-300">Available Code Blocks</h3>
          <button
            onClick={shuffleBlocks}
            className="btn-enhanced bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
          >
            <Shuffle size={16} />
            Shuffle
          </button>
        </div>

        <div
          className={`min-h-[120px] card-enhanced p-4 border-2 border-dashed ${
            isDragging ? 'border-primary-500 bg-primary-500 bg-opacity-5' : 'border-slate-600'
          } transition-all duration-250`}
          onDragOver={handleDragOver}
          onDrop={handleDropToAvailable}
        >
          <div className="flex flex-wrap gap-3">
            {availableBlocks.length === 0 ? (
              <p className="text-slate-500 italic">All blocks have been placed. Drag blocks back here if needed.</p>
            ) : (
              availableBlocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move px-4 py-3 rounded-lg border-2 text-white font-mono text-sm transition-all duration-250 hover:scale-105 hover:shadow-lg ${getBlockStyle(
                    block.type
                  )} animate-in animate-delay-${index * 50}`}
                  style={{
                    marginLeft: `${block.indent * 20}px`,
                    animationDelay: `${index * 50}ms`
                  }}
                  dangerouslySetInnerHTML={{ __html: getSyntaxHighlighting(block.content) }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-300">Your Solution</h3>

        <div
          id="drop-zone"
          className={`min-h-[200px] card-enhanced p-4 border-2 border-dashed ${
            isDragging ? 'border-success-500 bg-success-500 bg-opacity-5' : 'border-slate-600'
          } transition-all duration-250`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'solution')}
        >
          {dropZones[0]?.items.length === 0 ? (
            <p className="text-slate-500 italic text-center py-8">
              {isDragging ? 'Drop code blocks here to arrange them' : 'Drag code blocks here to create your solution'}
            </p>
          ) : (
            <div className="space-y-2">
              {dropZones[0]?.items.map((block, index) => (
                <div
                  key={block.id}
                  className="group relative flex items-center"
                  style={{ marginLeft: `${block.indent * 20}px` }}
                >
                  <button
                    onClick={() => removeFromZone('solution', block.id)}
                    className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 text-red-400 hover:text-red-300"
                  >
                    <XCircle size={16} />
                  </button>
                  <div
                    className={`px-4 py-2 rounded-lg border-2 text-white font-mono text-sm transition-all duration-250 hover:scale-105 ${getBlockStyle(
                      block.type
                    )}`}
                    dangerouslySetInnerHTML={{ __html: getSyntaxHighlighting(block.content) }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hints Section */}
      {currentHint && (
        <div className="card-enhanced p-4 border-2 border-info-500 bg-info-500 bg-opacity-10 animate-slide-in">
          <div className="flex items-start gap-3 text-info-400">
            <Sparkles size={20} className="mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Hint {hintsUsed}</p>
              <p className="text-sm">{currentHint}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3">
          {hintsUsed < hints.length && (
            <button
              onClick={showHint}
              className="btn-enhanced bg-info-600 hover:bg-info-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Sparkles size={18} />
              Get Hint ({hints.length - hintsUsed} left)
            </button>
          )}

          <button
            onClick={reset}
            className="btn-enhanced bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        <button
          onClick={checkSolution}
          disabled={dropZones[0]?.items.length === 0 || isChecking}
          className="btn-enhanced bg-success-600 hover:bg-success-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          {isChecking ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Checking...
            </>
          ) : (
            <>
              <Play size={18} />
              Check Solution
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
        <span>Hints used: {hintsUsed}</span>
        <span>•</span>
        <span>Blocks placed: {dropZones[0]?.items.length || 0}/{initialCode.length}</span>
      </div>
    </div>
  );
};