// Custom validation middleware for Student creation/update
module.exports = function validateStudent(req, res, next) {
  const { gpa, enrollmentStatus, academicYear, creditsCompleted, creditsRequired, expectedGraduation } = req.body;

  // GPA validation
  if (gpa !== undefined && (gpa < 0.0 || gpa > 4.0)) {
    return res.status(400).json({ error: 'GPA must be between 0.0 and 4.0.' });
  }

  // Enrollment status validation
  const validStatuses = ['Full-time', 'Part-time', 'Leave of Absence', 'Graduated'];
  if (enrollmentStatus && !validStatuses.includes(enrollmentStatus)) {
    return res.status(400).json({ error: 'Invalid enrollment status.' });
  }

  // Academic year validation
  const validYears = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
  if (academicYear && !validYears.includes(academicYear)) {
    return res.status(400).json({ error: 'Invalid academic year.' });
  }

  // Credits validation
  if (creditsCompleted !== undefined && creditsRequired !== undefined && creditsCompleted > creditsRequired) {
    return res.status(400).json({ error: 'Credits completed cannot exceed credits required.' });
  }

  // Graduation date validation
  if (expectedGraduation && isNaN(Date.parse(expectedGraduation))) {
    return res.status(400).json({ error: 'Invalid expected graduation date.' });
  }

  next();
};
