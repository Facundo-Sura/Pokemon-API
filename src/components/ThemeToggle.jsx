import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="btn btn-sm"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'normal' ? 'Pokémon' : 'Normal'} mode`}
      aria-label="Toggle theme"
      style={{
        backgroundColor: 'transparent',
        border: '1px solid var(--text-secondary, #6c757d)',
        color: 'var(--text-primary, #212529)',
        fontSize: '1.1rem',
        lineHeight: 1,
        padding: '0.25rem 0.5rem',
      }}
    >
      {theme === 'normal' ? '⚡' : '☀️'}
    </button>
  );
}
