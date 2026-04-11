// StudentDirectory.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StudentCard from '../components/StudentCard';
import SearchBar from '../components/SearchBar';
import '../styles/global.css';

function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
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

  const sortedStudents = useMemo(() => {
    const copy = [...students];
    switch (sortBy) {
      case 'name-asc': return copy.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
      case 'name-desc': return copy.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
      case 'gpa-desc': return copy.sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
      case 'gpa-asc': return copy.sort((a, b) => (a.gpa || 0) - (b.gpa || 0));
      default: return copy;
    }
  }, [students, sortBy]);

  const stats = [
    {
      label: 'Total Students',
      value: students.length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      ring: 'rgba(99,102,241,0.12)'
    },
    {
      label: 'High GPA (3.5+)',
      value: students.filter(s => s.gpa >= 3.5).length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      ring: 'rgba(245,158,11,0.12)'
    },
    {
      label: 'First Generation',
      value: students.filter(s => s.firstGeneration).length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      ring: 'rgba(16,185,129,0.12)'
    },
    {
      label: 'Full-time',
      value: students.filter(s => s.enrollmentStatus === 'Full-time').length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      ring: 'rgba(139,92,246,0.12)'
    }
  ];

  const selectStyle = {
    appearance: 'none',
    height: '44px',
    padding: '0 40px 0 16px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    background: `white url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center`,
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
  };

  return (
    <div className="student-directory" style={{
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accents */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-300px', left: '-200px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Header Section */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '32px'
      }}>
        <div className="container" style={{ padding: '48px 32px 36px' }}>

          {/* Title Area */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: '32px',
            flexWrap: 'wrap', gap: '16px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
                border: '1px solid rgba(99,102,241,0.15)',
                marginBottom: '16px', fontSize: '12px',
                fontWeight: '700', color: '#6366f1',
                textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#6366f1',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                Live Directory
              </div>
              <h1 style={{
                fontSize: '36px', fontWeight: '800', color: '#0f172a',
                marginBottom: '8px', letterSpacing: '-0.8px', lineHeight: '1.1',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
              }}>
                Student Directory
              </h1>
              <p style={{
                color: '#64748b', fontSize: '15px',
                fontWeight: '450', lineHeight: '1.5'
              }}>
                Browse and manage {loading ? '—' : students.length} enrolled students across all programs
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px', marginBottom: '32px'
          }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  position: 'relative', display: 'flex',
                  alignItems: 'center', gap: '16px',
                  padding: '20px', background: '#ffffff',
                  borderRadius: '16px', border: '1px solid #e2e8f0',
                  overflow: 'hidden', cursor: 'default',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  opacity: loading ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (loading) return;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${stat.ring}, 0 2px 8px rgba(0,0,0,0.04)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: stat.ring, transition: 'all 0.3s ease', opacity: 0.7
                }} />
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: stat.gradient, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: '#ffffff',
                  boxShadow: `0 4px 12px ${stat.ring}`,
                  position: 'relative', zIndex: 1
                }}>
                  {stat.icon}
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '28px', fontWeight: '800', color: '#0f172a',
                    lineHeight: '1', marginBottom: '4px',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {loading ? '—' : stat.value}
                  </div>
                  <div style={{
                    fontSize: '11.5px', color: '#64748b', fontWeight: '600',
                    textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            flexWrap: 'wrap', padding: '16px 20px',
            background: '#ffffff', borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ flex: '1 1 300px', minWidth: '240px' }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email or major..."
              />
            </div>

            <div style={{
              width: '1px', height: '28px',
              background: '#e2e8f0', flexShrink: 0
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: '4px' }}>
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>

              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                aria-label="Filter by academic year"
                style={{
                  ...selectStyle,
                  border: academicYear ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                  background: academicYear
                    ? `linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04)) url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center`
                    : selectStyle.background,
                  minWidth: '150px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
                }}
                onBlur={(e) => {
                  if (!academicYear) e.target.style.borderColor = '#e2e8f0';
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
                  ...selectStyle,
                  border: enrollmentStatus ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                  background: enrollmentStatus
                    ? `linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04)) url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center`
                    : selectStyle.background,
                  minWidth: '170px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
                }}
                onBlur={(e) => {
                  if (!enrollmentStatus) e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">All Statuses</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Leave of Absence">Leave of Absence</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>

            {/* Sort */}
            <div style={{
              width: '1px', height: '28px',
              background: '#e2e8f0', flexShrink: 0
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <line x1="4" y1="6" x2="11" y2="6"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="18" x2="7" y2="18"/>
                <polyline points="15 9 18 6 21 9"/><line x1="18" y1="6" x2="18" y2="18"/>
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort students"
                style={{
                  ...selectStyle,
                  minWidth: '140px',
                  border: sortBy !== 'name-asc' ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
                  background: sortBy !== 'name-asc'
                    ? `linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04)) url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center`
                    : selectStyle.background
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
                }}
                onBlur={(e) => {
                  if (sortBy === 'name-asc') e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="name-asc">Name A→Z</option>
                <option value="name-desc">Name Z→A</option>
                <option value="gpa-desc">GPA High→Low</option>
                <option value="gpa-asc">GPA Low→High</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                style={{
                  height: '44px', padding: '0 18px', borderRadius: '12px',
                  border: '1.5px solid #fecaca', background: '#fff5f5',
                  color: '#ef4444', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff5f5';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = '#fecaca';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear all
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginTop: '16px', flexWrap: 'wrap', paddingLeft: '4px'
            }}>
              <span style={{
                fontSize: '12px', color: '#64748b', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                Active:
              </span>
              {search && (
                <span className="filter-chip" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                  color: '#6366f1', fontSize: '12.5px', fontWeight: '600',
                  border: '1px solid rgba(99,102,241,0.15)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  "{search}"
                </span>
              )}
              {academicYear && (
                <span className="filter-chip" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                  color: '#6366f1', fontSize: '12.5px', fontWeight: '600',
                  border: '1px solid rgba(99,102,241,0.15)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  {academicYear}
                </span>
              )}
              {enrollmentStatus && (
                <span className="filter-chip" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                  color: '#6366f1', fontSize: '12.5px', fontWeight: '600',
                  border: '1px solid rgba(99,102,241,0.15)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  {enrollmentStatus}
                </span>
              )}
              {sortBy !== 'name-asc' && (
                <span className="filter-chip" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.06))',
                  color: '#059669', fontSize: '12.5px', fontWeight: '600',
                  border: '1px solid rgba(16,185,129,0.15)'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="11" y2="6"/><line x1="4" y1="12" x2="9" y2="12"/><line x1="4" y1="18" x2="7" y2="18"/>
                    <polyline points="15 9 18 6 21 9"/><line x1="18" y1="6" x2="18" y2="18"/>
                  </svg>
                  {sortBy === 'name-desc' ? 'Name Z→A' : sortBy === 'gpa-desc' ? 'GPA High→Low' : 'GPA Low→High'}
                </span>
              )}
              <span style={{
                fontSize: '12px', color: '#64748b',
                fontWeight: '500', marginLeft: '4px'
              }}>
                → {students.length} result{students.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cards Section */}
      <div className="container" style={{ paddingBottom: '80px', position: 'relative', zIndex: 1 }}>

        {/* Dismissable Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderRadius: '12px', marginBottom: '24px',
            background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
            fontSize: '14px', fontWeight: '500'
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{
              background: 'none', border: 'none', color: '#dc2626',
              cursor: 'pointer', padding: '4px', display: 'flex'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Loading state - inline spinner */}
        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 24px', gap: '16px'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              border: '3px solid #e2e8f0', borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{
              fontSize: '14px', color: '#64748b', fontWeight: '500'
            }}>
              Loading students...
            </span>
          </div>
        )}

        {/* Loaded - cards */}
        {!loading && !error && sortedStudents.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))',
            gap: '16px'
          }}>
            {sortedStudents.map((student, index) => (
              <div key={student.id} style={{
                opacity: 0, transform: 'translateY(12px)',
                animation: 'rowSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: `${index * 0.04}s`
              }}>
                <StudentCard student={student} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && sortedStudents.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 32px',
            background: '#ffffff', border: '1.5px dashed #e2e8f0',
            borderRadius: '24px', maxWidth: '480px', margin: '40px auto',
            animation: 'tabFadeIn 0.3s ease'
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', border: '1px solid #e2e8f0'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px', fontWeight: '700', color: '#0f172a',
              marginBottom: '8px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
            }}>
              No students found
            </h3>
            <p style={{
              color: '#64748b', fontSize: '14px', marginBottom: '28px',
              lineHeight: '1.6', fontWeight: '450'
            }}>
              We couldn't find any students matching your current filters. Try broadening your search.
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: '12px 28px', borderRadius: '12px',
                fontSize: '14px', fontWeight: '600', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)';
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes chipIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .student-directory .stat-card:hover > div:first-of-type {
          transform: scale(1.1);
        }

        .filter-chip {
          animation: chipIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .student-directory select option {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @media (max-width: 900px) {
          .student-directory [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 600px) {
          .student-directory [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
          .student-directory [style*="grid-template-columns: repeat(auto-fill"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default StudentDirectory;