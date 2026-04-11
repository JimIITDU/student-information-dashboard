function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Subtle background accent */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      {/* Spinner container with soft glow */}
      <div style={{
        position: 'relative',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        {/* Background glow ring */}
        <div style={{
          position: 'absolute',
          inset: '0',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
          filter: 'blur(8px)',
          animation: 'pulse 2s ease-in-out infinite'
        }} />
        
        {/* Actual spinner */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: '3.5px solid #e2e8f0',
          borderTopColor: '#6366f1',
          borderRightColor: '#8b5cf6',
          animation: 'spin 0.8s linear infinite',
          position: 'relative',
          zIndex: 1
        }} />
      </div>

      {/* Loading text */}
      <p style={{
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '500',
        position: 'relative',
        zIndex: 1,
        letterSpacing: '0.01em'
      }}>
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default LoadingSpinner;