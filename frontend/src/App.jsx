import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDirectory from './pages/StudentDirectory';
import StudentProfile from './pages/StudentProfile';
import ScholarshipManagement from './pages/ScholarshipManagement';
import MentorshipMeetings from './pages/MentorshipMeetings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  return (
    <Router>
      {/* Flex column ensures the footer stays at the bottom */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        {/* flex: 1 pushes the footer to the bottom if content is short */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<StudentDirectory />} />
            <Route path="/student/:id" element={<StudentProfile />} />
            <Route path="/student/:id/scholarships" element={<ScholarshipManagement />} />
            <Route path="/student/:id/meetings" element={<MentorshipMeetings />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;