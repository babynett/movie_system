"use client";

import React from "react";
import { Globe, Lock, Users } from "phosphor-react";

interface ChatRoom {
  id: string;
  name: string;
  type: "global" | "private";
  description?: string;
  participants?: number;
  lastMessage?: string;
  isActive?: boolean;
}

interface RoomSelectorProps {
  rooms: ChatRoom[];
  activeRoom: string;
  onRoomSelect: (roomId: string) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  activeRoom,
  onRoomSelect
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="p-2">
      {rooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onRoomSelect(room.id)}
          className={`w-full p-3 rounded-lg mb-2 text-left transition-all duration-200 ${
            activeRoom === room.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {room.type === "global" ? (
                <Globe size={16} className={activeRoom === room.id ? "text-primary-foreground" : "text-primary"} />
              ) : (
                <Lock size={16} className={activeRoom === room.id ? "text-primary-foreground" : "text-primary"} />
              )}
              <span className="font-medium">{room.name}</span>
            </div>
            {room.isActive && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          <p className={`text-xs line-clamp-1 ${
            activeRoom === room.id ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}>
            {room.description}
          </p>
          {room.participants && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${
              activeRoom === room.id ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}>
              <Users size={12} />
              <span>{formatNumber(room.participants)} members</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
