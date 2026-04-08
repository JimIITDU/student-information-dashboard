const express = require('express');
const router = express.Router();
const { Mentor, Student, Meeting } = require('../models/index');

// GET all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.findAll({
      include: [
        { model: Student, as: 'students' }
      ],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single mentor with students and meetings
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByPk(req.params.id, {
      include: [
        { model: Student, as: 'students' },
        { model: Meeting, as: 'meetings' }
      ]
    });

    if (!mentor) {
      return res.status(404).json({ success: false, error: 'Mentor not found' });
    }

    res.json({ success: true, data: mentor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create mentor
router.post('/', async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json({ success: true, data: mentor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update mentor
router.put('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByPk(req.params.id);

    if (!mentor) {
      return res.status(404).json({ success: false, error: 'Mentor not found' });
    }

    await mentor.update(req.body);
    res.json({ success: true, data: mentor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT assign mentor to student
router.put('/:mentorId/assign/:studentId', async (req, res) => {
  try {
    const mentor = await Mentor.findByPk(req.params.mentorId);
    const student = await Student.findByPk(req.params.studentId);

    if (!mentor) {
      return res.status(404).json({ success: false, error: 'Mentor not found' });
    }
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Check if mentor has space
    const currentMentees = await Student.count({ 
      where: { mentorId: mentor.id } 
    });
    
    if (currentMentees >= mentor.maxMentees) {
      return res.status(400).json({ 
        success: false, 
        error: `Mentor already has maximum mentees (${mentor.maxMentees})` 
      });
    }

    await student.update({ mentorId: mentor.id });
    res.json({ success: true, message: 'Mentor assigned successfully', data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE mentor
router.delete('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findByPk(req.params.id);

    if (!mentor) {
      return res.status(404).json({ success: false, error: 'Mentor not found' });
    }

    await mentor.destroy();
    res.json({ success: true, message: 'Mentor deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;