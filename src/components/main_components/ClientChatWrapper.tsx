"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ChatRoom to prevent SSR issues
const ChatRoomComponent = dynamic(() => import("./ChatRoom"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    </div>
  )
});

export default function ClientChatWrapper() {
  try {
    return <ChatRoomComponent />;
  } catch (error) {
    console.error("Error in ClientChatWrapper:", error);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Chat Error</h2>
          <p className="text-muted-foreground">Failed to load chat component</p>
          <pre className="mt-2 text-xs text-red-500">{error instanceof Error ? error.message : String(error)}</pre>
        </div>
      </div>
    );
  }
}
