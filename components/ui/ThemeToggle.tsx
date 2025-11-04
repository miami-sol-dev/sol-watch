'use client';

import { useTheme } from '@/app/theme-provider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#F94C9B',
        border: '3px solid white',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}