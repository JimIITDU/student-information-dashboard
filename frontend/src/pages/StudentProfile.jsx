import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
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

  const gpaData = [
    { semester: 'Sem 1', gpa: +(student.gpa - 0.35).toFixed(2) },
    { semester: 'Sem 2', gpa: +(student.gpa - 0.22).toFixed(2) },
    { semester: 'Sem 3', gpa: +(student.gpa - 0.10).toFixed(2) },
    { semester: 'Sem 4', gpa: +student.gpa.toFixed(2) },
  ];

  const creditsPercent = Math.round(
    (student.creditsCompleted / student.creditsRequired) * 100
  );

  const totalAwarded = student.scholarships
    ?.filter(s => s.status === 'Awarded')
    .reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

  const completedMeetings = student.meetings?.filter(m => m.status === 'Completed').length || 0;
  const totalMeetings = student.meetings?.length || 0;

  const getStatusStyle = (status) => {
    const map = {
      'Awarded': { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e', border: '#bbf7d0' },
      'Applied': { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', border: '#bfdbfe' },
      'Interview': { bg: '#faf5ff', text: '#9333ea', dot: '#a855f7', border: '#e9d5ff' },
      'Rejected': { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', border: '#fecaca' },
      'Researching': { bg: '#f8fafc', text: '#64748b', dot: '#64748b', border: '#e2e8f0' }
    };
    return map[status] || map['Researching'];
  };

  const getMeetingStyle = (status) => {
    const map = {
      'Completed': { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e', border: '#bbf7d0' },
      'Scheduled': { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6', border: '#bfdbfe' },
      'Cancelled': { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', border: '#fecaca' }
    };
    return map[status] || map['Scheduled'];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#0f172a',
          padding: '10px 14px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px', fontWeight: '600' }}>{label}</p>
          <p style={{ fontSize: '15px', color: '#ffffff', margin: 0, fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
            {payload[0].value.toFixed(2)} GPA
          </p>
        </div>
      );
    }
    return null;
  };

  const tabs = [
    {
      key: 'academic',
      label: 'Academic',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>
        </svg>
      ),
      count: null
    },
    {
      key: 'scholarships',
      label: 'Scholarships',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      ),
      count: student.scholarships?.length || 0
    },
    {
      key: 'meetings',
      label: 'Meetings',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      count: student.meetings?.length || 0
    }
  ];

  const detailItems = [
    { label: 'Major', value: student.major, icon: '📚' },
    { label: 'Academic Year', value: student.academicYear, icon: '🎓' },
    { label: 'Enrollment', value: student.enrollmentStatus, icon: '📋' },
    { label: 'First Generation', value: student.firstGeneration ? 'Yes' : 'No', icon: '🌟' },
    { label: 'Low Income', value: student.lowIncome ? 'Yes' : 'No', icon: '💼' },
    { label: 'Underrepresented Minority', value: student.underrepresentedMinority ? 'Yes' : 'No', icon: '🤝' },
  ];

  return (
    <div className="student-profile" style={{
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accents */}
      <div style={{
        position: 'fixed', top: '-200px', left: '-100px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          aria-label="Back to student directory"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: '#64748b',
            fontSize: '13.5px', fontWeight: '500', cursor: 'pointer',
            marginBottom: '28px', padding: '6px 0',
            transition: 'all 0.2s ease', fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#6366f1';
            e.currentTarget.style.gap = '12px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.gap = '8px';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Directory
        </button>

        {/* Profile Hero */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Banner */}
          <div style={{
            height: '100px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a78bfa 70%, #c4b5fd 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Banner pattern */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)`,
            }} />
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Profile Content */}
          <div style={{ padding: '0 32px 28px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              width: '96px', height: '96px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: '800', color: '#ffffff',
              flexShrink: 0, overflow: 'hidden',
              border: '4px solid #ffffff',
              boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
              marginTop: '-48px',
              position: 'relative',
              zIndex: 2,
              letterSpacing: '-0.5px'
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

            {/* Top row: Name + GPA */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginTop: '16px',
              flexWrap: 'wrap', gap: '20px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '28px', fontWeight: '800', color: '#0f172a',
                  letterSpacing: '-0.5px', lineHeight: '1.15',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  marginBottom: '6px'
                }}>
                  {student.firstName} {student.lastName}
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '450', marginBottom: '14px' }}>
                  {student.email}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { label: student.academicYear, bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
                    { label: student.enrollmentStatus, bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
                    { label: student.major, bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff' },
                    ...(student.firstGeneration ? [{ label: '1st Gen', bg: '#fffbeb', text: '#d97706', border: '#fde68a' }] : []),
                    ...(student.lowIncome ? [{ label: 'Low Income', bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' }] : []),
                    ...(student.underrepresentedMinority ? [{ label: 'URM', bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' }] : []),
                  ].map((badge, i) => (
                    <span key={i} style={{
                      padding: '4px 11px', borderRadius: '8px',
                      background: badge.bg, color: badge.text,
                      fontSize: '12px', fontWeight: '600',
                      border: `1px solid ${badge.border}`,
                      letterSpacing: '0.01em'
                    }}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* GPA Display */}
              <div style={{
                textAlign: 'center', padding: '16px 24px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))',
                borderRadius: '16px', border: '1px solid rgba(99,102,241,0.1)',
                minWidth: '100px'
              }}>
                <div style={{
                  fontSize: '38px', fontWeight: '800', color: '#6366f1',
                  lineHeight: '1', marginBottom: '4px',
                  fontFamily: "'Inter', sans-serif",
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {student.gpa.toFixed(2)}
                </div>
                <div style={{
                  fontSize: '11px', color: '#64748b', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>
                  Cumulative GPA
                </div>
              </div>
            </div>

            {/* Mentor Card */}
            {student.mentor && (
              <div style={{
                marginTop: '20px', padding: '14px 18px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '14px', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontSize: '15px', fontWeight: '700',
                  flexShrink: 0,
                  boxShadow: '0 3px 10px rgba(99,102,241,0.2)'
                }}>
                  {student.mentor.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>
                    {student.mentor.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: '450' }}>
                    {student.mentor.title} at {student.mentor.company}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '8px',
                  background: '#f0fdf4', color: '#16a34a',
                  fontSize: '11px', fontWeight: '700',
                  border: '1px solid #bbf7d0',
                  textTransform: 'uppercase', letterSpacing: '0.04em'
                }}>
                  Mentor
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {[
            {
              label: 'Credits Completed',
              value: `${student.creditsCompleted}`,
              sub: `of ${student.creditsRequired}`,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
              ring: 'rgba(99,102,241,0.1)'
            },
            {
              label: 'Total Awarded',
              value: `$${totalAwarded.toLocaleString()}`,
              sub: 'in scholarships',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #10b981, #34d399)',
              ring: 'rgba(16,185,129,0.1)'
            },
            {
              label: 'Meetings Held',
              value: `${completedMeetings}`,
              sub: `of ${totalMeetings} total`,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <polyline points="23 11 23 17 17 17"/>
                  <path d="M16 16l-4-4-4 4"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              ring: 'rgba(245,158,11,0.1)'
            },
            {
              label: 'Graduation',
              value: new Date(student.expectedGraduation).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              sub: 'expected',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
              ring: 'rgba(239,68,68,0.1)'
            }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '18px', background: '#ffffff',
                borderRadius: '14px', border: '1px solid #e2e8f0',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'default', position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = `0 8px 25px ${stat.ring}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: stat.gradient, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: `0 3px 10px ${stat.ring}`
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '20px', fontWeight: '800', color: '#0f172a',
                lineHeight: '1', marginBottom: '3px',
                fontFamily: "'Inter', sans-serif",
                fontVariantNumeric: 'tabular-nums'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '11px', color: '#64748b', fontWeight: '500',
                lineHeight: '1.3'
              }}>
                {stat.label} <span style={{ opacity: 0.7 }}>· {stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '6px', marginBottom: '24px',
          padding: '5px', background: '#f1f5f9',
          borderRadius: '14px', width: 'fit-content'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '10px',
                background: activeTab === tab.key ? '#ffffff' : 'transparent',
                border: 'none',
                color: activeTab === tab.key ? '#0f172a' : '#64748b',
                fontWeight: activeTab === tab.key ? '600' : '500',
                fontSize: '13.5px', cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: activeTab === tab.key
                  ? '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)'
                  : 'none'
              }}
              aria-selected={activeTab === tab.key}
              role="tab"
            >
              <span style={{
                display: 'flex',
                color: activeTab === tab.key ? '#6366f1' : '#64748b',
                transition: 'color 0.2s'
              }}>
                {tab.icon}
              </span>
              {tab.label}
              {tab.count !== null && (
                <span style={{
                  padding: '1px 7px', borderRadius: '6px',
                  background: activeTab === tab.key ? 'rgba(99,102,241,0.1)' : '#e2e8f0',
                  color: activeTab === tab.key ? '#6366f1' : '#64748b',
                  fontSize: '11px', fontWeight: '700',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════ ACADEMIC TAB ═══════════ */}
        {activeTab === 'academic' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '16px',
            animation: 'tabFadeIn 0.3s ease'
          }}>
            {/* GPA Chart */}
            <div style={{
              background: '#ffffff', borderRadius: '18px',
              border: '1px solid #e2e8f0', padding: '24px',
              gridColumn: '1 / -1'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '16px', fontWeight: '700', color: '#0f172a',
                    fontFamily: "'Inter', sans-serif", marginBottom: '2px'
                  }}>
                    GPA Trend
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '450' }}>
                    Semester-over-semester performance
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px', borderRadius: '8px',
                  background: student.gpa >= 3.5 ? '#f0fdf4' : student.gpa >= 3.0 ? '#fffbeb' : '#fef2f2',
                  color: student.gpa >= 3.5 ? '#16a34a' : student.gpa >= 3.0 ? '#d97706' : '#dc2626',
                  fontSize: '12px', fontWeight: '700',
                  border: `1px solid ${student.gpa >= 3.5 ? '#bbf7d0' : student.gpa >= 3.0 ? '#fde68a' : '#fecaca'}`
                }}>
                  {student.gpa >= 3.5 ? '★ Dean\'s List' : student.gpa >= 3.0 ? 'Good Standing' : 'At Risk'}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={gpaData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="semester"
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: '500' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[2.0, 4.0]}
                    tick={{ fontSize: 12, fill: '#64748b', fontWeight: '500' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="gpa"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#gpaGradient)"
                    dot={{ fill: '#6366f1', strokeWidth: 0, r: 5 }}
                    activeDot={{ fill: '#6366f1', strokeWidth: 3, stroke: '#ffffff', r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Credits Progress */}
            <div style={{
              background: '#ffffff', borderRadius: '18px',
              border: '1px solid #e2e8f0', padding: '24px'
            }}>
              <h3 style={{
                fontSize: '16px', fontWeight: '700', color: '#0f172a',
                fontFamily: "'Inter', sans-serif", marginBottom: '20px'
              }}>
                Credit Progress
              </h3>
              <div style={{
                width: '140px', height: '140px', borderRadius: '50%',
                background: `conic-gradient(#6366f1 0% ${creditsPercent}%, #f1f5f9 ${creditsPercent}% 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', position: 'relative'
              }}>
                <div style={{
                  width: '110px', height: '110px', borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '32px', fontWeight: '800', color: '#0f172a',
                    lineHeight: '1', fontFamily: "'Inter', sans-serif",
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {creditsPercent}%
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>complete</span>
                </div>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '12px 16px', background: '#f8fafc',
                borderRadius: '10px', fontSize: '13px'
              }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {student.creditsCompleted}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>Completed</div>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0' }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {student.creditsRequired - student.creditsCompleted}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>Remaining</div>
                </div>
                <div style={{ width: '1px', background: '#e2e8f0' }} />
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {student.creditsRequired}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', fontWeight: '500' }}>Required</div>
                </div>
              </div>
            </div>

            {/* Student Details */}
            <div style={{
              background: '#ffffff', borderRadius: '18px',
              border: '1px solid #e2e8f0', padding: '24px'
            }}>
              <h3 style={{
                fontSize: '16px', fontWeight: '700', color: '#0f172a',
                fontFamily: "'Inter', sans-serif", marginBottom: '16px'
              }}>
                Student Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {detailItems.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '12px 14px',
                    borderRadius: '10px',
                    transition: 'background 0.15s ease',
                    cursor: 'default'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '15px' }}>{item.icon}</span>
                      <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '500' }}>
                        {item.label}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '13.5px', fontWeight: '600', color: '#0f172a',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ SCHOLARSHIPS TAB ═══════════ */}
        {activeTab === 'scholarships' && (
          <div style={{ animation: 'tabFadeIn 0.3s ease' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '18px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', color: '#0f172a',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Scholarship Applications
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '450', marginTop: '2px' }}>
                  {student.scholarships?.length || 0} total · ${totalAwarded.toLocaleString()} awarded
                </p>
              </div>
              <button
                onClick={() => navigate(`/student/${id}/scholarships`)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  height: '40px', padding: '0 18px', borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#ffffff', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 3px 12px rgba(99,102,241,0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 5px 16px rgba(99,102,241,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(99,102,241,0.3)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Manage
              </button>
            </div>

            {student.scholarships?.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '64px 32px',
                background: '#ffffff', border: '1.5px dashed #e2e8f0',
                borderRadius: '20px'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, #f1f5f9, #e8edf3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', border: '1px solid #e2e8f0'
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                  No scholarships yet
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '450' }}>
                  Start tracking scholarship opportunities for this student.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {student.scholarships?.map((s, index) => {
                  const sc = getStatusStyle(s.status);
                  const daysLeft = Math.ceil((new Date(s.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div
                      key={s.id}
                      style={{
                        background: '#ffffff', borderRadius: '14px',
                        border: '1px solid #e2e8f0', padding: '18px 20px',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', gap: '16px',
                        transition: 'all 0.2s ease',
                        cursor: 'default',
                        opacity: 0, transform: 'translateY(8px)',
                        animation: 'rowSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
                        animationDelay: `${index * 0.05}s`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = sc.border;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: '600', fontSize: '14.5px', color: '#0f172a',
                          marginBottom: '4px', fontFamily: "'Inter', sans-serif"
                        }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '450', marginBottom: '8px' }}>
                          {s.provider}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '3px 10px', borderRadius: '6px',
                            background: sc.bg, color: sc.text,
                            fontSize: '11.5px', fontWeight: '600',
                            border: `1px solid ${sc.border}`
                          }}>
                            <span style={{
                              width: '5px', height: '5px', borderRadius: '50%',
                              background: sc.dot
                            }} />
                            {s.status}
                          </span>
                                                    <span style={{
                            fontSize: '12px', color: '#64748b', fontWeight: '450',
                            display: 'inline-flex', alignItems: 'center', gap: '4px'
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {new Date(s.deadline).toLocaleString('en-US', { 
                              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        textAlign: 'right', flexShrink: 0
                      }}>
                        <div style={{
                          fontSize: '22px', fontWeight: '800', color: '#0f172a',
                          fontFamily: "'Inter', sans-serif",
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: '1'
                        }}>
                          ${s.amount.toLocaleString()}
                        </div>
                        <div style={{
                          fontSize: '11px', color: '#64748b', fontWeight: '500', marginTop: '2px'
                        }}>
                          {s.currency}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ MEETINGS TAB ═══════════ */}
        {activeTab === 'meetings' && (
          <div style={{ animation: 'tabFadeIn 0.3s ease' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '18px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', color: '#0f172a',
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Meeting History
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '450', marginTop: '2px' }}>
                  {completedMeetings} of {totalMeetings} completed
                </p>
              </div>
              <button
                onClick={() => navigate(`/student/${id}/meetings`)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  height: '40px', padding: '0 18px', borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#ffffff', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 3px 12px rgba(99,102,241,0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 5px 16px rgba(99,102,241,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(99,102,241,0.3)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Manage
              </button>
            </div>

            {student.meetings?.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '64px 32px',
                background: '#ffffff', border: '1.5px dashed #e2e8f0',
                borderRadius: '20px'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, #f1f5f9, #e8edf3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', border: '1px solid #e2e8f0'
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                  No meetings scheduled
                </h4>
                <p style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '450' }}>
                  Schedule a mentoring session for this student.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {student.meetings?.map((m, index) => {
                  const mc = getMeetingStyle(m.status);
                  return (
                    <div
                      key={m.id}
                      style={{
                        background: '#ffffff', borderRadius: '14px',
                        border: '1px solid #e2e8f0', overflow: 'hidden',
                        transition: 'all 0.2s ease', cursor: 'default',
                        opacity: 0, transform: 'translateY(8px)',
                        animation: 'rowSlideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
                        animationDelay: `${index * 0.05}s`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = mc.border;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      {/* Top row */}
                      <div style={{
                        padding: '18px 20px',
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start', gap: '16px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontWeight: '600', fontSize: '14.5px', color: '#0f172a',
                            marginBottom: '6px', fontFamily: "'Inter', sans-serif"
                          }}>
                            Meeting with {m.mentor?.name}
                          </div>
                          <div style={{
                            display: 'flex', gap: '14px', alignItems: 'center',
                            fontSize: '13px', color: '#64748b', fontWeight: '450'
                          }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px'
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                              </svg>
                                                            {new Date(m.date).toLocaleString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                              })}
                            </span>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px'
                            }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {m.duration} min
                            </span>
                          </div>
                        </div>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '4px 11px', borderRadius: '8px',
                          background: mc.bg, color: mc.text,
                          fontSize: '11.5px', fontWeight: '600',
                          border: `1px solid ${mc.border}`,
                          whiteSpace: 'nowrap', flexShrink: 0
                        }}>
                          <span style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: mc.dot
                          }} />
                          {m.status}
                        </span>
                      </div>

                      {/* Notes & Action Items */}
                      {(m.notes || m.actionItems?.length > 0) && (
                        <div style={{
                          borderTop: '1px solid #f1f5f9',
                          padding: '14px 20px',
                          display: 'flex', gap: '12px',
                          flexWrap: 'wrap'
                        }}>
                          {m.notes && (
                            <div style={{
                              flex: '1 1 200px', padding: '10px 14px',
                              background: '#f8fafc', borderRadius: '10px',
                              fontSize: '13px', color: '#64748b',
                              fontWeight: '450', lineHeight: '1.5'
                            }}>
                              <span style={{ fontWeight: '600', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                                Notes
                              </span>
                              {m.notes}
                            </div>
                          )}
                          {m.actionItems?.length > 0 && (
                            <div style={{
                              flex: '1 1 200px', padding: '10px 14px',
                              background: '#fffbeb', borderRadius: '10px',
                              border: '1px solid #fde68a'
                            }}>
                              <span style={{
                                fontWeight: '700', color: '#92400e', fontSize: '11px',
                                textTransform: 'uppercase', letterSpacing: '0.04em',
                                display: 'block', marginBottom: '6px'
                              }}>
                                Action Items ({m.actionItems.length})
                              </span>
                              {m.actionItems.map((item, i) => (
                                <div key={i} style={{
                                  fontSize: '12.5px', color: '#78350f',
                                  fontWeight: '500', marginBottom: i < m.actionItems.length - 1 ? '4px' : 0,
                                  display: 'flex', gap: '6px', alignItems: 'flex-start'
                                }}>
                                  <span style={{
                                    width: '14px', height: '14px', borderRadius: '4px',
                                    border: '1.5px solid #fbbf24', flexShrink: 0,
                                    marginTop: '1px'
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
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rowSlideIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .student-profile [style*="grid-template-columns: 1.2fr"] {
            grid-template-columns: 1fr !important;
          }
          .student-profile [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 600px) {
          .student-profile [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
          .student-profile [style*="padding: 0 32px"] {
            padding: 0 20px !important;
          }
        }

        .student-profile .recharts-cartesian-grid-horizontal line,
        .student-profile .recharts-cartesian-grid line {
          stroke: #f1f5f9 !important;
        }
      `}</style>
    </div>
  );
}

export default StudentProfile;