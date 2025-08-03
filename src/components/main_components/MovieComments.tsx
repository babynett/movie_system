"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatCircle, Trash, ThumbsUp, ThumbsDown, User } from "phosphor-react";

type Comment = {
  id: string;
  movieId: number;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
};

interface MovieCommentsProps {
  movieId: number;
  movieTitle: string;
}

const MovieComments: React.FC<MovieCommentsProps> = ({ movieId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser] = useState({
    id: "user_" + Math.random().toString(36).substr(2, 9),
    username: "Anonymous User",
  });

  useEffect(() => {
    // Load comments from localStorage for this movie
    const savedComments = localStorage.getItem(`movie_comments_${movieId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [movieId]);

  const saveCommentsToStorage = (updatedComments: Comment[]) => {
    localStorage.setItem(
      `movie_comments_${movieId}`,
      JSON.stringify(updatedComments)
    );
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        movieId,
        userId: currentUser.id,
        username: currentUser.username,
        content: newComment.trim(),
        createdAt: new Date(),
        likes: 0,
        dislikes: 0,
      };

      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      saveCommentsToStorage(updatedComments);
      setNewComment("");
    }
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
  };

  const handleLike = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const userLiked = !comment.userLiked;
        const userDisliked = false;
        return {
          ...comment,
          likes: userLiked ? comment.likes + 1 : comment.likes - 1,
          dislikes: comment.userDisliked
            ? comment.dislikes - 1
            : comment.dislikes,
          userLiked,
          userDisliked,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
  };

  const handleDislike = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const userDisliked = !comment.userDisliked;
        const userLiked = false;
        return {
          ...comment,
          dislikes: userDisliked ? comment.dislikes + 1 : comment.dislikes - 1,
          likes: comment.userLiked ? comment.likes - 1 : comment.likes,
          userDisliked,
          userLiked,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - commentDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return commentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ChatCircle size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Comments</h3>
        <span className="text-sm text-muted-foreground">
          ({comments.length})
        </span>
      </div>

      {/* Add New Comment */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentUser.username}
            </span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {newComment.length}/500 characters
            </span>
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ChatCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {comment.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  {comment.userId === currentUser.id && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-1 hover:bg-destructive/10 rounded transition-colors duration-200"
                      title="Delete comment"
                    >
                      <Trash size={14} className="text-destructive" />
                    </button>
                  )}
                </div>

                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors duration-200 ${
                      comment.userLiked
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      weight={comment.userLiked ? "fill" : "regular"}
                    />
                    <span className="text-xs">{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleDislike(comment.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded transition-colors duration-200 ${
                      comment.userDisliked
                        ? "text-destructive bg-destructive/10"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <ThumbsDown
                      size={14}
                      weight={comment.userDisliked ? "fill" : "regular"}
                    />
                    <span className="text-xs">{comment.dislikes}</span>
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieComments;
