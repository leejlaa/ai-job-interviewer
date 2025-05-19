const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:     { type: String, enum: ['student', 'admin'], default: 'student' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
