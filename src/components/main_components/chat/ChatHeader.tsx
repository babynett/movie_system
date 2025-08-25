"use client";

import React from "react";
import { ChatCircle, Globe, Lock, Users, DotsThree } from "phosphor-react";

interface ChatRoom {
  id: string;
  name: string;
  type: "global" | "private";
  description?: string;
  participants?: number;
  lastMessage?: string;
  isActive?: boolean;
}

interface ChatHeaderProps {
  currentRoom?: ChatRoom;
  isConnected: boolean;
  onlineUsers: number;
  showRoomSidebar: boolean;
  onToggleSidebar: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentRoom,
  isConnected,
  onlineUsers,
  onToggleSidebar
}) => {

  return (
    <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 md:hidden"
          >
            <ChatCircle size={20} />
          </button>
          <div className="flex items-center gap-2">
            {currentRoom?.type === "global" ? (
              <Globe size={24} className="text-primary" />
            ) : (
              <Lock size={24} className="text-primary" />
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">{currentRoom?.name}</h2>
              <p className="text-sm text-muted-foreground">{currentRoom?.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{onlineUsers || currentRoom?.participants || 0} online</span>
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
            <DotsThree size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};
