const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  maxMentees: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  }
});

module.exports = Mentor;