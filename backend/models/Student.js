const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  academicYear: {
    type: DataTypes.ENUM('Freshman', 'Sophomore', 'Junior', 'Senior'),
    allowNull: false
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gpa: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0.0,
      max: 4.0
    }
  },
  enrollmentStatus: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Leave of Absence', 'Graduated'),
    allowNull: false,
    defaultValue: 'Full-time'
  },
  creditsCompleted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  creditsRequired: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 120
  },
  expectedGraduation: {
    type: DataTypes.DATE,
    allowNull: false
  },
  firstGeneration: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lowIncome: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  underrepresentedMinority: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mentorId: {
    type: DataTypes.UUID,
    allowNull: true
  }
});

module.exports = Student;