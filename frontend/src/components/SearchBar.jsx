import { useState } from 'react';

function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isFocused ? '#6366f1' : '#64748b'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          transition: 'stroke 0.2s ease',
          zIndex: 1
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        onFocus={(e) => {
          setIsFocused(true);
          e.target.style.borderColor = '#6366f1';
          e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
        }}
        onBlur={(e) => {
          setIsFocused(false);
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
        }}
        style={{
          width: '100%',
          height: '44px',
          padding: '0 14px 0 42px',
          borderRadius: '12px',
          border: '1.5px solid #e2e8f0',
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '14px',
          fontWeight: '450',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          outline: 'none',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}
      />
    </div>
  );
}

export default SearchBar;