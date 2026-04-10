function ErrorMessage({ message, onDismiss, variant = 'full', title }) {
  const isInline = variant === 'inline';

  return isInline ? (
    <div
      className="error-msg-inline"
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
        border: '1px solid #fecaca',
        color: '#dc2626',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        animation: 'errorSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #ef4444, #f87171)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 3px 10px rgba(239,68,68,0.25)'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <span style={{ lineHeight: '1.4' }}>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: 'none',
            color: '#dc2626',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  ) : (
    <div
      className="error-msg-full"
      role="alert"
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        textAlign: 'center',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        animation: 'errorFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Icon */}
        <div style={{
          width: '88px',
          height: '88px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          border: '1.5px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: '0 8px 24px rgba(239,68,68,0.08)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ef4444, #f87171)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(239,68,68,0.3)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '10px',
          letterSpacing: '-0.4px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          lineHeight: '1.2'
        }}>
          {title || 'Something went wrong'}
        </h1>

        {/* Message */}
        <p style={{
          color: '#64748b',
          fontSize: '14.5px',
          fontWeight: '450',
          lineHeight: '1.65',
          marginBottom: '32px'
        }}>
          {message}
        </p>

        {/* Action */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              height: '46px',
              padding: '0 24px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0f172a, #334155)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              boxShadow: '0 4px 14px rgba(15,23,42,0.25)',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,23,42,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(15,23,42,0.25)';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Try Again
          </button>
        )}
      </div>

      <style>{`
        @keyframes errorFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes errorSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default ErrorMessage;