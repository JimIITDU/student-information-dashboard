import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, getMeetings, createMeeting, updateMeeting, deleteMeeting } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MeetingCard from '../components/MeetingCard';
import '../styles/global.css';

function MentorshipMeetings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    date: '',
    duration: 60,
    notes: '',
    actionItems: '',
    status: 'Scheduled'
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentRes, meetingsRes] = await Promise.all([
        getStudent(id),
        getMeetings(id)
      ]);
      setStudent(studentRes.data.data);
      setMeetings(meetingsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await createMeeting({
        ...form,
        studentId: id,
        mentorId: student.mentorId,
        duration: parseInt(form.duration),
        actionItems: form.actionItems
          .split(',')
          .map(a => a.trim())
          .filter(a => a)
      });
      setShowForm(false);
      setForm({ date: '', duration: 60, notes: '', actionItems: '', status: 'Scheduled' });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (meetingId, newStatus) => {
    try {
      setError(null);
      await updateMeeting(meetingId, { status: newStatus });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (meetingId) => {
    try {
      setError(null);
      await deleteMeeting(meetingId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredMeetings = meetings.filter(m =>
    m.notes?.toLowerCase().includes(search.toLowerCase()) ||
    m.actionItems?.some(a => a.toLowerCase().includes(search.toLowerCase()))
  );

  const completedCount = meetings.filter(m => m.status === 'Completed').length;
  const scheduledCount = meetings.filter(m => m.status === 'Scheduled').length;
  const totalMinutes = meetings
    .filter(m => m.status === 'Completed')
    .reduce((sum, m) => sum + (m.duration || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completionRate = meetings.length > 0
    ? Math.round((completedCount / meetings.length) * 100) : 0;

  const inputStyle = {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    background: '#ffffff',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '450',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = '#6366f1';
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
  };

  const durationPresets = [15, 30, 45, 60, 90];

  if (loading) return <LoadingSpinner />;
  if (error && !student) return <ErrorMessage message={error} />;
  if (!student) return null;

  return (
    <div className="mentorship-meetings" style={{
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background accents */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-150px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-250px', left: '-100px',
        width: '550px', height: '550px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>

        {/* Dismissable Error */}
        {error && student && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderRadius: '12px', marginBottom: '24px',
            background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
            fontSize: '14px', fontWeight: '500'
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{
              background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px', display: 'flex'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate(`/student/${id}`)}
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
          Back to Profile
        </button>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '28px',
          flexWrap: 'wrap', gap: '20px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '13px', color: '#64748b', fontWeight: '500'
              }}>
                {student.firstName} {student.lastName}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
              <span style={{
                fontSize: '13px', color: '#6366f1', fontWeight: '600'
              }}>
                Mentorship
              </span>
            </div>
            <h1 style={{
              fontSize: '32px', fontWeight: '800', color: '#0f172a',
              letterSpacing: '-0.6px', lineHeight: '1.15',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              marginBottom: '6px'
            }}>
              Meetings & Mentoring
            </h1>
            <p style={{
              color: '#94a3b8', fontSize: '14.5px', fontWeight: '450'
            }}>
              Track sessions, notes, and action items between student and mentor
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!student.mentorId}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              height: '46px', padding: '0 22px',
              borderRadius: '12px', border: 'none',
              background: showForm
                ? '#f1f5f9'
                : (!student.mentorId ? '#cbd5e1' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'),
              color: showForm ? '#475569' : '#ffffff',
              fontSize: '14px', fontWeight: '600',
              cursor: (!student.mentorId || submitting) ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: (showForm || !student.mentorId) ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              whiteSpace: 'nowrap', opacity: !student.mentorId ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled && student.mentorId) {
                if (showForm) {
                  e.currentTarget.style.background = '#e2e8f0';
                } else {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)';
                }
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled && student.mentorId) {
                if (showForm) {
                  e.currentTarget.style.background = '#f1f5f9';
                } else {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)';
                }
              }
            }}
          >
            {showForm ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Discard
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>
                </svg>
                Schedule Meeting
              </>
            )}
          </button>
        </div>

        {/* No mentor warning */}
        {!student.mentorId && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '14px',
            padding: '18px 20px', borderRadius: '14px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: '1px solid #fde68a',
            animation: 'tabFadeIn 0.3s ease'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: '#ffffff',
              boxShadow: '0 3px 10px rgba(245,158,11,0.25)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div style={{
                fontWeight: '700', fontSize: '14px', color: '#92400e',
                marginBottom: '4px', fontFamily: "'Inter', sans-serif"
              }}>
                No Mentor Assigned
              </div>
              <div style={{ fontSize: '13.5px', color: '#a16207', fontWeight: '450', lineHeight: '1.5' }}>
                This student doesn't have a mentor yet. Please assign a mentor before scheduling meetings.
              </div>
            </div>
          </div>
        )}

        {/* Mentor Card */}
        {student.mentor && (
          <div style={{
            background: '#ffffff', borderRadius: '18px',
            border: '1px solid #e2e8f0', marginBottom: '24px',
            overflow: 'hidden',
            animation: 'tabFadeIn 0.3s ease'
          }}>
            <div style={{
              padding: '24px 28px',
              display: 'flex', gap: '20px', alignItems: 'flex-start'
            }}>
              {/* Mentor Avatar */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', fontSize: '22px', fontWeight: '800',
                flexShrink: 0,
                boxShadow: '0 6px 18px rgba(99,102,241,0.25)',
                letterSpacing: '-0.5px'
              }}>
                {student.mentor.name[0]}
              </div>

              {/* Mentor Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '10.5px', fontWeight: '700', color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '6px'
                }}>
                  Assigned Mentor
                </div>
                <div style={{
                  fontSize: '20px', fontWeight: '700', color: '#0f172a',
                  marginBottom: '4px', fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.3px'
                }}>
                  {student.mentor.name}
                </div>
                <div style={{ fontSize: '13.5px', color: '#64748b', fontWeight: '450', marginBottom: '2px' }}>
                  {student.mentor.title} at {student.mentor.company}
                </div>
                {student.mentor.email && (
                  <div style={{
                    fontSize: '13px', color: '#94a3b8', fontWeight: '450',
                    display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '2px'
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    {student.mentor.email}
                  </div>
                )}
              </div>

              {/* Expertise Tags */}
              {student.mentor.expertise?.length > 0 && (
                <div style={{
                  display: 'flex', gap: '6px', flexWrap: 'wrap',
                  justifyContent: 'flex-end', flexShrink: 0,
                  maxWidth: '260px'
                }}>
                  {student.mentor.expertise.map((exp, i) => (
                    <span key={i} style={{
                      padding: '4px 10px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
                      color: '#6366f1', fontSize: '11.5px', fontWeight: '600',
                      border: '1px solid rgba(99,102,241,0.12)',
                      whiteSpace: 'nowrap'
                    }}>
                      {exp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mentor Bio */}
            {student.mentor.bio && (
              <div style={{
                borderTop: '1px solid #f1f5f9',
                padding: '16px 28px',
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
              }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  marginBottom: '6px'
                }}>
                  About
                </div>
                <div style={{
                  fontSize: '13.5px', color: '#475569', fontWeight: '450',
                  lineHeight: '1.6'
                }}>
                  {student.mentor.bio}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        {meetings.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            marginBottom: '24px',
            animation: 'tabFadeIn 0.35s ease'
          }}>
            {[
              {
                label: 'Total Meetings',
                value: meetings.length,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
                ring: 'rgba(99,102,241,0.1)'
              },
              {
                label: 'Completed',
                value: completedCount,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ),
                gradient: 'linear-gradient(135deg, #10b981, #34d399)',
                ring: 'rgba(16,185,129,0.1)'
              },
              {
                label: 'Completion Rate',
                value: `${completionRate}%`,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                ring: 'rgba(245,158,11,0.1)'
              },
              {
                label: 'Total Hours',
                value: totalHours,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
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
                  fontSize: '24px', fontWeight: '800', color: '#0f172a',
                  lineHeight: '1', marginBottom: '4px',
                  fontFamily: "'Inter', sans-serif",
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '11.5px', color: '#94a3b8', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.04em'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Form */}
        <div style={{
          maxHeight: showForm ? '700px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, margin 0.3s ease',
          opacity: showForm ? 1 : 0,
          marginBottom: showForm ? '24px' : '0'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1.5px solid #e2e8f0',
            boxShadow: showForm ? '0 8px 30px rgba(0,0,0,0.06)' : 'none',
            overflow: 'hidden'
          }}>
            {/* Form Header */}
            <div style={{
              padding: '24px 28px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6366f1'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', color: '#0f172a',
                  fontFamily: "'Inter', sans-serif", marginBottom: '2px'
                }}>
                  Schedule New Meeting
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '450' }}>
                  With {student.mentor?.name || 'mentor'}
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Section: Meeting Details */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '700', color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{ width: '16px', height: '1.5px', background: '#6366f1', borderRadius: '1px' }} />
                  Meeting Details
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'
                }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Date & Time <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={{ ...inputStyle, colorScheme: 'light' }}
                      type="datetime-local"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Status
                    </label>
                    <select
                      style={{
                        ...inputStyle,
                        appearance: 'none', paddingRight: '40px',
                        background: `#fff url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center`
                      }}
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Duration Presets */}
                <div style={{ marginTop: '14px' }}>
                  <label style={{
                    display: 'block', fontSize: '13px', fontWeight: '600',
                    color: '#475569', marginBottom: '8px', fontFamily: 'inherit'
                  }}>
                    Duration <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {durationPresets.map(d => (
                      <button
                        key={d}
                        onClick={() => setForm({ ...form, duration: d })}
                        style={{
                          height: '38px', padding: '0 16px', borderRadius: '9px',
                          border: form.duration === d
                            ? '1.5px solid #6366f1'
                            : '1.5px solid #e2e8f0',
                          background: form.duration === d
                            ? 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))'
                            : '#ffffff',
                          color: form.duration === d ? '#6366f1' : '#475569',
                          fontSize: '13px', fontWeight: form.duration === d ? '700' : '500',
                          cursor: 'pointer', fontFamily: 'inherit',
                          transition: 'all 0.2s ease',
                          boxShadow: form.duration === d ? '0 0 0 3px rgba(99,102,241,0.08)' : '0 1px 2px rgba(0,0,0,0.03)'
                        }}
                        onMouseEnter={(e) => {
                          if (form.duration !== d) {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.background = '#f8fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (form.duration !== d) {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.background = '#ffffff';
                          }
                        }}
                      >
                        {d} min
                      </button>
                    ))}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Custom:</span>
                      <input
                        type="number"
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                        min="1"
                        style={{
                          width: '70px', height: '38px', padding: '0 10px',
                          borderRadius: '9px', border: '1.5px solid #e2e8f0',
                          background: '#ffffff', color: '#0f172a',
                          fontSize: '13px', fontWeight: '500', fontFamily: 'inherit',
                          outline: 'none', transition: 'all 0.2s ease',
                          fontVariantNumeric: 'tabular-nums'
                        }}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Notes & Actions */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '700', color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{ width: '16px', height: '1.5px', background: '#6366f1', borderRadius: '1px' }} />
                  Notes & Action Items
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'
                }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Meeting Notes
                    </label>
                    <textarea
                      style={{
                        ...inputStyle,
                        height: 'auto', padding: '12px 14px',
                        minHeight: '90px', resize: 'vertical', lineHeight: '1.6'
                      }}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="What was discussed in this meeting..."
                      rows={3}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Action Items
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '450', marginLeft: '6px' }}>
                        comma separated
                      </span>
                    </label>
                    <input
                      style={inputStyle}
                      value={form.actionItems}
                      onChange={(e) => setForm({ ...form, actionItems: e.target.value })}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      placeholder="e.g. Update resume, Apply to internship, Research grad programs"
                    />
                    {form.actionItems && (
                      <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px'
                      }}>
                        {form.actionItems.split(',').map((item, i) => {
                          const trimmed = item.trim();
                          if (!trimmed) return null;
                          return (
                            <span key={i} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '4px 10px', borderRadius: '7px',
                              background: '#fffbeb', color: '#92400e',
                              fontSize: '12px', fontWeight: '500',
                              border: '1px solid #fde68a',
                              animation: 'chipIn 0.2s ease forwards'
                            }}>
                              <span style={{
                                width: '12px', height: '12px', borderRadius: '3px',
                                border: '1.5px solid #fbbf24', flexShrink: 0
                              }} />
                              {trimmed}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                gap: '10px', paddingTop: '20px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    height: '42px', padding: '0 20px', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', background: '#ffffff',
                    color: '#64748b', fontSize: '13.5px', fontWeight: '600',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !form.date || !form.duration}
                  style={{
                    height: '42px', padding: '0 24px', borderRadius: '10px',
                    border: 'none',
                    background: (submitting || !form.date || !form.duration)
                      ? '#cbd5e1'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff', fontSize: '13.5px', fontWeight: '600',
                    cursor: (submitting || !form.date || !form.duration) ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: (submitting || !form.date || !form.duration) ? 'none' : '0 4px 14px rgba(99,102,241,0.3)',
                    display: 'inline-flex', alignItems: 'center', gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)';
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Save Meeting
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {meetings.length > 0 && (
          <div style={{
            marginBottom: '18px',
            position: 'relative',
            animation: 'tabFadeIn 0.3s ease'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1
            }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              style={{
                ...inputStyle,
                paddingLeft: '40px',
                paddingRight: search ? '40px' : '14px'
              }}
              placeholder="Search notes or action items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label="Search meetings"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: '#f1f5f9', border: 'none',
                  color: '#64748b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
            {search && (
              <div style={{
                position: 'absolute', right: '44px', top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px', color: '#94a3b8', fontWeight: '600',
                pointerEvents: 'none'
              }}>
                {filteredMeetings.length}
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

        @keyframes chipIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .mentorship-meetings select option {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @media (max-width: 900px) {
          .mentorship-meetings [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .mentorship-meetings [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .mentorship-meetings [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default MentorshipMeetings;