// backend/src/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from './lib/socket.js';

// Read port from .env, fallback to 5050
const PORT = process.env.PORT || 5050;

// Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    // Middleware setup
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      cors({
        origin: 'http://localhost:5173',
        credentials: true,
      })
    );

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/messages', messageRoutes);

    // Serve frontend in production
    if (process.env.NODE_ENV === 'production') {
      const __dirname = path.resolve();
      app.use(express.static(path.join(__dirname, '../frontend/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      });
    }

    // Start HTTP + WebSocket server
    server.listen(PORT, () => {
      console.log(`✅ Server running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });
