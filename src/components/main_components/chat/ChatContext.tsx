"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "./useSocket";
import { useSSRSafeRef } from "@/lib/ssr-safe-hooks";

type ChatRoom = {
  id: string;
  name: string;
  type: "global" | "private";
  description?: string;
  participants?: number;
  lastMessage?: string;
  isActive?: boolean;
};

type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
  roomId: string;
};

interface ChatContextType {
  messages: Message[];
  newMessage: string;
  activeRoom: string;
  showRoomSidebar: boolean;
  isTyping: boolean;
  typingUsers: string[];
  isConnected: boolean;
  onlineUsers: number;
  chatRooms: ChatRoom[];
  currentRoom?: ChatRoom;
  setNewMessage: (message: string) => void;
  setActiveRoom: (roomId: string) => void;
  setShowRoomSidebar: (show: boolean) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleRoomSelect: (roomId: string) => void;
  handleToggleSidebar: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    console.error("ChatContext is not available. Make sure ChatProvider is wrapping the component.");
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("ChatProvider is rendering");
  
  // Move all hooks to the top level, outside of try-catch
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeRoom, setActiveRoom] = useState<string>("global");
  const [showRoomSidebar, setShowRoomSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Use SSR-safe refs
  const messagesEndRef = useSSRSafeRef<HTMLDivElement>(null);
  const typingTimeoutRef = useSSRSafeRef<NodeJS.Timeout | null>(null);

  const chatRooms: ChatRoom[] = useMemo(() => [
    {
      id: "global",
      name: "Global Chat",
      type: "global",
      description: "Discuss movies with everyone",
      participants: 1247,
      isActive: true
    },
    {
      id: "action",
      name: "Action Movies",
      type: "global",
      description: "Explosions and adrenaline",
      participants: 342,
    },
    {
      id: "horror",
      name: "Horror Films",
      type: "global",
      description: "Things that go bump in the night",
      participants: 156,
    },
    {
      id: "classics",
      name: "Classic Cinema",
      type: "global",
      description: "Timeless masterpieces",
      participants: 89,
    }
  ], []);

  // Socket connection
  const { socket, sendMessage: sendSocketMessage, isConnected, onlineUsers } = useSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    activeRoom,
    user
  );

  // Socket event listeners - moved outside try-catch
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date(message.timestamp)
      }]);
    };

    // Listen for message history when joining a room
    const handleMessageHistory = (messageHistory: Message[]) => {
      setMessages(messageHistory.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    };

    // Listen for typing indicators
    const handleUserTyping = (data: { username: string, isTyping: boolean }) => {
      if (data.username === user?.username) return;
      
      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.username) ? prev : [...prev, data.username];
        } else {
          return prev.filter(username => username !== data.username);
        }
      });
    };

    // Listen for user join/leave notifications
    const handleUserJoined = (data: { username: string }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        userId: 'system',
        username: 'System',
        content: `${data.username} joined the chat`,
        timestamp: new Date(),
        isSystem: true,
        roomId: activeRoom
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    const handleUserLeft = (data: { username: string }) => {
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        userId: 'system',
        username: 'System',
        content: `${data.username} left the chat`,
        timestamp: new Date(),
        isSystem: true,
        roomId: activeRoom
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_history', handleMessageHistory);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_history', handleMessageHistory);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
    };
  }, [socket, user, activeRoom]);

  // Clear messages when changing rooms
  useEffect(() => {
    setMessages([]);
    setTypingUsers([]);
  }, [activeRoom]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  try {

    // Handle typing indicator
    const handleTyping = () => {
      if (!isTyping && socket) {
        setIsTyping(true);
        socket.emit('typing', { roomId: activeRoom, isTyping: true });
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (socket) {
          socket.emit('typing', { roomId: activeRoom, isTyping: false });
        }
      }, 1000);
    };

    const sendMessage = () => {
      if (newMessage.trim() && user) {
        const message: Message = {
          id: `${user.id}-${Date.now()}`,
          userId: user.id,
          username: user.username,
          content: newMessage.trim(),
          timestamp: new Date(),
          roomId: activeRoom,
        };

        // Send via Socket.io
        sendSocketMessage(message);
        setNewMessage("");

        // Clear typing indicator
        if (isTyping && socket) {
          setIsTyping(false);
          socket.emit('typing', { roomId: activeRoom, isTyping: false });
        }
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);
      handleTyping();
    };

    const handleRoomSelect = (roomId: string) => {
      setActiveRoom(roomId);
    };

    const handleToggleSidebar = () => {
      setShowRoomSidebar(!showRoomSidebar);
    };

    const currentRoom = chatRooms.find(room => room.id === activeRoom);

    const value: ChatContextType = {
      messages,
      newMessage,
      activeRoom,
      showRoomSidebar,
      isTyping,
      typingUsers,
      isConnected,
      onlineUsers,
      chatRooms,
      currentRoom,
      setNewMessage,
      setActiveRoom,
      setShowRoomSidebar,
      sendMessage,
      handleKeyPress,
      handleInputChange,
      handleRoomSelect,
      handleToggleSidebar,
      messagesEndRef
    };

    // Debug logging
    console.log("ChatProvider rendering with value:", {
      messagesCount: messages.length,
      activeRoom,
      showRoomSidebar,
      isConnected,
      onlineUsers
    });

    return (
      <ChatContext.Provider value={value}>
        {children}
      </ChatContext.Provider>
    );
  } catch (error) {
    console.error("Error rendering ChatProvider:", error);
    return <div>Error loading chat context.</div>;
  }
};
