function ScholarshipCard({ scholarship, onStatusChange, onDelete }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Awarded': return { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e', border: '#bbf7d0' };
      case 'Applied': return { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', border: '#bfdbfe' };
      case 'Interview': return { bg: '#faf5ff', text: '#9333ea', dot: '#a855f7', border: '#e9d5ff' };
      case 'Rejected': return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', border: '#fecaca' };
      default: return { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8', border: '#e2e8f0' };
    }
  };

  const sc = getStatusStyle(scholarship.status);
  const isAwarded = scholarship.status === 'Awarded';
  
  const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isPastDue = daysLeft < 0;

  const selectStyle = {
    appearance: 'none',
    height: '34px',
    padding: '0 30px 0 10px',
    borderRadius: '8px',
    border: `1.5px solid ${sc.border}`,
    background: `${sc.bg} url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 8px center`,
    color: sc.text,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    outline: 'none',
    boxShadow: 'none'
  };

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
      cursor: 'default',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = sc.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Top Row */}
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px'
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name & Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
            flexWrap: 'wrap'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#0f172a',
              letterSpacing: '-0.2px',
              margin: 0
            }}>
              {scholarship.name}
            </h3>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 10px',
              borderRadius: '7px',
              background: sc.bg,
              color: sc.text,
              fontSize: '11.5px',
              fontWeight: '600',
              border: `1px solid ${sc.border}`,
              whiteSpace: 'nowrap'
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: sc.dot
              }} />
              {scholarship.status}
            </span>
          </div>

          {/* Provider & Deadline */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            fontSize: '13px',
            color: '#94a3b8',
            fontWeight: '450',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
                        <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: isPastDue ? '#dc2626' : '#64748b',
              fontWeight: isPastDue ? '600' : '450'
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {new Date(scholarship.deadline).toLocaleString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' 
              })}
              {isPastDue && ' (Past due)'}
            </span>
          </div>

          {/* Essay Status */}
          {scholarship.essayRequired && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '7px',
              background: scholarship.essaySubmitted ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${scholarship.essaySubmitted ? '#bbf7d0' : '#fecaca'}`,
              fontSize: '12px',
              fontWeight: '600',
              color: scholarship.essaySubmitted ? '#16a34a' : '#dc2626'
            }}>
              {scholarship.essaySubmitted ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              )}
              Essay {scholarship.essaySubmitted ? 'Submitted' : 'Missing'}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div style={{
          textAlign: 'right',
          marginLeft: '24px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '800',
            color: isAwarded ? '#16a34a' : '#0f172a',
            lineHeight: '1',
            fontFamily: "'Inter', sans-serif",
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '4px'
          }}>
            ${scholarship.amount.toLocaleString()}
          </div>
          {scholarship.currency && (
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', marginBottom: '4px' }}>
              {scholarship.currency}
            </div>
          )}

          {onStatusChange && (
            <select
              value={scholarship.status}
              onChange={(e) => onStatusChange(scholarship.id, e.target.value)}
              style={selectStyle}
              aria-label="Update scholarship status"
              onFocus={(e) => {
                e.target.style.borderColor = sc.text;
                e.target.style.boxShadow = `0 0 0 3px ${sc.text}15`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = sc.border;
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Researching">Researching</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Awarded">Awarded</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(scholarship.id)}
              aria-label="Delete scholarship"
              style={{
                height: '34px',
                padding: '0 10px',
                borderRadius: '8px',
                border: '1.5px solid #fecaca',
                background: '#ffffff',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef2f2';
                e.currentTarget.style.color = '#dc2626';
                e.currentTarget.style.borderColor = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = '#fecaca';
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Bottom Zone: Requirements & Notes */}
      {(scholarship.requirements?.length > 0 || scholarship.notes) && (
        <div style={{
          borderTop: '1px solid #f1f5f9',
          padding: '14px 24px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Requirements */}
          {scholarship.requirements?.length > 0 && (
            <div style={{ flex: '1 1 200px' }}>
              <div style={{
                fontWeight: '600',
                color: '#94a3b8',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px'
              }}>
                Requirements
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {scholarship.requirements.map((req, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: '7px',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: '1px solid #e2e8f0'
                  }}>
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {scholarship.notes && (
            <div style={{
              flex: '1 1 200px',
              padding: '10px 14px',
              background: '#f8fafc',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#475569',
              fontWeight: '450',
              lineHeight: '1.6'
            }}>
              <span style={{
                fontWeight: '600',
                color: '#94a3b8',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'block',
                marginBottom: '4px'
              }}>
                Notes
              </span>
              {scholarship.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScholarshipCard;