"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { PencilSimple, Trash, Plus, Check, X } from "phosphor-react";

type Note = {
  id: string;
  movieId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

interface MovieNotesProps {
  movieId: number;
  movieTitle: string;
}

const MovieNotes: React.FC<MovieNotesProps> = ({ movieId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    // Load notes from localStorage for this movie
    const savedNotes = localStorage.getItem(`movie_notes_${movieId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [movieId]);

  const saveNotesToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem(
      `movie_notes_${movieId}`,
      JSON.stringify(updatedNotes)
    );
  };

  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        movieId,
        content: newNoteContent.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setNewNoteContent("");
      setIsAddingNote(false);
    }
  };

  const updateNote = (noteId: string) => {
    if (editingContent.trim()) {
      const updatedNotes = notes.map((note) =>
        note.id === noteId
          ? { ...note, content: editingContent.trim(), updatedAt: new Date() }
          : note
      );
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setEditingContent("");
      setEditingNoteId(null);
    }
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingContent("");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Personal Notes
        </h3>
        <button
          onClick={() => setIsAddingNote(true)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
        >
          <Plus size={16} />
          Add Note
        </button>
      </div>

      {/* Add New Note */}
      {isAddingNote && (
        <Card className="p-4 border border-primary/20 bg-primary/5">
          <div className="space-y-3">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your personal note about this movie..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              rows={3}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={addNote}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                <Check size={16} />
                Save Note
              </button>
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteContent("");
                }}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <PencilSimple size={32} className="mx-auto mb-2 opacity-50" />
            <p>No notes yet. Add your first note about this movie!</p>
          </div>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="p-4">
              {editingNoteId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateNote(note.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      <Check size={16} />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(note.createdAt)}
                        {note.updatedAt > note.createdAt && " (edited)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditing(note)}
                        className="p-2 hover:bg-muted rounded transition-colors duration-200"
                        title="Edit note"
                      >
                        <PencilSimple
                          size={16}
                          className="text-muted-foreground"
                        />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-2 hover:bg-destructive/10 rounded transition-colors duration-200"
                        title="Delete note"
                      >
                        <Trash size={16} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieNotes;
