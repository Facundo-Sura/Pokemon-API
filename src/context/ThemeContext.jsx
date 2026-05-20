import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = {
  normal: 'normal',
  pokemon: 'pokemon',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('poke-web-theme') || THEMES.normal;
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('poke-web-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEMES.normal ? THEMES.pokemon : THEMES.normal));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
