import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const FIRE_ROUTES = /^\/dhurandhar(\/|$)|^\/problems\/sp-/;

export function FireThemeEffect() {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const prevThemeRef = useRef(theme);

  useEffect(() => {
    if (FIRE_ROUTES.test(pathname)) {
      // Save the user's real theme before overriding
      if (theme !== 'fire') {
        prevThemeRef.current = theme;
      }
      setTheme('fire');
    } else if (theme === 'fire') {
      // Restore — fall back to localStorage value (not saved when fire was active)
      const saved = localStorage.getItem('ui-theme') as typeof theme | null;
      setTheme(saved && saved !== 'fire' ? saved : prevThemeRef.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
