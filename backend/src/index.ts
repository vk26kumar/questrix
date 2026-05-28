import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import connectRedis from './config/redis';
import { initSocket } from './socket/socket';
import assignmentRoutes from './routes/assignment.routes';


dotenv.config();
const app = express();
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/assignments', assignmentRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Questrix API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: err.message,
    });
  }
);

//Start Server
const PORT = process.env.PORT || 5000;
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    connectRedis();
    initSocket(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`Questrix API running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();

export default app;