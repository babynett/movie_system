"use client";

import { useState, useEffect, useCallback } from "react";

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
  roomId: string;
}

interface User {
  id: string;
  username: string;
}

// Create a dynamic hook that only loads socket.io-client on the client side
export const useSocket = (serverPath: string, roomId: string, user: User | null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    // Dynamically import socket.io-client only on client side
    const initializeSocket = async () => {
      try {
        const { io } = await import('socket.io-client');
        
        const socketInstance = io(serverPath, {
          query: {
            userId: user.id,
            username: user.username
          },
          timeout: 5000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        setSocket(socketInstance);

        // Connection handlers
        socketInstance.on('connect', () => {
          setIsConnected(true);
          console.log('Connected to server');
        });

        socketInstance.on('disconnect', () => {
          setIsConnected(false);
          console.log('Disconnected from server');
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socketInstance.on('connect_error', (error: any) => {
          console.error('Connection error:', error);
          setIsConnected(false);
        });

        // Update online users count
        socketInstance.on('room_users', (count: number) => {
          setOnlineUsers(count);
        });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverPath, user]);

  // Join room when roomId changes
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
    }
  }, [socket, isConnected, roomId]);

  const sendMessage = useCallback((message: Message) => {
    if (socket && isConnected) {
      socket.emit('send_message', message);
    }
  }, [socket, isConnected]);

  return { socket, sendMessage, isConnected, onlineUsers };
};
