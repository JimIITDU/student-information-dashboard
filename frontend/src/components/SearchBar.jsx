function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--secondary)',
        fontSize: '16px',
        pointerEvents: 'none'
      }}>
        🔍
      </span>
      <input
        className="form-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: '38px' }}
        aria-label={placeholder}
      />
    </div>
  );
}

export default SearchBar;