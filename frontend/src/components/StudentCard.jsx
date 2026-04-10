import { useNavigate } from 'react-router-dom';

function StudentCard({ student }) {
  const navigate = useNavigate();

  const getGPAColor = (gpa) => {
    if (gpa >= 3.5) return 'badge-success';
    if (gpa >= 3.0) return 'badge-warning';
    return 'badge-danger';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Full-time': return 'badge-primary';
      case 'Part-time': return 'badge-warning';
      case 'Graduated': return 'badge-success';
      case 'Leave of Absence': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={() => navigate(`/student/${student.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${student.firstName} ${student.lastName}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/student/${student.id}`)}
    >
      {/* Avatar and Name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '700',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          {student.firstName[0]}{student.lastName[0]}
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '15px' }}>
            {student.firstName} {student.lastName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--secondary)' }}>
            {student.email}
          </div>
        </div>
      </div>

      {/* Major and Badges */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          fontSize: '13px',
          color: 'var(--secondary)',
          marginBottom: '6px'
        }}>
          {student.major}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className={`badge ${getStatusColor(student.enrollmentStatus)}`}>
            {student.enrollmentStatus}
          </span>
          <span className="badge badge-secondary">
            {student.academicYear}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        padding: '12px',
        background: 'var(--cream)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{
            fontSize: '11px',
            color: 'var(--secondary)',
            marginBottom: '4px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            GPA
          </div>
          <span className={`badge ${getGPAColor(student.gpa)}`}>
            {student.gpa.toFixed(1)}
          </span>
        </div>
        <div>
          <div style={{
            fontSize: '11px',
            color: 'var(--secondary)',
            marginBottom: '4px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Credits
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>
            {student.creditsCompleted}/{student.creditsRequired}
          </div>
        </div>
      </div>

      {/* Mentor */}
      {student.mentor && (
        <div style={{
          fontSize: '12px',
          color: 'var(--secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px'
        }}>
          <span>👤</span>
          <span>{student.mentor.name}</span>
        </div>
      )}

      {/* Demographics */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {student.firstGeneration && (
          <span className="badge badge-purple" style={{ fontSize: '10px' }}>
            1st Gen
          </span>
        )}
        {student.lowIncome && (
          <span className="badge badge-warning" style={{ fontSize: '10px' }}>
            Low Income
          </span>
        )}
        {student.underrepresentedMinority && (
          <span className="badge badge-secondary" style={{ fontSize: '10px' }}>
            URM
          </span>
        )}
      </div>
    </div>
  );
}

export default StudentCard;