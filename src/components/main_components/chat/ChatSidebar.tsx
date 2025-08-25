"use client";

import React from "react";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { RoomSelector } from "./RoomSelector";

interface ChatRoom {
  id: string;
  name: string;
  type: "global" | "private";
  description?: string;
  participants?: number;
  lastMessage?: string;
  isActive?: boolean;
}

interface ChatSidebarProps {
  rooms: ChatRoom[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  activeRoom,
  onRoomSelect
}) => {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Implement search functionality
    console.log("Search:", e.target.value);
  };

  const handleAddRoom = () => {
    // TODO: Implement add room functionality
    console.log("Add room clicked");
  };

  return (
    <div className="w-80 bg-card/50 backdrop-blur-sm border-r border-border/50">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Chat Rooms</h2>
          <button 
            onClick={handleAddRoom}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <Plus size={18} className="text-muted-foreground" />
          </button>
        </div>
        <div className="relative">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rooms..."
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Room List */}
      <RoomSelector
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={onRoomSelect}
      />
    </div>
  );
};
