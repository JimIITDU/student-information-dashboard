import { Link } from 'react-router-dom';

function Navbar({ isDark, toggleTheme }) {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--navbar-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
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
            width: '28px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Access to Education
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* "Students" - Now a true interactive pill */}
          <Link
            to="/"
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              background: 'rgba(99, 102, 241, 0.08)', // THE FIX: Faint purple tint
              border: '1px solid rgba(99, 102, 241, 0.15)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* THE FIX: Added the missing icon */}
            <svg width="10" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Students
          </Link>

          {/* Theme Toggle
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            style={{
              width: '52px', height: '28px', borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              background: isDark ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
              cursor: 'pointer', position: 'relative',
              transition: 'all 0.3s ease', padding: '0',
              display: 'flex', alignItems: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: '#ffffff', position: 'absolute',
              left: isDark ? '29px' : '3px',
              transition: 'left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </button> */}
          
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
          
          {/* Counselor Portal CTA */}
          <div
            style={{
              height: '40px', padding: '0 18px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '7px',
              fontSize: '13px', fontWeight: '600',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              cursor: 'default', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.35)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Counselor Portal
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;