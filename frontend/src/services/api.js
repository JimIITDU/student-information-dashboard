import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Students
export const getStudents = (params) => api.get('/api/students', { params });
export const getStudent = (id) => api.get(`/api/students/${id}`);
export const createStudent = (data) => api.post('/api/students', data);
export const updateStudent = (id, data) => api.put(`/api/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/api/students/${id}`);

// Mentors
export const getMentors = () => api.get('/api/mentors');
export const getMentor = (id) => api.get(`/api/mentors/${id}`);
export const assignMentor = (mentorId, studentId) => api.put(`/api/mentors/${mentorId}/assign/${studentId}`);

// Scholarships
export const getScholarships = (studentId) => api.get(`/api/scholarships/student/${studentId}`);
export const createScholarship = (data) => api.post('/api/scholarships', data);
export const updateScholarship = (id, data) => api.put(`/api/scholarships/${id}`, data);
export const deleteScholarship = (id) => api.delete(`/api/scholarships/${id}`);

// Meetings
export const getMeetings = (studentId) => api.get(`/api/meetings/student/${studentId}`);
export const createMeeting = (data) => api.post('/api/meetings', data);
export const updateMeeting = (id, data) => api.put(`/api/meetings/${id}`, data);
export const deleteMeeting = (id) => api.delete(`/api/meetings/${id}`);

export default api;