import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '18px',
        fontWeight: '700',
        color: 'var(--primary)',
        textDecoration: 'none'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'var(--primary)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>🎓</div>
        Access to Education
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="navbar-links">
          <Link to="/">Students</Link>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.03em',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>
          Counselor Portal
        </div>
      </div>
    </nav>
  );
}

export default Navbar;