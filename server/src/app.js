import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// Health check: is the server up, and is the database connected?
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler: never leaks details to the user
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
});

export default app;