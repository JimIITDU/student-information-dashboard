const express = require('express');
const router = express.Router();
const { Student, Mentor, Scholarship, Meeting } = require('../models/index');
const { Op } = require('sequelize');

// GET all students with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, academicYear, enrollmentStatus, mentorId } = req.query;
    
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { major: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (academicYear) where.academicYear = academicYear;
    if (enrollmentStatus) where.enrollmentStatus = enrollmentStatus;
    if (mentorId) where.mentorId = mentorId;

    const students = await Student.findAll({
      where,
      include: [
        { model: Mentor, as: 'mentor' }
      ],
      order: [['lastName', 'ASC']]
    });

    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single student with full profile
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Mentor, as: 'mentor' },
        { model: Scholarship, as: 'scholarships' },
        { model: Meeting, as: 'meetings', include: [{ model: Mentor, as: 'mentor' }] }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create new student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    await student.update(req.body);
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    await student.destroy();
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;