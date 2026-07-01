import { useEffect, useRef } from 'react';

/**
 * Custom hook to register keyboard shortcuts.
 * @param {Object} shortcuts - Keys mapping to { action, requireAlt }
 */
export const useKeyboardShortcuts = (shortcuts) => {
  const shortcutsRef = useRef(shortcuts);

  // Update the ref value on every render, keeping the function callback references fresh.
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInput = 
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.isContentEditable;

      const currentShortcuts = shortcutsRef.current;

      // Special case: Esc is allowed even when typing in input
      if (e.key === 'Escape' && currentShortcuts['Escape']) {
        e.preventDefault();
        currentShortcuts['Escape'].action();
        return;
      }

      // Special case: "/" to focus search is allowed if not already in input
      if (e.key === '/' && !isInput && currentShortcuts['/']) {
        e.preventDefault();
        currentShortcuts['/'].action();
        return;
      }

      for (const key of Object.keys(currentShortcuts)) {
        const keyDef = currentShortcuts[key];
        if (key === 'Escape' || key === '/') continue; // already handled

        const matchKey = e.key.toLowerCase() === key.toLowerCase();
        const matchesShortcut = keyDef.requireAlt
          ? matchKey && e.altKey
          : matchKey && !e.altKey && !e.ctrlKey && !e.metaKey && !isInput;

        if (matchesShortcut) {
          e.preventDefault();
          keyDef.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Run only once on mount
};
export default useKeyboardShortcuts;
