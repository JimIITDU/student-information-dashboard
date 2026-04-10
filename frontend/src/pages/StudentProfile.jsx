import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('academic');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudent(id);
        setStudent(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!student) return null;

  // GPA chart data - simulated trend
  const gpaData = [
    { semester: 'Sem 1', gpa: (student.gpa - 0.3).toFixed(1) },
    { semester: 'Sem 2', gpa: (student.gpa - 0.2).toFixed(1) },
    { semester: 'Sem 3', gpa: (student.gpa - 0.1).toFixed(1) },
    { semester: 'Sem 4', gpa: student.gpa.toFixed(1) },
  ];

  const creditsPercent = Math.round(
    (student.creditsCompleted / student.creditsRequired) * 100
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Awarded': return 'badge-success';
      case 'Applied': return 'badge-primary';
      case 'Interview': return 'badge-purple';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getMeetingStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Scheduled': return 'badge-primary';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div>
      <div className="container" style={{ paddingTop: '32px' }}>

        {/* Back Button */}
        <button
  onClick={() => navigate('/')}
  aria-label="Back to student directory"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: 'var(--secondary)',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '24px',
    padding: '0',
    transition: 'color 0.2s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink)'}
  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
>
  ← Back to Directory
</button>

        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div style={{
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'var(--primary-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  fontWeight: '700',
  color: 'var(--primary)',
  flexShrink: 0,
  overflow: 'hidden'
}}>
  {student.avatarUrl ? (
    <img
      src={student.avatarUrl}
      alt={`${student.firstName} ${student.lastName}`}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.parentNode.innerHTML = `${student.firstName[0]}${student.lastName[0]}`;
      }}
    />
  ) : (
    `${student.firstName[0]}${student.lastName[0]}`
  )}
</div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: 'var(--ink)' }}>
                    {student.firstName} {student.lastName}
                  </h1>
                  <p style={{ color: 'var(--secondary)', marginBottom: '8px' }}>
                    {student.email}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{student.academicYear}</span>
                    <span className="badge badge-secondary">{student.enrollmentStatus}</span>
                    <span className="badge badge-secondary">{student.major}</span>
                    {student.firstGeneration && <span className="badge badge-purple">1st Gen</span>}
                    {student.lowIncome && <span className="badge badge-warning">Low Income</span>}
                    {student.underrepresentedMinority && <span className="badge badge-warning">URM</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>
                    {student.gpa.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--secondary)' }}>GPA</div>
                </div>
              </div>

              {/* Mentor */}
              {student.mentor && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'var(--cream)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {student.mentor.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{student.mentor.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                      {student.mentor.title} at {student.mentor.company}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0'
        }}>
          {['academic', 'scholarships', 'meetings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--secondary)',
                fontWeight: activeTab === tab ? '600' : '400',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {tab === 'academic' ? '📊 Academic' :
               tab === 'scholarships' ? '🎓 Scholarships' : '🤝 Meetings'}
            </button>
          ))}
        </div>

        {/* Academic Tab */}
        {activeTab === 'academic' && (
          <div className="grid grid-2">
            {/* GPA Chart */}
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
                GPA Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={gpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--primary)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Credits Progress */}
            <div className="card">
              <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
                Credit Progress
              </h3>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary)' }}>
                  {creditsPercent}%
                </div>
                <div style={{ color: 'var(--secondary)', fontSize: '14px' }}>
                  {student.creditsCompleted} of {student.creditsRequired} credits
                </div>
              </div>
              <div style={{
                height: '12px',
                background: 'var(--cream)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${creditsPercent}%`,
                  background: 'var(--primary)',
                  borderRadius: '6px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{
                marginTop: '16px',
                fontSize: '13px',
                color: 'var(--secondary)'
              }}>
                Expected Graduation: {new Date(student.expectedGraduation).toLocaleDateString()}
              </div>
            </div>

            {/* Student Details */}
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
                Student Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Major', value: student.major },
                  { label: 'Academic Year', value: student.academicYear },
                  { label: 'Enrollment', value: student.enrollmentStatus },
                  { label: 'First Generation', value: student.firstGeneration ? 'Yes' : 'No' },
                  { label: 'Low Income', value: student.lowIncome ? 'Yes' : 'No' },
                  { label: 'Underrepresented Minority', value: student.underrepresentedMinority ? 'Yes' : 'No' },
                ].map((item) => (
                  <div key={item.label} style={{
                    padding: '12px',
                    background: 'var(--cream)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <div style={{ fontSize: '11px', color: 'var(--secondary)', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                Scholarships ({student.scholarships?.length || 0})
              </h3>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/student/${id}/scholarships`)}
              >
                Manage Scholarships
              </button>
            </div>

            {student.scholarships?.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--secondary)' }}>
                No scholarships found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {student.scholarships?.map((scholarship) => (
                  <div key={scholarship.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {scholarship.name}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '8px' }}>
                          {scholarship.provider}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span className={`badge ${getStatusColor(scholarship.status)}`}>
                            {scholarship.status}
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                            Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'var(--success)'
                      }}>
                        ${scholarship.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>
                Meetings ({student.meetings?.length || 0})
              </h3>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/student/${id}/meetings`)}
              >
                Manage Meetings
              </button>
            </div>

            {student.meetings?.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--secondary)' }}>
                No meetings found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {student.meetings?.map((meeting) => (
                  <div key={meeting.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          Meeting with {meeting.mentor?.name}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '8px' }}>
                          {new Date(meeting.date).toLocaleDateString()} · {meeting.duration} mins
                        </div>
                        <span className={`badge ${getMeetingStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                      </div>
                    </div>
                    {meeting.notes && (
                      <div style={{
                        marginTop: '12px',
                        padding: '10px',
                        background: 'var(--cream)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        color: 'var(--secondary)'
                      }}>
                        {meeting.notes}
                      </div>
                    )}
                    {meeting.actionItems?.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                          Action Items:
                        </div>
                        {meeting.actionItems.map((item, i) => (
                          <div key={i} style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                            → {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;