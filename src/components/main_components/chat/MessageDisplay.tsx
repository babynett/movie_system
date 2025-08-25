"use client";

import React from "react";

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
  roomId: string;
}

interface MessageDisplayProps {
  messages: Message[];
  currentUserId?: string;
  typingUsers: string[];
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  currentUserId,
  typingUsers
}) => {

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwnMessage = (message: Message) => {
    return currentUserId && message.userId === currentUserId;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs lg:max-w-lg flex items-start gap-2 ${
              isOwnMessage(message) ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            {!message.isSystem && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isOwnMessage(message) 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              }`}>
                <span className="text-xs font-semibold">
                  {message.username[0]?.toUpperCase()}
                </span>
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`px-4 py-2 rounded-xl relative ${
                message.isSystem
                  ? "bg-primary/10 text-primary mx-auto border border-primary/20"
                  : isOwnMessage(message)
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
              }`}
            >
              {!message.isSystem && !isOwnMessage(message) && (
                <p className="text-xs font-medium text-primary mb-1">
                  {message.username}
                </p>
              )}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              <p className={`text-xs mt-1 ${
                message.isSystem
                  ? "text-primary/70"
                  : isOwnMessage(message)
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="flex justify-start">
          <div className="bg-muted px-4 py-2 rounded-xl text-sm text-muted-foreground">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.length} people are typing...`
            }
          </div>
        </div>
      )}
    </div>
  );
};
