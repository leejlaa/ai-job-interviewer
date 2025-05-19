const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET=process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) return res.status(400).json({ error: "User already exists" });
  
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ username, email, passwordHash });
      await user.save();
  
      res.status(201).json({ message: "User registered", userId: user._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



// Login
router.post('/login', async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
  
      const user = await User.findOne({ 
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
      });
  
      if (!user) return res.status(401).json({ error: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: "Invalid password" });
  
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ message: "Login successful", token, user: { username: user.username, id: user._id } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all users (for testing)
router.get('/', async (req, res) => {
    const users = await User.find();
    res.json(users);
  });

module.exports = router;
