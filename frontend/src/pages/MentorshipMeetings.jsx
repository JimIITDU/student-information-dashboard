import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, getMeetings, createMeeting, updateMeeting, deleteMeeting } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

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
      await updateMeeting(meetingId, { status: newStatus });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (meetingId) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await deleteMeeting(meetingId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Scheduled': return 'badge-primary';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const filteredMeetings = meetings.filter(m =>
    m.notes?.toLowerCase().includes(search.toLowerCase()) ||
    m.actionItems?.some(a => a.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="container" style={{ paddingTop: '32px' }}>

        {/* Back Button */}
        <button
          onClick={() => navigate(`/student/${id}`)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none', color: 'var(--secondary)',
            fontSize: '14px', cursor: 'pointer', marginBottom: '24px',
            padding: '0', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary)'}
        >
          ← Back to Profile
        </button>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px'
        }}>
          <div>
            <h1 className="page-title">Mentorship & Meetings</h1>
            <p style={{ color: 'var(--secondary)', fontSize: '14px' }}>
              {student?.firstName} {student?.lastName} · {meetings.length} meetings
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            disabled={!student?.mentorId}
          >
            {showForm ? 'Cancel' : '+ Schedule Meeting'}
          </button>
        </div>

        {/* No mentor warning */}
        {!student?.mentorId && (
          <div style={{
            background: 'var(--warning-light)',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            ⚠️ This student has no assigned mentor. Assign a mentor first to schedule meetings.
          </div>
        )}

        {/* Mentor Card */}
        {student?.mentor && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--secondary)', marginBottom: '12px' }}>
              ASSIGNED MENTOR
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '20px', fontWeight: '700'
              }}>
                {student.mentor.name[0]}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px' }}>{student.mentor.name}</div>
                <div style={{ color: 'var(--secondary)', fontSize: '13px' }}>
                  {student.mentor.title} at {student.mentor.company}
                </div>
                <div style={{ color: 'var(--secondary)', fontSize: '13px' }}>
                  {student.mentor.email}
                </div>
              </div>
              {student.mentor.expertise && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {student.mentor.expertise.map((exp, i) => (
                    <span key={i} className="badge badge-primary">{exp}</span>
                  ))}
                </div>
              )}
            </div>
            {student.mentor.bio && (
              <div style={{
                marginTop: '12px', padding: '12px',
                background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
                fontSize: '13px', color: 'var(--secondary)'
              }}>
                {student.mentor.bio}
              </div>
            )}
          </div>
        )}

        {/* Schedule Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
              Schedule New Meeting
            </h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Date & Time *</label>
                <input
                  className="form-input"
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (minutes) *</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Action Items (comma separated)</label>
                <input
                  className="form-input"
                  value={form.actionItems}
                  onChange={(e) => setForm({ ...form, actionItems: e.target.value })}
                  placeholder="e.g. Update resume, Apply to internship"
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Meeting Notes</label>
                <textarea
                  className="form-input"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="What was discussed in this meeting..."
                  rows={3}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !form.date || !form.duration}
              >
                {submitting ? 'Saving...' : 'Save Meeting'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        {meetings.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <input
              className="form-input"
              placeholder="Search meeting notes or action items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search meetings"
            />
          </div>
        )}

        {/* Meetings List */}
        {filteredMeetings.length === 0 ? (
          <div className="card" style={{
            textAlign: 'center', padding: '48px',
            color: 'var(--secondary)'
          }}>
            {meetings.length === 0
              ? 'No meetings yet. Schedule one above!'
              : 'No meetings match your search.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="card">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: '12px', marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>
                        {new Date(meeting.date).toLocaleDateString('en-US', {
                          weekday: 'long', year: 'numeric',
                          month: 'long', day: 'numeric'
                        })}
                      </span>
                      <span className={`badge ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '13px', color: 'var(--secondary)',
                      marginBottom: '12px'
                    }}>
                      🕐 {meeting.duration} minutes
                      {meeting.mentor && ` · with ${meeting.mentor.name}`}
                    </div>

                    {meeting.notes && (
                      <div style={{
                        padding: '10px 12px',
                        background: 'var(--cream)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        color: 'var(--ink)',
                        marginBottom: '8px'
                      }}>
                        {meeting.notes}
                      </div>
                    )}

                    {meeting.actionItems?.length > 0 && (
                      <div>
                        <div style={{
                          fontSize: '12px', fontWeight: '600',
                          marginBottom: '4px', color: 'var(--secondary)'
                        }}>
                          ACTION ITEMS
                        </div>
                        {meeting.actionItems.map((item, i) => (
                          <div key={i} style={{
                            fontSize: '13px', color: 'var(--ink)',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                            → {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    gap: '8px', marginLeft: '24px'
                  }}>
                    <select
                      className="form-input"
                      value={meeting.status}
                      onChange={(e) => handleStatusChange(meeting.id, e.target.value)}
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                      aria-label="Update meeting status"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(meeting.id)}
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorshipMeetings;