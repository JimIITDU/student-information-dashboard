function MeetingCard({ meeting, onStatusChange, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Scheduled': return 'badge-primary';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="card">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          {/* Date and Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '6px'
          }}>
            <span style={{ fontWeight: '600', fontSize: '15px' }}>
              {new Date(meeting.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className={`badge ${getStatusColor(meeting.status)}`}>
              {meeting.status}
            </span>
          </div>

          {/* Duration and Mentor */}
          <div style={{
            fontSize: '13px',
            color: 'var(--secondary)',
            marginBottom: '12px'
          }}>
            🕐 {meeting.duration} minutes
            {meeting.mentor && ` · with ${meeting.mentor.name}`}
          </div>

          {/* Notes */}
          {meeting.notes && (
            <div style={{
              padding: '10px 12px',
              background: 'var(--cream)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--ink)',
              marginBottom: '10px',
              lineHeight: '1.6'
            }}>
              {meeting.notes}
            </div>
          )}

          {/* Action Items */}
          {meeting.actionItems?.length > 0 && (
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px'
              }}>
                Action Items
              </div>
              {meeting.actionItems.map((item, i) => (
                <div key={i} style={{
                  fontSize: '13px',
                  color: 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>→</span>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginLeft: '24px',
          flexShrink: 0
        }}>
          {onStatusChange && (
            <select
              className="form-input"
              value={meeting.status}
              onChange={(e) => onStatusChange(meeting.id, e.target.value)}
              style={{ fontSize: '12px', padding: '4px 8px' }}
              aria-label="Update meeting status"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          )}
          {onDelete && (
            <button
              className="btn btn-danger"
              onClick={() => onDelete(meeting.id)}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingCard;