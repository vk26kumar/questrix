'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import {
  setGenerating,
  setGenerationProgress,
  resetGeneration,
} from '../store/uiSlice';
import { fetchResult } from '../store/resultSlice';
import {
  JobProgressEvent,
  JobCompleteEvent,
  JobFailedEvent,
} from '../types';

interface UseWebSocketOptions {
  assignmentId?: string;
  onComplete?: (resultId: string) => void;
  onFailed?: (error: string) => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { assignmentId, onComplete, onFailed } = options;
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected:', socketRef.current?.id);
      if (assignmentId) {
        socketRef.current?.emit('join:assignment', assignmentId);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socketRef.current.on('job:progress', (data: JobProgressEvent) => {
      dispatch(setGenerationProgress({
        progress: data.progress,
        message: data.message,
      }));
    });

    socketRef.current.on('job:complete', (data: JobCompleteEvent) => {
      dispatch(resetGeneration());
      dispatch(setGenerating(false));
      if (data.assignmentId) {
        dispatch(fetchResult(data.assignmentId));
      }
      if (onComplete) onComplete(data.resultId);
    });

    socketRef.current.on('job:failed', (data: JobFailedEvent) => {
      dispatch(resetGeneration());
      dispatch(setGenerating(false));
      if (onFailed) onFailed(data.error);
    });
  }, [assignmentId, dispatch, onComplete, onFailed]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      if (assignmentId) {
        socketRef.current.emit('leave:assignment', assignmentId);
      }
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [assignmentId]);

  const joinRoom = useCallback((id: string) => {
    socketRef.current?.emit('join:assignment', id);
  }, []);

  const leaveRoom = useCallback((id: string) => {
    socketRef.current?.emit('leave:assignment', id);
  }, []);

  useEffect(() => {
    connect();
    return () => { disconnect(); };
  }, [connect, disconnect]);

  useEffect(() => {
    if (assignmentId && socketRef.current?.connected) {
      socketRef.current.emit('join:assignment', assignmentId);
    }
  }, [assignmentId]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
  };
};

export default useWebSocket;