import { useState, useEffect } from 'react';

// Works like useState, but also saves to and loads from localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // If storage is blocked or corrupted, fall back to the initial value
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore save errors (for example, private browsing)
    }
  }, [key, value]);

  return [value, setValue];
}