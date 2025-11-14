import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement;
    const isInputElement =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true';

    if (isInputElement) return;

    shortcuts.forEach(shortcut => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
                        event.code.toLowerCase() === shortcut.key.toLowerCase();

      const ctrlMatches = !!shortcut.ctrl === event.ctrlKey;
      const shiftMatches = !!shortcut.shift === event.shiftKey;
      const altMatches = !!shortcut.alt === event.altKey;

      if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Common shortcuts for the app
export const getAppShortcuts = (actions: {
  search?: () => void;
  toggleTheme?: () => void;
  navigate?: (direction: 'next' | 'prev' | 'up' | 'down') => void;
  refresh?: () => void;
  help?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [];

  if (actions.search) {
    shortcuts.push({
      key: '/',
      action: actions.search,
      description: 'Focus search'
    });
    shortcuts.push({
      key: 'f',
      ctrl: true,
      action: actions.search,
      description: 'Find (Ctrl+F)'
    });
  }

  if (actions.toggleTheme) {
    shortcuts.push({
      key: 'd',
      ctrl: true,
      action: actions.toggleTheme,
      description: 'Toggle dark mode (Ctrl+D)'
    });
  }

  if (actions.navigate) {
    shortcuts.push({
      key: 'ArrowRight',
      ctrl: true,
      action: () => actions.navigate('next'),
      description: 'Next lesson (Ctrl+→)'
    });
    shortcuts.push({
      key: 'ArrowLeft',
      ctrl: true,
      action: () => actions.navigate('prev'),
      description: 'Previous lesson (Ctrl+←)'
    });
    shortcuts.push({
      key: 'ArrowDown',
      ctrl: true,
      action: () => actions.navigate('down'),
      description: 'Go down (Ctrl+↓)'
    });
    shortcuts.push({
      key: 'ArrowUp',
      ctrl: true,
      action: () => actions.navigate('up'),
      description: 'Go up (Ctrl+↑)'
    });
  }

  if (actions.refresh) {
    shortcuts.push({
      key: 'r',
      ctrl: true,
      action: actions.refresh,
      description: 'Refresh (Ctrl+R)'
    });
    shortcuts.push({
      key: 'F5',
      action: actions.refresh,
      description: 'Refresh (F5)'
    });
  }

  if (actions.help) {
    shortcuts.push({
      key: '?',
      action: actions.help,
      description: 'Show help'
    });
  }

  return shortcuts;
};