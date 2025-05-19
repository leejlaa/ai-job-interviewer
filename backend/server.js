const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');
const answerRoutes = require('./routes/answerRoutes');

const app = express();
// ✅ Fix CORS completely
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  
    next();
  });


  
app.use(express.json());

app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/answers', answerRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB');
    console.error(err.message);
  });