const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// Create a meeting
router.post('/', async (req, res) => {
  try {
    const { startDate, startTime } = req.body;
    const startDateTime = new Date(`${startDate}T${startTime}`);

    const meeting = new Meeting({ ...req.body, startDateTime });
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all meetings
router.get('/', async (req, res) => {
  const meetings = await Meeting.find();
  res.json(meetings);
});

// Update meeting
router.put('/:id', async (req, res) => {
  const { startDate, startTime } = req.body;
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const updatedData = { ...req.body, startDateTime };

  const updated = await Meeting.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  res.json(updated);
});

// Delete meeting
router.delete('/:id', async (req, res) => {
  await Meeting.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;

