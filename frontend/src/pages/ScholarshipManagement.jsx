import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudent, getScholarships, createScholarship, updateScholarship, deleteScholarship } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function ScholarshipManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
      await updateScholarship(scholarshipId, { status: newStatus });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (scholarshipId) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await deleteScholarship(scholarshipId);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Awarded': return 'badge-success';
      case 'Applied': return 'badge-primary';
      case 'Interview': return 'badge-purple';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

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
            <h1 className="page-title">Scholarship Management</h1>
            <p style={{ color: 'var(--secondary)', fontSize: '14px' }}>
              {student?.firstName} {student?.lastName} · {scholarships.length} applications
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Scholarship'}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>
              New Scholarship Application
            </h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Scholarship Name *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Merit Excellence Award"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Provider *</label>
                <input
                  className="form-input"
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  placeholder="e.g. National Education Foundation"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($) *</label>
                <input
                  className="form-input"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline *</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Researching">Researching</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Awarded">Awarded</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Requirements (comma separated)</label>
                <input
                  className="form-input"
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  placeholder="e.g. 3.5+ GPA, Essay, References"
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={form.essayRequired}
                    onChange={(e) => setForm({ ...form, essayRequired: e.target.checked })}
                  />
                  Essay Required
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={form.essaySubmitted}
                    onChange={(e) => setForm({ ...form, essaySubmitted: e.target.checked })}
                  />
                  Essay Submitted
                </label>
              </div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !form.name || !form.provider || !form.amount || !form.deadline}
              >
                {submitting ? 'Saving...' : 'Save Scholarship'}
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

        {/* Scholarships List */}
        {scholarships.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--secondary)' }}>
            No scholarships yet. Add one above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {scholarships.map((scholarship) => (
              <div key={scholarship.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{scholarship.name}</h3>
                      <span className={`badge ${getStatusColor(scholarship.status)}`}>
                        {scholarship.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '12px' }}>
                      {scholarship.provider} · Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>

                    {/* Requirements */}
                    {scholarship.requirements?.length > 0 && (
                      <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {scholarship.requirements.map((req, i) => (
                          <span key={i} style={{
                            padding: '2px 8px',
                            background: 'var(--cream)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'var(--secondary)'
                          }}>
                            {req}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Essay status */}
                    {scholarship.essayRequired && (
                      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                        Essay: {' '}
                        <span style={{ color: scholarship.essaySubmitted ? 'var(--success)' : 'var(--danger)' }}>
                          {scholarship.essaySubmitted ? '✓ Submitted' : '✗ Not submitted'}
                        </span>
                      </div>
                    )}

                    {scholarship.notes && (
                      <div style={{
                        padding: '8px 12px',
                        background: 'var(--cream)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                        color: 'var(--secondary)'
                      }}>
                        {scholarship.notes}
                      </div>
                    )}
                  </div>

                  {/* Right side */}
                  <div style={{ textAlign: 'right', marginLeft: '24px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--success)', marginBottom: '12px' }}>
                      ${scholarship.amount.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <select
                        className="form-input"
                        value={scholarship.status}
                        onChange={(e) => handleStatusChange(scholarship.id, e.target.value)}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        aria-label="Update scholarship status"
                      >
                        <option value="Researching">Researching</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Awarded">Awarded</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(scholarship.id)}
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        Delete
                      </button>
                    </div>
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

export default ScholarshipManagement;