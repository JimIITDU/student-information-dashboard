const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scholarship = sequelize.define('Scholarship', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('Researching', 'Applied', 'Interview', 'Awarded', 'Rejected'),
    defaultValue: 'Researching',
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  requirements: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  essayRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  essaySubmitted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dateApplied: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Scholarship;