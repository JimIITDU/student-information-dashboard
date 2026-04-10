module.exports = function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message).join(', ')
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'A record with this email already exists.'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};