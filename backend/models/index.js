const sequelize = require('../config/database');
const Student = require('./Student');
const Mentor = require('./Mentor');
const Scholarship = require('./Scholarship');
const Meeting = require('./Meeting');

// Student has many Scholarships
Student.hasMany(Scholarship, { foreignKey: 'studentId', as: 'scholarships' });
Scholarship.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student has many Meetings
Student.hasMany(Meeting, { foreignKey: 'studentId', as: 'meetings' });
Meeting.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Mentor has many Meetings
Mentor.hasMany(Meeting, { foreignKey: 'mentorId', as: 'meetings' });
Meeting.belongsTo(Mentor, { foreignKey: 'mentorId', as: 'mentor' });

// Student belongs to Mentor (assignment)
Student.belongsTo(Mentor, { foreignKey: 'mentorId', as: 'mentor' });
Mentor.hasMany(Student, { foreignKey: 'mentorId', as: 'students' });

module.exports = { sequelize, Student, Mentor, Scholarship, Meeting };