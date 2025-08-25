"use client";

import React from "react";
import { Plus, MagnifyingGlass, DotsThree, Smiley, Gif, ImageSquare } from "phosphor-react";

interface ChatButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  onClick,
  disabled = false,
  variant = "default",
  size = "md",
  icon,
  children,
  className = ""
}) => {
  const baseClasses = "p-2 rounded-lg transition-colors duration-200";
  
  const variantClasses = {
    default: "hover:bg-muted",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// Specific button components for chat functionality
export const AddRoomButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ChatButton onClick={onClick} icon={<Plus size={18} className="text-muted-foreground" />} />
);

export const SearchButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ChatButton onClick={onClick} icon={<MagnifyingGlass size={18} className="text-muted-foreground" />} />
);

export const MenuButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ChatButton onClick={onClick} icon={<DotsThree size={20} className="text-muted-foreground" />} />
);

export const EmojiButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ChatButton onClick={onClick} icon={<Smiley size={18} className="text-muted-foreground" />} />
);

export const ImageButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ChatButton onClick={onClick} icon={<ImageSquare size={18} className="text-muted-foreground" />} />
);

export const GifButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <ChatButton onClick={onClick} icon={<Gif size={18} className="text-muted-foreground" />} />
);

export const SendButton: React.FC<{ onClick?: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <ChatButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="lg"
    className="transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
  />
);
