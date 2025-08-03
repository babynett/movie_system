"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatCircle, PaperPlaneTilt, User, Users } from "phosphor-react";

type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
};

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser] = useState({
    id: "user_" + Math.random().toString(36).substr(2, 9),
    username: "User_" + Math.floor(Math.random() * 1000),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        userId: "system",
        username: "System",
        content:
          "Welcome to the Movie Chat! Share your thoughts about movies with other users.",
        timestamp: new Date(),
        isSystem: true,
      };
      setMessages([welcomeMessage]);
      localStorage.setItem("chat_messages", JSON.stringify([welcomeMessage]));
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessagesToStorage = (updatedMessages: Message[]) => {
    localStorage.setItem("chat_messages", JSON.stringify(updatedMessages));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        content: newMessage.trim(),
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwnMessage = (message: Message) => {
    return message.userId === currentUser.id;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2">
          <ChatCircle size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">Movie Chat</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} />
          <span>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isSystem
                  ? "bg-primary/10 text-primary mx-auto"
                  : isOwnMessage(message)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border"
              }`}
            >
              {!message.isSystem && !isOwnMessage(message) && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <User size={12} className="text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {message.username}
                  </span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={1}
              maxLength={500}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperPlaneTilt size={20} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {newMessage.length}/500 characters
          </span>
          <span className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
