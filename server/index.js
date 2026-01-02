
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const { apiRouter, publicRouter } = require('./routes/pastes');

const app = express();
app.use(cors());
app.use(express.json());

console.log("Using Mongo URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected locally");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// app.get('/api/healthz', async (req, res) => {
//   const pingDb = () => {
//     if (!mongoose.connection.db) return Promise.reject(new Error('no-db'));
//     return mongoose.connection.db.admin().ping();
//   };

//   // respond quickly if DB doesn't reply within timeout
//   const timeoutMs = 500;
//   const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs));

//   try {
//     await Promise.race([pingDb(), timeout]);
//     res.status(200).json({ ok: true });
//   } catch (err) {
//     res.status(500).json({ ok: false });
//   }
// });

app.use('/api/', apiRouter);
app.use('/p', publicRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
