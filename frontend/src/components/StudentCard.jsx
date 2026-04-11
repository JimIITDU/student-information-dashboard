// StudentCard.jsx
import { useNavigate } from 'react-router-dom';

function StudentCard({ student }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Full-time': return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'Part-time': return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
      case 'Graduated': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      case 'Leave of Absence': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',           // FIX 2: Added flex column
        flexDirection: 'column',   // FIX 2: Added flex column
        minHeight: '320px'        // FIX 2: Forces equal height in grid
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(99,102,241,0.12), 0 4px 10px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Top: Avatar + Name + Arrow */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: gradients[gi], display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '15px', fontWeight: '800', color: '#fff',
          flexShrink: 0, letterSpacing: '0.5px',
          boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
        }}>
          {student.firstName[0]}{student.lastName[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: '700', fontSize: '16px', color: '#0f172a',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginBottom: '3px', letterSpacing: '-0.2px'
          }}>
            {student.firstName} {student.lastName}
          </div>
          <div style={{
            fontSize: '13px', color: '#64748b',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontWeight: '450'
          }}>
            {student.email}
          </div>
        </div>
        <svg 
          className="card-chevron"
          style={{ flexShrink: 0, marginTop: '6px', color: '#cbd5e1' }} 
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>

      {/* Major - FIX 1: Emphasized */}
      <div style={{
        fontSize: '13.5px',       // Increased from 13px
        color: '#334155',         // Darkened from #64748b
        fontWeight: '600',        // Increased from 500
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px'
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> {/* Changed icon color to indigo */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
        </svg>
        {student.major}
      </div>

      {/* Status + Year badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <span style={{
          padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px',
          fontWeight: '600', background: statusStyle.bg, color: statusStyle.color,
          border: `1px solid ${statusStyle.border}`
        }}>
          {student.enrollmentStatus}
        </span>
        <span style={{
          padding: '4px 10px', borderRadius: '8px', fontSize: '11.5px',
          fontWeight: '600', background: '#f8fafc', color: '#475569',
          border: '1px solid #e2e8f0'
        }}>
          {student.academicYear}
        </span>
      </div>

      {/* GPA + Credits Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
        <div style={{ background: gpaStyle.bg, borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: gpaStyle.color, opacity: 0.75, marginBottom: '6px' }}>GPA</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: gpaStyle.color, lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
            {student.gpa.toFixed(2)}
          </div>
          <div style={{ height: '4px', background: `${gpaStyle.bar}20`, borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(student.gpa / 4.0) * 100}%`, background: gpaStyle.bar, borderRadius: '4px', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: '6px' }}>Credits</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
            {student.creditsCompleted}
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', marginLeft: '2px' }}>/ {student.creditsRequired}</span>
          </div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${creditsPercent}%`, background: '#6366f1', borderRadius: '4px', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>
      </div>

      {/* FIX 2: Wrapper to push bottom content down evenly */}
      <div style={{ marginTop: 'auto' }}>
        {/* Mentor */}
        {student.mentor && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', background: '#f8fafc',
            borderRadius: '12px', border: '1px solid #f1f5f9',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 2px 6px rgba(99,102,241,0.2)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px' }}>Mentor</div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {student.mentor.name}
              </div>
            </div>
          </div>
        )}

        {/* Demographics */}
        {(student.firstGeneration || student.lowIncome || student.underrepresentedMinority) && (
          <div style={{
            display: 'flex', gap: '6px', flexWrap: 'wrap',
            paddingTop: '14px', borderTop: '1px solid #f1f5f9'
          }}>
            {student.firstGeneration && (
              <span style={{ padding: '3px 9px', borderRadius: '7px', background: '#faf5ff', color: '#9333ea', fontSize: '11px', fontWeight: '600', border: '1px solid #e9d5ff' }}>1st Gen</span>
            )}
            {student.lowIncome && (
              <span style={{ padding: '3px 9px', borderRadius: '7px', background: '#fff7ed', color: '#ea580c', fontSize: '11px', fontWeight: '600', border: '1px solid #fed7aa' }}>Low Income</span>
            )}
            {student.underrepresentedMinority && (
              <span style={{ padding: '3px 9px', borderRadius: '7px', background: '#fdf2f8', color: '#db2777', fontSize: '11px', fontWeight: '600', border: '1px solid #fbcfe8' }}>URM</span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .card-chevron {
          opacity: 0.4;
          transform: translateX(-4px);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        [role="button"]:hover .card-chevron {
          opacity: 1;
          transform: translateX(0);
          color: #6366f1;
        }
      `}</style>
    </div>
  );
}

export default StudentCard;