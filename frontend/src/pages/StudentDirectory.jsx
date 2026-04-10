// StudentDirectory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/global.css';
import StudentCard from '../components/StudentCard';
import SearchBar from '../components/SearchBar';

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

  const hasActiveFilters = search || academicYear || enrollmentStatus;
  const clearFilters = () => {
    setSearch('');
    setAcademicYear('');
    setEnrollmentStatus('');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top Section - Full bleed */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        marginBottom: '32px'
      }}>
        <div className="container" style={{ padding: '40px 32px 32px' }}>
          {/* Title Row */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: '30px',
                fontWeight: '800',
                color: 'var(--ink)',
                marginBottom: '6px',
                letterSpacing: '-0.5px'
              }}>
                Student Directory
              </h1>
              <p style={{ color: 'var(--secondary)', fontSize: '15px' }}>
                Browse and manage {students.length} enrolled students
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '28px'
          }}>
            {[
              {
                label: 'Total Students',
                value: students.length,
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                color: 'var(--primary)',
                bg: 'var(--primary-light)'
              },
              {
                label: 'High GPA (3.5+)',
                value: students.filter(s => s.gpa >= 3.5).length,
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ),
                color: 'var(--success)',
                bg: 'var(--success-light)'
              },
              {
                label: 'First Generation',
                value: students.filter(s => s.firstGeneration).length,
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                ),
                color: 'var(--warning)',
                bg: 'var(--warning-light)'
              },
              {
                label: 'Full-time',
                value: students.filter(s => s.enrollmentStatus === 'Full-time').length,
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
                color: 'var(--purple)',
                bg: 'var(--purple-light)'
              }
            ].map((stat, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 18px',
                background: 'var(--paper)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.background = 'var(--white)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--paper)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: 'var(--ink)',
                    lineHeight: '1',
                    marginBottom: '3px'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--secondary)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1 1 300px', minWidth: '240px' }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email or major..."
              />
            </div>

            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              aria-label="Filter by academic year"
              style={{
                appearance: 'none',
                height: '42px',
                padding: '0 36px 0 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border)',
                background: 'var(--white) url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 9L12 15L18 9\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 12px center',
                color: 'var(--ink)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '140px',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Years</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>

            <select
              value={enrollmentStatus}
              onChange={(e) => setEnrollmentStatus(e.target.value)}
              aria-label="Filter by enrollment status"
              style={{
                appearance: 'none',
                height: '42px',
                padding: '0 36px 0 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border)',
                background: 'var(--white) url("data:image/svg+xml,%3Csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M6 9L12 15L18 9\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 12px center',
                color: 'var(--ink)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                minWidth: '160px',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Statuses</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Leave of Absence">Leave of Absence</option>
              <option value="Graduated">Graduated</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  height: '42px',
                  padding: '0 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border)',
                  background: 'var(--white)',
                  color: 'var(--secondary)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--danger)';
                  e.currentTarget.style.color = 'var(--danger)';
                  e.currentTarget.style.background = 'var(--danger-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--secondary)';
                  e.currentTarget.style.background = 'var(--white)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '14px',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '13px', color: 'var(--secondary)' }}>Filters:</span>
              {search && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  "{search}"
                </span>
              )}
              {academicYear && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {academicYear}
                </span>
              )}
              {enrollmentStatus && (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {enrollmentStatus}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                {students.length} result{students.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cards Section */}
      <div className="container" style={{ paddingBottom: '64px' }}>
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && students.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '20px'
          }}>
            {students.map((student, index) => (
              <div key={student.id} style={{
                opacity: 0,
                transform: 'translateY(8px)',
                animation: 'cardIn 0.35s ease forwards',
                animationDelay: `${index * 0.03}s`
              }}>
                <StudentCard student={student} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--ink)',
              marginBottom: '8px'
            }}>
              No students found
            </h3>
            <p style={{ color: 'var(--secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default StudentDirectory;