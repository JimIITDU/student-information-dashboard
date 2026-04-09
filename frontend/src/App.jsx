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
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<StudentDirectory />} />
          <Route path="/student/:id" element={<StudentProfile />} />
          <Route path="/student/:id/scholarships" element={<ScholarshipManagement />} />
          <Route path="/student/:id/meetings" element={<MentorshipMeetings />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;