function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#ffffff',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
          </svg>
        </div>
        <span style={{ 
          fontWeight: '700', 
          color: '#0f172a', 
          fontSize: '14px',
          letterSpacing: '-0.2px'
        }}>
          Access to Education
        </span>
        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '450' }}>
          · Student Information Dashboard
        </span>
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: '#94a3b8', 
        fontWeight: '500' 
      }}>
        © 2026 All rights reserved
      </div>
    </footer>
  );
}

export default Footer;