import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStudents({ search, academicYear, enrollmentStatus });
      setStudents(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, academicYear, enrollmentStatus]);

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
    <div>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">
            {students.length} students enrolled
          </p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <input
                className="form-input"
                type="text"
                placeholder="Search by name, email or major..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search students"
              />
            </div>
            <select
              className="form-input"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              aria-label="Filter by academic year"
            >
              <option value="">All Years</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
            <select
              className="form-input"
              value={enrollmentStatus}
              onChange={(e) => setEnrollmentStatus(e.target.value)}
              aria-label="Filter by enrollment status"
            >
              <option value="">All Statuses</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Leave of Absence">Leave of Absence</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <div className="grid grid-3">
            {students.map((student) => (
              <div
                key={student.id}
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
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: 'var(--primary)',
                    flexShrink: 0
                  }}>
                    {student.firstName[0]}{student.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                      {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                      {student.email}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '4px' }}>
                    {student.major}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--secondary)', marginBottom: '2px' }}>GPA</div>
                    <span className={`badge ${getGPAColor(student.gpa)}`}>
                      {student.gpa.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--secondary)', marginBottom: '2px' }}>Credits</div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>
                      {student.creditsCompleted}/{student.creditsRequired}
                    </div>
                  </div>
                </div>

                {/* Mentor */}
                {student.mentor && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    👤 {student.mentor.name}
                  </div>
                )}

                {/* Demographics */}
                <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {student.firstGeneration && (
                    <span className="badge badge-purple" style={{ fontSize: '10px' }}>1st Gen</span>
                  )}
                  {student.lowIncome && (
                    <span className="badge badge-warning" style={{ fontSize: '10px' }}>Low Income</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--secondary)' }}>
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDirectory;