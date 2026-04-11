import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, getScholarships, createScholarship, updateScholarship, deleteScholarship } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ScholarshipCard from '../components/ScholarshipCard';
import '../styles/global.css';

function ScholarshipManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({
    name: '',
    provider: '',
    amount: '',
    currency: 'USD',
    status: 'Researching',
    deadline: '',
    requirements: '',
    essayRequired: false,
    essaySubmitted: false,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [studentRes, scholarshipRes] = await Promise.all([
        getStudent(id),
        getScholarships(id)
      ]);
      setStudent(studentRes.data.data);
      setScholarships(scholarshipRes.data.data);
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
      await createScholarship({
        ...form,
        studentId: id,
        amount: parseFloat(form.amount),
        requirements: form.requirements.split(',').map(r => r.trim()).filter(r => r)
      });
      setShowForm(false);
      setForm({
        name: '', provider: '', amount: '', currency: 'USD',
        status: 'Researching', deadline: '', requirements: '',
        essayRequired: false, essaySubmitted: false, notes: ''
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (scholarshipId, newStatus) => {
    try {
      setError(null);
      await updateScholarship(scholarshipId, { status: newStatus });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (scholarshipId) => {
    try {
      setError(null);
      await deleteScholarship(scholarshipId);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const totalAwarded = scholarships
    .filter(s => s.status === 'Awarded')
    .reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalApplied = scholarships.filter(s => ['Applied', 'Interview', 'Awarded'].includes(s.status)).length;
  const upcomingDeadlines = scholarships.filter(s => {
    if (!s.deadline || s.status === 'Awarded' || s.status === 'Rejected') return false;
    return new Date(s.deadline) > new Date();
  }).length;
  const successRate = totalApplied > 0
    ? Math.round((scholarships.filter(s => s.status === 'Awarded').length / totalApplied) * 100)
    : 0;

  const statusColor = (status) => {
    const map = {
      'Researching': { bg: '#f1f5f9', text: '#64748b', dot: '#64748b' },
      'Applied': { bg: '#eff6ff', text: '#3b82f6', dot: '#3b82f6' },
      'Interview': { bg: '#fefce8', text: '#ca8a04', dot: '#eab308' },
      'Awarded': { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
      'Rejected': { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' }
    };
    return map[status] || map['Researching'];
  };

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

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#6366f1';
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
  };
  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
  };

  if (loading) return <LoadingSpinner />;
  if (error && !student) return <ErrorMessage message={error} />;

  return (
    <div className="scholarship-mgmt" style={{
      minHeight: '100vh',
      background: '#f8fafc',
      position: 'relative'
    }}>
      {/* Background accents */}
      <div style={{
        position: 'fixed', top: '-150px', right: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
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
              background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer',
              padding: '4px', display: 'flex'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        )}

        {/* Back Navigation */}
        <button
          onClick={() => navigate(`/student/${id}`)}
          className="back-btn"
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
              {student?.avatar && (
                <img
                  src={student.avatar}
                  alt=""
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    objectFit: 'cover', border: '2px solid #e2e8f0'
                  }}
                />
              )}
              <span style={{
                fontSize: '13px', color: '#64748b', fontWeight: '500'
              }}>
                {student?.firstName} {student?.lastName}
              </span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
              <span style={{
                fontSize: '13px', color: '#6366f1', fontWeight: '600'
              }}>
                Scholarships
              </span>
            </div>
            <h1 style={{
              fontSize: '32px', fontWeight: '800', color: '#0f172a',
              letterSpacing: '-0.6px', lineHeight: '1.15',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              marginBottom: '6px'
            }}>
              Scholarship Tracker
            </h1>
            <p style={{
              color: '#64748b', fontSize: '14.5px', fontWeight: '450'
            }}>
              Manage applications, track deadlines, and monitor award status
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              height: '46px', padding: '0 22px',
              borderRadius: '12px', border: 'none',
              background: showForm
                ? '#f1f5f9'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: showForm ? '#475569' : '#ffffff',
              fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: showForm ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (showForm) {
                e.currentTarget.style.background = '#e2e8f0';
              } else {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)';
              }
            }}
            onMouseLeave={(e) => {
              if (showForm) {
                e.currentTarget.style.background = '#f1f5f9';
              } else {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)';
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
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Scholarship
              </>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '28px'
        }}>
          {[
            {
              label: 'Total Applications',
              value: scholarships.length,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
              ring: 'rgba(99,102,241,0.1)'
            },
            {
              label: 'Total Awarded',
              value: `$${totalAwarded.toLocaleString()}`,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #10b981, #34d399)',
              ring: 'rgba(16,185,129,0.1)'
            },
            {
              label: 'Success Rate',
              value: `${successRate}%`,
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              ),
              gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              ring: 'rgba(245,158,11,0.1)'
            },
            {
              label: 'Upcoming Deadlines',
              value: upcomingDeadlines,
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
                padding: '20px',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
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
                width: '40px', height: '40px', borderRadius: '11px',
                background: stat.gradient, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px',
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
                fontSize: '11.5px', color: '#64748b', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.04em'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Status Breakdown Bar */}
        {scholarships.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '16px 20px', background: '#ffffff',
            borderRadius: '14px', border: '1px solid #e2e8f0',
            marginBottom: '28px', flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '12px', fontWeight: '600', color: '#64748b',
              textTransform: 'uppercase', letterSpacing: '0.04em',
              whiteSpace: 'nowrap'
            }}>
              Pipeline
            </span>
            {['Researching', 'Applied', 'Interview', 'Awarded', 'Rejected'].map(status => {
              const count = scholarships.filter(s => s.status === status).length;
              if (count === 0) return null;
              const sc = statusColor(status);
              return (
                <div key={status} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '5px 12px', borderRadius: '8px',
                  background: sc.bg, fontSize: '12.5px', fontWeight: '600',
                  color: sc.text
                }}>
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: sc.dot, flexShrink: 0
                  }} />
                  {status}
                  <span style={{
                    fontWeight: '700', opacity: 0.7
                  }}>{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Form Panel */}
        <div style={{
          maxHeight: showForm ? '800px' : '0',
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <h3 style={{
                  fontSize: '16px', fontWeight: '700', color: '#0f172a',
                  fontFamily: "'Inter', sans-serif", marginBottom: '2px'
                }}>
                  New Scholarship Application
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', fontWeight: '450' }}>
                  Fill in the details below to track a new opportunity
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div style={{ padding: '24px 28px 28px' }}>
              {/* Section: Scholarship Details */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '700', color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{ width: '16px', height: '1.5px', background: '#6366f1', borderRadius: '1px' }} />
                  Scholarship Details
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'
                }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Scholarship Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={inputStyle}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="e.g. Merit Excellence Award"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Provider <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={inputStyle}
                      value={form.provider}
                      onChange={(e) => setForm({ ...form, provider: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="e.g. National Education Foundation"
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Amount ($) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: '14px', top: '50%',
                        transform: 'translateY(-50%)', color: '#64748b',
                        fontSize: '14px', fontWeight: '600', pointerEvents: 'none'
                      }}>$</span>
                      <input
                        style={{ ...inputStyle, paddingLeft: '30px' }}
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="5,000"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Deadline <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      style={{ ...inputStyle, colorScheme: 'light' }}
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Application Status */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '700', color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{ width: '16px', height: '1.5px', background: '#6366f1', borderRadius: '1px' }} />
                  Application Status
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px'
                }}>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Current Status
                    </label>
                    <select
                      style={{
                        ...inputStyle,
                        appearance: 'none',
                        paddingRight: '40px',
                        background: `#fff url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9L12 15L18 9' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center`
                      }}
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    >
                      <option value="Researching">Researching</option>
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Awarded">Awarded</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block', fontSize: '13px', fontWeight: '600',
                      color: '#475569', marginBottom: '6px', fontFamily: 'inherit'
                    }}>
                      Requirements
                    </label>
                    <input
                      style={inputStyle}
                      value={form.requirements}
                      onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="3.5+ GPA, Essay, References"
                    />
                  </div>
                </div>

                {/* Toggle switches */}
                <div style={{
                  display: 'flex', gap: '28px', marginTop: '16px'
                }}>
                  {[
                    { key: 'essayRequired', label: 'Essay Required' },
                    { key: 'essaySubmitted', label: 'Essay Submitted' }
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        fontSize: '13.5px', fontWeight: '500', color: '#475569',
                        cursor: 'pointer', fontFamily: 'inherit',
                        userSelect: 'none'
                      }}
                    >
                      <div
                        style={{
                          width: '40px', height: '22px', borderRadius: '11px',
                          background: form[key]
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : '#e2e8f0',
                          position: 'relative', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                          boxShadow: form[key] ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                          flexShrink: 0
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setForm({ ...form, [key]: !form[key] });
                        }}
                      >
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%',
                          background: '#ffffff',
                          position: 'absolute', top: '3px',
                          left: form[key] ? '21px' : '3px',
                          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                        }} />
                      </div>
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Section: Notes */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '700', color: '#6366f1',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{ width: '16px', height: '1.5px', background: '#6366f1', borderRadius: '1px' }} />
                  Additional Notes
                </div>
                <textarea
                  style={{
                    ...inputStyle,
                    height: 'auto', padding: '12px 14px',
                    minHeight: '80px', resize: 'vertical',
                    lineHeight: '1.5'
                  }}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Any additional notes, links, or reminders..."
                  rows={3}
                />
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
                  disabled={submitting || !form.name || !form.provider || !form.amount || !form.deadline}
                  style={{
                    height: '42px', padding: '0 24px', borderRadius: '10px',
                    border: 'none',
                    background: (submitting || !form.name || !form.provider || !form.amount || !form.deadline)
                      ? '#cbd5e1'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff', fontSize: '13.5px', fontWeight: '600',
                    cursor: (submitting || !form.name || !form.provider || !form.amount || !form.deadline)
                      ? 'not-allowed'
                      : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: (submitting || !form.name || !form.provider || !form.amount || !form.deadline)
                      ? 'none'
                      : '0 4px 14px rgba(99,102,241,0.3)',
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
                      Save Scholarship
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships List */}
        {scholarships.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '72px 32px',
            background: '#ffffff', border: '1.5px dashed #e2e8f0',
            borderRadius: '20px', maxWidth: '460px', margin: '20px auto'
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #f1f5f9, #e8edf3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', border: '1px solid #e2e8f0'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '18px', fontWeight: '700', color: '#0f172a',
              marginBottom: '8px', fontFamily: "'Inter', sans-serif"
            }}>
              No scholarships tracked yet
            </h3>
            <p style={{
              color: '#64748b', fontSize: '14px', marginBottom: '24px',
              lineHeight: '1.6', fontWeight: '450'
            }}>
              Start tracking scholarship opportunities to stay organized and never miss a deadline.
            </p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                height: '44px', padding: '0 24px', borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                transition: 'all 0.2s ease'
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add First Scholarship
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            {scholarships.map((scholarship, index) => (
              <div
                key={scholarship.id}
                className="scholarship-row-wrapper"
                style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  animation: 'rowSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  animationDelay: `${index * 0.04}s`
                }}
              >
                <ScholarshipCard
                  scholarship={scholarship}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .scholarship-mgmt select option {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @media (max-width: 900px) {
          .scholarship-mgmt [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .scholarship-mgmt [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .scholarship-mgmt [style*="grid-template-columns: repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ScholarshipManagement;