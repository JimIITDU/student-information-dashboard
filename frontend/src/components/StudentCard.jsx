// StudentCard.jsx — NO .card class, all inline to avoid hover conflicts
import { useNavigate } from 'react-router-dom';

function StudentCard({ student }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Full-time': return { bg: 'var(--primary-light)', color: 'var(--primary)' };
      case 'Part-time': return { bg: 'var(--warning-light)', color: 'var(--warning)' };
      case 'Graduated': return { bg: 'var(--success-light)', color: 'var(--success)' };
      case 'Leave of Absence': return { bg: 'var(--danger-light)', color: 'var(--danger)' };
      default: return { bg: 'var(--cream)', color: 'var(--secondary)' };
    }
  };

  const getGPAStyle = (gpa) => {
    if (gpa >= 3.5) return { color: '#059669', bg: '#ecfdf5', bar: '#10b981' };
    if (gpa >= 3.0) return { color: '#d97706', bg: '#fffbeb', bar: '#f59e0b' };
    return { color: '#dc2626', bg: '#fef2f2', bar: '#ef4444' };
  };

  const creditsPercent = Math.min((student.creditsCompleted / student.creditsRequired) * 100, 100);
  const statusStyle = getStatusColor(student.enrollmentStatus);
  const gpaStyle = getGPAStyle(student.gpa);

  const gradients = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #6366f1)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #14b8a6, #06b6d4)',
  ];
  const gi = (student.firstName.charCodeAt(0) + student.lastName.charCodeAt(0)) % gradients.length;

  return (
    <div
      onClick={() => navigate(`/student/${student.id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${student.firstName} ${student.lastName}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/student/${student.id}`)}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Top: Avatar + Name + Arrow */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: gradients[gi],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: '#fff',
          flexShrink: 0,
          letterSpacing: '0.5px'
        }}>
          {student.firstName[0]}{student.lastName[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: '700',
            fontSize: '15px',
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {student.firstName} {student.lastName}
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '2px'
          }}>
            {student.email}
          </div>
        </div>
        <svg style={{
          flexShrink: 0,
          marginTop: '4px',
          color: 'var(--border)',
          transition: 'all 0.25s ease'
        }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="card-chevron"
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      {/* Major */}
      <div style={{
        fontSize: '13px',
        color: 'var(--secondary)',
        fontWeight: '500',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
        </svg>
        {student.major}
      </div>

      {/* Status + Year badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          background: statusStyle.bg,
          color: statusStyle.color
        }}>
          {student.enrollmentStatus}
        </span>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          background: 'var(--cream)',
          color: 'var(--secondary)',
          border: '1px solid var(--border)'
        }}>
          {student.academicYear}
        </span>
      </div>

      {/* GPA + Credits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '18px'
      }}>
        <div style={{
          background: gpaStyle.bg,
          borderRadius: '10px',
          padding: '12px 14px'
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: gpaStyle.color,
            opacity: 0.7,
            marginBottom: '4px'
          }}>GPA</div>
<div style={{ fontSize: '20px', fontWeight: '800', color: gpaStyle.color, lineHeight: '1' }}>
            {student.gpa.toFixed(2)}
          </div>
          <div style={{
            height: '3px',
            background: `${gpaStyle.bar}20`,
            borderRadius: '3px',
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(student.gpa / 4.0) * 100}%`,
              background: gpaStyle.bar,
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
        <div style={{
          background: 'var(--paper)',
          borderRadius: '10px',
          padding: '12px 14px',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--secondary)',
            marginBottom: '4px'
          }}>Credits</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink)', lineHeight: '1' }}>
            {student.creditsCompleted}
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--secondary)', marginLeft: '1px' }}>
              /{student.creditsRequired}
            </span>
          </div>
          <div style={{
            height: '3px',
            background: 'var(--border)',
            borderRadius: '3px',
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${creditsPercent}%`,
              background: 'var(--primary)',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Mentor */}
      {student.mentor && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          background: 'var(--paper)',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          marginBottom: '14px'
        }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: 'var(--secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mentor
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {student.mentor.name}
            </div>
          </div>
        </div>
      )}

      {/* Demographics */}
      {(student.firstGeneration || student.lowIncome || student.underrepresentedMinority) && (
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)'
        }}>
          {student.firstGeneration && (
            <span style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'var(--purple-light)',
              color: 'var(--purple)',
              fontSize: '11px',
              fontWeight: '600'
            }}>1st Gen</span>
          )}
          {student.lowIncome && (
            <span style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'var(--warning-light)',
              color: 'var(--warning)',
              fontSize: '11px',
              fontWeight: '600'
            }}>Low Income</span>
          )}
          {student.underrepresentedMinority && (
            <span style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'var(--cream)',
              color: 'var(--secondary)',
              fontSize: '11px',
              fontWeight: '600',
              border: '1px solid var(--border)'
            }}>URM</span>
          )}
        </div>
      )}

      <style>{`
        .card-chevron {
          opacity: 0.4;
          transform: translateX(-4px);
          transition: all 0.25s ease;
        }
        [role="button"]:hover .card-chevron {
          opacity: 1;
          transform: translateX(0);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}

export default StudentCard;