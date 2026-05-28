import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import {
  JobProgressEvent,
  JobCompleteEvent,
  JobFailedEvent,
} from '../types';

let io: SocketIOServer;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join room for specific assignment updates
    socket.on('join:assignment', (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(`📌 Socket ${socket.id} joined room: assignment:${assignmentId}`);
    });

    // Leave room
    socket.on('leave:assignment', (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
      console.log(`📌 Socket ${socket.id} left room: assignment:${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit job progress to specific assignment room
export const emitJobProgress = (data: JobProgressEvent): void => {
  if (!io) return;
  io.to(`assignment:${data.assignmentId}`).emit('job:progress', data);
  console.log(`📡 Progress emitted for ${data.assignmentId}: ${data.progress}%`);
};

// Emit job complete to specific assignment room
export const emitJobComplete = (data: JobCompleteEvent): void => {
  if (!io) return;
  io.to(`assignment:${data.assignmentId}`).emit('job:complete', data);
  console.log(`📡 Complete emitted for ${data.assignmentId}`);
};

// Emit job failed to specific assignment room
export const emitJobFailed = (data: JobFailedEvent): void => {
  if (!io) return;
  io.to(`assignment:${data.assignmentId}`).emit('job:failed', data);
  console.log(`📡 Failed emitted for ${data.assignmentId}`);
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export default initSocket;