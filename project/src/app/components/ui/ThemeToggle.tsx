import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return `System (${systemTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'system':
        return <Monitor size={20} />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          // Cycle through themes
          const themes: Array<'light' | 'dark' | 'system'> = ['system', 'light', 'dark'];
          const currentIndex = themes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % themes.length;
          handleThemeChange(themes[nextIndex]);
        }}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition-all duration-200 text-slate-300 hover:text-white"
        title={`Current theme: ${getLabel()}. Click to change theme.`}
      >
        {getIcon()}
        <span className="text-sm font-medium hidden sm:inline">
          {getLabel()}
        </span>
      </button>

      {/* Dropdown menu for direct theme selection */}
      <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px]">
        <div className="p-1">
          <button
            onClick={() => handleThemeChange('system')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              theme === 'system' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Monitor size={16} />
            <span>System</span>
            {systemTheme === 'dark' && (
              <span className="ml-auto text-xs text-slate-400">Dark</span>
            )}
            {systemTheme === 'light' && (
              <span className="ml-auto text-xs text-slate-400">Light</span>
            )}
          </button>
          <button
            onClick={() => handleThemeChange('light')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              theme === 'light' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Sun size={16} />
            <span>Light</span>
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              theme === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Moon size={16} />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
};