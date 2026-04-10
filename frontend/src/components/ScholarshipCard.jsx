function ScholarshipCard({ scholarship, onStatusChange, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Awarded': return 'badge-success';
      case 'Applied': return 'badge-primary';
      case 'Interview': return 'badge-purple';
      case 'Rejected': return 'badge-danger';
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
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '6px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600' }}>
              {scholarship.name}
            </h3>
            <span className={`badge ${getStatusColor(scholarship.status)}`}>
              {scholarship.status}
            </span>
          </div>

          {/* Provider and Deadline */}
          <div style={{
            fontSize: '13px',
            color: 'var(--secondary)',
            marginBottom: '10px'
          }}>
            {scholarship.provider} · Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
          </div>

          {/* Requirements */}
          {scholarship.requirements?.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginBottom: '10px'
            }}>
              {scholarship.requirements.map((req, i) => (
                <span key={i} style={{
                  padding: '2px 8px',
                  background: 'var(--cream)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: 'var(--secondary)',
                  border: '1px solid var(--border)'
                }}>
                  {req}
                </span>
              ))}
            </div>
          )}

          {/* Essay Status */}
          {scholarship.essayRequired && (
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>
              Essay:{' '}
              <span style={{
                color: scholarship.essaySubmitted
                  ? 'var(--success)'
                  : 'var(--danger)',
                fontWeight: '600'
              }}>
                {scholarship.essaySubmitted ? '✓ Submitted' : '✗ Not submitted'}
              </span>
            </div>
          )}

          {/* Notes */}
          {scholarship.notes && (
            <div style={{
              padding: '8px 12px',
              background: 'var(--cream)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--secondary)'
            }}>
              {scholarship.notes}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div style={{
          textAlign: 'right',
          marginLeft: '24px',
          flexShrink: 0
        }}>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'var(--success)',
            marginBottom: '12px'
          }}>
            ${scholarship.amount.toLocaleString()}
          </div>
          {onStatusChange && (
            <select
              className="form-input"
              value={scholarship.status}
              onChange={(e) => onStatusChange(scholarship.id, e.target.value)}
              style={{ fontSize: '12px', padding: '4px 8px', marginBottom: '8px' }}
              aria-label="Update scholarship status"
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
              className="btn btn-danger"
              onClick={() => onDelete(scholarship.id)}
              style={{ fontSize: '12px', padding: '4px 8px', width: '100%' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScholarshipCard;