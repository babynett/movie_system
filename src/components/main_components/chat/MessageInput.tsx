"use client";

import React from "react";
import { PaperPlaneTilt, Smiley, ImageSquare, Gif } from "phosphor-react";

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSend,
  placeholder = "Type a message...",
  disabled = false,
  maxLength = 500
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    onKeyPress(e);
  };

  const handleSend = () => {
    onSend();
  };

  return (
    <div className="flex items-end gap-3">
      {/* Message Input Area */}
      <div className="flex-1 bg-background border border-border rounded-lg">
        <div className="flex items-center p-2 border-b border-border">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
            <Smiley size={18} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
            <ImageSquare size={18} className="text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors duration-200">
            <Gif size={18} className="text-muted-foreground" />
          </button>
        </div>
        <textarea
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full p-3 bg-transparent resize-none focus:outline-none text-foreground placeholder-muted-foreground"
          rows={1}
          maxLength={maxLength}
          disabled={disabled}
        />
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
          <span className="text-xs text-muted-foreground">
            Press Enter to send • Shift+Enter for new line
          </span>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
      >
        <PaperPlaneTilt size={20} />
      </button>
    </div>
  );
};
