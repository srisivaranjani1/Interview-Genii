// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// LOGIN route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
  
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
