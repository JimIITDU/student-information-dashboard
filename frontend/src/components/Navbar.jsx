import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        padding: '0 32px'
      }}>
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            flexShrink: 0
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <span style={{
            fontSize: '18px',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.3px'
          }}>
            Access to Education
          </span>
        </Link>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Links */}
          <Link
            to="/"
            style={{
              height: '40px',
              padding: '0 16px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#475569',
              textDecoration: 'none',
              background: 'transparent',
              border: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#475569';
            }}
          >
            Students
          </Link>

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '24px',
            background: '#e2e8f0',
            margin: '0 4px'
          }} />

          {/* Portal Badge */}
          <div
            style={{
              height: '40px',
              padding: '0 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.01em',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              cursor: 'default',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.25)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Counselor Portal
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;