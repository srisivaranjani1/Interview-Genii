const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST: Submit feedback
router.post("/", async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ success: true, message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving feedback", error: err.message });
  }
});

// GET: Fetch all feedback (optional)
router.get("/", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ submittedAt: -1 });
    res.json({ success: true, feedback: feedbackList });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching feedback", error: err.message });
  }
});

module.exports = router;

