"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import ChatRoom to prevent SSR issues
const ChatRoomComponent = dynamic(() => import("@/components/main_components/ChatRoom"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
});

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen">
        <ChatRoomComponent />
      </div>
    </div>
  );
};

export default ChatPage; 