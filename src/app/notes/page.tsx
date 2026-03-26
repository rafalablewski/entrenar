"use client";

import { useState, useEffect, useCallback } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  function selectNote(note: Note) {
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  function startNewNote() {
    setSelectedId(null);
    setTitle("");
    setContent("");
  }

  async function saveNote() {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    try {
      if (selectedId) {
        const res = await fetch("/api/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedId, title, content }),
        });
        if (res.ok) {
          const updated = await res.json();
          setNotes((prev: Note[]) =>
            [updated, ...prev.filter((n: Note) => n.id !== selectedId)]
          );
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        if (res.ok) {
          const created = await res.json();
          setNotes((prev: Note[]) => [created, ...prev]);
          setSelectedId(created.id);
        }
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSaving(false);
    }
  }

  async function deleteNote(id: string) {
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setNotes((prev: Note[]) => prev.filter((n: Note) => n.id !== id));
        if (selectedId === id) {
          startNewNote();
        }
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-navy-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded border border-gold-500/40 flex items-center justify-center">
                <span className="text-gold-500 font-serif text-sm font-semibold">
                  P
                </span>
              </div>
            </a>
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-white text-sm font-semibold">Notes</span>
          </div>
          <button
            onClick={startNewNote}
            className="px-4 py-2 bg-gold-500 text-navy-950 rounded text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            + New Note
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
          {/* Sidebar — note list */}
          <div className="w-72 shrink-0 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="text-slate-500 text-sm">Loading...</p>
            ) : notes.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No notes yet. Create one.
              </p>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedId === note.id
                      ? "bg-navy-800 border-gold-500/30"
                      : "bg-navy-900/50 border-white/5 hover:border-white/10"
                  }`}
                >
                  <p className="text-sm font-medium text-white truncate">
                    {note.title || "Untitled"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {note.content || "No content"}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-2">
                    {formatDate(note.updated_at)}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 bg-navy-900/50 rounded-xl border border-white/5 p-6 flex flex-col">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="bg-transparent text-xl font-serif font-medium text-white placeholder-slate-600 outline-none border-none mb-4"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              className="flex-1 bg-transparent text-slate-300 placeholder-slate-600 outline-none border-none resize-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div>
                {selectedId && (
                  <button
                    onClick={() => deleteNote(selectedId)}
                    className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    Delete note
                  </button>
                )}
              </div>
              <button
                onClick={saveNote}
                disabled={saving || (!title.trim() && !content.trim())}
                className="px-6 py-2 bg-gold-500 text-navy-950 rounded text-sm font-semibold hover:bg-gold-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
