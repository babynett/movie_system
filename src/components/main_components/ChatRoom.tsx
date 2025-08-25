"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useSocket } from "./chat/useSocket";
import { ChatSidebar } from "./chat/ChatSidebar";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageDisplay } from "./chat/MessageDisplay";
import { MessageInput } from "./chat/MessageInput";
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

const ChatRoomComponent: React.FC = () => {
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

  // Use actual socket connection status
  const isConnectedForTesting = isConnected;

  // Socket event listeners
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

      // Try to send via Socket.io first, fallback to local
      if (socket && isConnected) {
        sendSocketMessage(message);
      } else {
        // Fallback: add message locally if socket not connected
        setMessages(prev => [...prev, message]);
      }
      
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

  // Add a test message for debugging - moved before conditional return
  useEffect(() => {
    if (messages.length === 0 && user) {
      const testMessage: Message = {
        id: 'test-1',
        userId: 'system',
        username: 'System',
        content: 'Welcome to the chat! You can start typing now.',
        timestamp: new Date(),
        isSystem: true,
        roomId: activeRoom
      };
      setMessages([testMessage]);
    }
  }, [messages.length, user, activeRoom]);

  // Show login message if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to use the chat.</p>
        </div>
      </div>
    );
  }

  // Add connection status indicator
  const connectionStatus = (
    <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
      isConnected ? 'bg-green-500 text-purple-900' : 'bg-red-500 text-purple-900'
    }`}>
      {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
  );

  return (
    <div className="flex h-full bg-gradient-to-br from-background to-muted/20">
      {connectionStatus}
      
      {/* Sidebar */}
      {showRoomSidebar && (
        <ChatSidebar
          rooms={chatRooms}
          activeRoom={activeRoom}
          onRoomSelect={handleRoomSelect}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <ChatHeader
          currentRoom={currentRoom}
          isConnected={isConnectedForTesting}
          onlineUsers={onlineUsers}
          showRoomSidebar={showRoomSidebar}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Messages */}
        <MessageDisplay
          messages={messages}
          currentUserId={user?.id}
          typingUsers={typingUsers}
        />
        
        <div ref={messagesEndRef} />

        {/* Message Input */}
        <div className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <MessageInput
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onSend={sendMessage}
            placeholder={`Message ${currentRoom?.name}...`}
            disabled={!isConnectedForTesting}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomComponent;