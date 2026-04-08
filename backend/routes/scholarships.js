const express = require('express');
const router = express.Router();
const { Scholarship, Student } = require('../models/index');

// GET all scholarships for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const scholarships = await Scholarship.findAll({
      where: { studentId: req.params.studentId },
      order: [['deadline', 'ASC']]
    });
    res.json({ success: true, data: scholarships });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single scholarship
router.get('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id, {
      include: [{ model: Student, as: 'student' }]
    });

    if (!scholarship) {
      return res.status(404).json({ success: false, error: 'Scholarship not found' });
    }

    res.json({ success: true, data: scholarship });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create scholarship for a student
router.post('/', async (req, res) => {
  try {
    // Check if student exists
    const student = await Student.findByPk(req.body.studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Check deadline is in the future
    if (new Date(req.body.deadline) < new Date()) {
      return res.status(400).json({ success: false, error: 'Deadline must be in the future' });
    }

    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ success: true, data: scholarship });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update scholarship status
router.put('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, error: 'Scholarship not found' });
    }

    // If status changed to Applied, record dateApplied
    if (req.body.status === 'Applied' && scholarship.status !== 'Applied') {
      req.body.dateApplied = new Date();
    }

    await scholarship.update(req.body);
    res.json({ success: true, data: scholarship });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE scholarship
router.delete('/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findByPk(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, error: 'Scholarship not found' });
    }

    await scholarship.destroy();
    res.json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;