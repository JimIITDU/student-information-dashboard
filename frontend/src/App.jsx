import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDirectory from './pages/StudentDirectory';
import StudentProfile from './pages/StudentProfile';
import ScholarshipManagement from './pages/ScholarshipManagement';
import MentorshipMeetings from './pages/MentorshipMeetings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  // 1. State (Defaults to Dark)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true;
  });

  // 2. The Bridge: Tell the <html> tag what theme we are in
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <Router>
      {/* 3. A simple wrapper class. CSS handles the rest */}
      <div className="app-shell">
        <Navbar isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<StudentDirectory />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/student/:id/scholarships" element={<ScholarshipManagement />} />
            <Route path="/student/:id/meetings" element={<MentorshipMeetings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;