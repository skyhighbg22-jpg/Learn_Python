import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilter?: (filters: SearchFilters) => void;
  className?: string;
  showFilters?: boolean;
  loading?: boolean;
}

export interface SearchFilters {
  difficulty?: string[];
  lessonType?: string[];
  category?: string[];
}

export const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  onFilter,
  className = '',
  showFilters = false,
  loading = false
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    const newFilters = { ...activeFilters };
    const currentValues = newFilters[filterType] || [];

    if (currentValues.includes(value)) {
      newFilters[filterType] = currentValues.filter(v => v !== value);
    } else {
      newFilters[filterType] = [...currentValues, value];
    }

    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setActiveFilters({});
    setShowFilterPanel(false);
    inputRef.current?.focus();
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((total, filters) => total + filters.length, 0);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 bg-slate-800 rounded-lg border border-slate-600 focus-within:border-blue-500 transition-all duration-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-transparent text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {loading && (
          <div className="px-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
          </div>
        )}

        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`relative px-3 py-3 border-l border-slate-600 transition-colors ${
              getActiveFilterCount() > 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Filter size={20} />
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Filters</h3>
              <button
                onClick={() => {
                  setActiveFilters({});
                  onFilter?.({});
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => handleFilterChange('difficulty', difficulty)}
                    className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                      activeFilters.difficulty?.includes(difficulty)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Lesson Type Filter */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Type</label>
              <div className="flex flex-wrap gap-2">
                {['traditional', 'coding', 'drag-drop', 'puzzle', 'story'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange('lessonType', type)}
                    className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                      activeFilters.lessonType?.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    {type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {['basic-concepts', 'algorithms', 'data-structures', 'web-development', 'file-operations'].map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange('category', category)}
                    className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                      activeFilters.category?.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                  >
                    {category.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-slate-300">
          Searching for: <span className="text-white font-medium">"{query}"</span>
          {getActiveFilterCount() > 0 && (
            <span className="ml-2">with {getActiveFilterCount()} active filters</span>
          )}
        </div>
      )}
    </div>
  );
};