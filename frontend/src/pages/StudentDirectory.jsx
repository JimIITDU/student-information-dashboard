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
        <div style={{
  padding: '32px 0 24px',
  borderBottom: '1px solid var(--border)',
  marginBottom: '32px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
  <div>
    <h1 style={{
      fontSize: '28px',
      fontWeight: '700',
      color: 'var(--ink)',
      marginBottom: '4px'
    }}>
      Student Directory
    </h1>
    <p style={{ color: 'var(--secondary)', fontSize: '15px' }}>
      Managing <strong>{students.length}</strong> students enrolled
    </p>
  </div>
  <div style={{
    display: 'flex',
    gap: '16px'
  }}>
    <div style={{
      background: 'var(--success-light)',
      padding: '12px 20px',
      borderRadius: 'var(--radius)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--success)'
      }}>
        {students.filter(s => s.gpa >= 3.5).length}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--success)' }}>High GPA</div>
    </div>
    <div style={{
      background: 'var(--primary-light)',
      padding: '12px 20px',
      borderRadius: 'var(--radius)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--primary)'
      }}>
        {students.filter(s => s.firstGeneration).length}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--primary)' }}>First Gen</div>
    </div>
    <div style={{
      background: 'var(--purple-light)',
      padding: '12px 20px',
      borderRadius: 'var(--radius)',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--purple)'
      }}>
        {students.filter(s => s.enrollmentStatus === 'Full-time').length}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--purple)' }}>Full Time</div>
    </div>
  </div>
</div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
  <SearchBar
    value={search}
    onChange={setSearch}
    placeholder="Search by name, email or major..."
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
              <StudentCard key={student.id} student={student} />
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