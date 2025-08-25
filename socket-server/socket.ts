// socket.ts - Socket.io server for real-time chat functionality
import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";
import express, { Request, Response } from "express";

// Custom typing for socket
interface CustomSocket extends Socket {
  userId?: string;
  username?: string;
  currentRoom?: string | null;
}

// If using standalone server (recommended)
const app = express();
const server = http.createServer(app);

// Configure CORS for your frontend domain
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// Add error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    server: "socket.io"
  });
});

// In-memory storage (use Redis or database in production)
interface RoomData {
  users: Set<CustomSocket>;
  messages: any[];
}

const rooms = new Map<string, RoomData>(); // roomId -> { users, messages }
const userSockets = new Map<string, CustomSocket>(); // userId -> socket

io.on("connection", (socket: CustomSocket) => {
  const userId = socket.handshake.query.userId as string;
  const username = socket.handshake.query.username as string;

  console.log(`User ${username} connected with socket ${socket.id}`);

  // Store user socket reference
  if (userId) {
    userSockets.set(userId, socket);
  }

  // Store user info on socket
  socket.userId = userId;
  socket.username = username;
  socket.currentRoom = null;

  // Handle joining a room
  socket.on("join_room", (roomId: string) => {
    // Leave previous room if any
    if (socket.currentRoom) {
      socket.leave(socket.currentRoom);

      if (rooms.has(socket.currentRoom)) {
        rooms.get(socket.currentRoom)!.users.delete(socket);

        socket.to(socket.currentRoom).emit("user_left", {
          username: socket.username,
        });

        socket
          .to(socket.currentRoom)
          .emit("room_users", rooms.get(socket.currentRoom)!.users.size);
      }
    }

    // Join new room
    socket.join(roomId);
    socket.currentRoom = roomId;

    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set(), messages: [] });
    }

    const room = rooms.get(roomId)!;
    room.users.add(socket);

    // Send message history
    socket.emit("message_history", room.messages.slice(-50));

    // Notify others
    socket.to(roomId).emit("user_joined", { username: socket.username });

    // Update user count
    io.to(roomId).emit("room_users", room.users.size);

    console.log(`User ${username} joined room ${roomId}`);
  });

  // Handle sending messages
  socket.on("send_message", (message: any) => {
    if (!socket.currentRoom) return;

    const roomId = socket.currentRoom;
    const room = rooms.get(roomId);
    if (!room) return;

    const fullMessage = {
      ...message,
      timestamp: new Date(),
      id: `${message.userId}-${Date.now()}-${Math.random()}`,
    };

    room.messages.push(fullMessage);

    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }

    io.to(roomId).emit("new_message", fullMessage);

    console.log(
      `Message sent in room ${roomId} by ${socket.username}:`,
      message.content
    );
  });

  // Handle typing indicators
  socket.on("typing", ({ roomId, isTyping }: { roomId: string; isTyping: boolean }) => {
    if (socket.currentRoom === roomId) {
      socket.to(roomId).emit("user_typing", {
        username: socket.username,
        isTyping,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.username} disconnected`);

    if (socket.userId) {
      userSockets.delete(socket.userId);
    }

    if (socket.currentRoom && rooms.has(socket.currentRoom)) {
      const room = rooms.get(socket.currentRoom)!;
      room.users.delete(socket);

      socket.to(socket.currentRoom).emit("user_left", {
        username: socket.username,
      });

      socket.to(socket.currentRoom).emit("room_users", room.users.size);

      if (room.users.size === 0) {
        rooms.delete(socket.currentRoom);
      }
    }
  });

  socket.on("error", (error: Error) => {
    console.error("Socket error:", error);
  });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
  });
}

export { io, server };
