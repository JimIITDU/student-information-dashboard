function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '28px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'var(--secondary)',
      fontSize: '13px',
      marginTop: '64px',
      background: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '13px'
        }}>🎓</div>
        <span style={{ fontWeight: '700', color: 'var(--ink)' }}>
          Access to Education
        </span>
        <span>· Student Information Dashboard</span>
      </div>
      <div style={{ fontSize: '12px' }}>© 2026 All rights reserved</div>
    </footer>
  );
}

export default Footer;