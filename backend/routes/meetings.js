const express = require('express');
const router = express.Router();
const { Meeting, Student, Mentor } = require('../models/index');
const { Op } = require('sequelize');

// GET all meetings for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      where: { studentId: req.params.studentId },
      include: [{ model: Mentor, as: 'mentor' }],
      order: [['date', 'DESC']]
    });
    res.json({ success: true, data: meetings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all meetings for a mentor
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      where: { mentorId: req.params.mentorId },
      include: [{ model: Student, as: 'student' }],
      order: [['date', 'DESC']]
    });
    res.json({ success: true, data: meetings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single meeting
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id, {
      include: [
        { model: Student, as: 'student' },
        { model: Mentor, as: 'mentor' }
      ]
    });

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }

    res.json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST schedule new meeting
router.post('/', async (req, res) => {
  try {
    // Check student exists
    const student = await Student.findByPk(req.body.studentId);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Check mentor exists
    const mentor = await Mentor.findByPk(req.body.mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, error: 'Mentor not found' });
    }

    // Check duration is valid
    if (req.body.duration < 1) {
      return res.status(400).json({ success: false, error: 'Duration must be at least 1 minute' });
    }

    const meeting = await Meeting.create(req.body);
    
    // Return meeting with mentor and student details
    const fullMeeting = await Meeting.findByPk(meeting.id, {
      include: [
        { model: Student, as: 'student' },
        { model: Mentor, as: 'mentor' }
      ]
    });

    res.status(201).json({ success: true, data: fullMeeting });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update meeting
router.put('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }

    // Prevent updating cancelled meeting
    if (meeting.status === 'Cancelled') {
      return res.status(400).json({ success: false, error: 'Cannot update a cancelled meeting' });
    }

    await meeting.update(req.body);
    res.json({ success: true, data: meeting });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE meeting
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);

    if (!meeting) {
      return res.status(404).json({ success: false, error: 'Meeting not found' });
    }

    await meeting.destroy();
    res.json({ success: true, message: 'Meeting deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;