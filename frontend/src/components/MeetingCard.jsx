function MeetingCard({ meeting, onStatusChange, onDelete }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e', border: '#bbf7d0' };
      case 'Scheduled': return { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', border: '#bfdbfe' };
      case 'Cancelled': return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', border: '#fecaca' };
      default: return { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8', border: '#e2e8f0' };
    }
  };

  const sc = getStatusStyle(meeting.status);

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
        padding: '18px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Date */}
          <div style={{
            fontWeight: '600',
            fontSize: '15px',
            color: '#0f172a',
            marginBottom: '8px',
            letterSpacing: '-0.1px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            {new Date(meeting.date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
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
              {meeting.status}
            </span>
          </div>

          {/* Duration & Mentor */}
          <div style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            fontSize: '13px',
            color: '#94a3b8',
            fontWeight: '450',
            flexWrap: 'wrap'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {meeting.duration} min
            </span>
            {meeting.mentor && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {meeting.mentor.name}
              </span>
            )}
          </div>
        </div>

        {/* Actions Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          flexShrink: 0,
          alignItems: 'flex-end'
        }}>
          {onStatusChange && (
            <select
              value={meeting.status}
              onChange={(e) => onStatusChange(meeting.id, e.target.value)}
              style={selectStyle}
              aria-label="Update meeting status"
              onFocus={(e) => {
                e.target.style.borderColor = sc.text;
                e.target.style.boxShadow = `0 0 0 3px ${sc.text}15`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = sc.border;
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(meeting.id)}
              aria-label="Delete meeting"
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

      {/* Bottom Zone: Notes & Action Items */}
      {(meeting.notes || meeting.actionItems?.length > 0) && (
        <div style={{
          borderTop: '1px solid #f1f5f9',
          padding: '14px 20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {/* Notes */}
          {meeting.notes && (
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
              {meeting.notes}
            </div>
          )}

          {/* Action Items */}
          {meeting.actionItems?.length > 0 && (
            <div style={{
              flex: '1 1 200px',
              padding: '10px 14px',
              background: '#fffbeb',
              borderRadius: '10px',
              border: '1px solid #fde68a'
            }}>
              <span style={{
                fontWeight: '700',
                color: '#92400e',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'block',
                marginBottom: '6px'
              }}>
                Action Items ({meeting.actionItems.length})
              </span>
              {meeting.actionItems.map((item, i) => (
                <div key={i} style={{
                  fontSize: '12.5px',
                  color: '#78350f',
                  fontWeight: '500',
                  marginBottom: i < meeting.actionItems.length - 1 ? '5px' : 0,
                  display: 'flex',
                  gap: '7px',
                  alignItems: 'flex-start'
                }}>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '4px',
                    border: '1.5px solid #fbbf24',
                    flexShrink: 0,
                    marginTop: '1px',
                    background: '#ffffff'
                  }} />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MeetingCard;