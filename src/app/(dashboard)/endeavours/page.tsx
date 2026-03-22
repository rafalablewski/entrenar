"use client";

import { useEffect, useState } from "react";

interface Athlete {
  id: string;
  name: string;
}

interface Endeavour {
  id: string;
  title: string;
  description: string;
  target_date: string;
  status: string;
  athletes: Athlete[];
}

export default function EndeavoursPage() {
  const [endeavours, setEndeavours] = useState<Endeavour[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    target_date: "",
    athlete_ids: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    target_date: "",
    status: "planning",
    athlete_ids: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [endRes, athRes] = await Promise.all([
      fetch("/api/endeavours"),
      fetch("/api/athletes"),
    ]);
    const endData = await endRes.json();
    const athData = await athRes.json();
    setEndeavours(endData.endeavours || []);
    setAthletes(athData.athletes || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/endeavours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", target_date: "", athlete_ids: [] });
    setShowForm(false);
    fetchData();
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/endeavours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...editForm }),
    });
    setEditingId(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this endeavour?")) return;
    await fetch("/api/endeavours", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  function startEdit(e: Endeavour) {
    setEditingId(e.id);
    setEditForm({
      title: e.title,
      description: e.description,
      target_date: e.target_date,
      status: e.status,
      athlete_ids: e.athletes?.map((a) => a.id) || [],
    });
  }

  function toggleAthlete(ids: string[], athleteId: string): string[] {
    return ids.includes(athleteId) ? ids.filter((id) => id !== athleteId) : [...ids, athleteId];
  }

  const statusColors: Record<string, string> = {
    planning: "bg-yellow-100 text-yellow-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Endeavours</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          {showForm ? "Cancel" : "+ New Endeavour"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Endeavour</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Marathon 2026, National Championships"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={form.target_date}
                  onChange={(e) => setForm({ ...form, target_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {athletes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Athletes</label>
                <div className="flex flex-wrap gap-2">
                  {athletes.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setForm({ ...form, athlete_ids: toggleAthlete(form.athlete_ids, a.id) })}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        form.athlete_ids.includes(a.id)
                          ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Create Endeavour
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {endeavours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
            <p>No endeavours yet. Create your first one to start planning.</p>
          </div>
        ) : (
          endeavours.map((e) => (
            <div key={e.id} className="bg-white rounded-xl shadow-sm border p-6">
              {editingId === e.id ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      required
                      value={editForm.title}
                      onChange={(ev) => setEditForm({ ...editForm, title: ev.target.value })}
                      className="border rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="date"
                      required
                      value={editForm.target_date}
                      onChange={(ev) => setEditForm({ ...editForm, target_date: ev.target.value })}
                      className="border rounded-lg px-3 py-2 text-sm"
                    />
                    <select
                      value={editForm.status}
                      onChange={(ev) => setEditForm({ ...editForm, status: ev.target.value })}
                      className="border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <textarea
                    value={editForm.description}
                    onChange={(ev) => setEditForm({ ...editForm, description: ev.target.value })}
                    rows={2}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  {athletes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {athletes.map((a) => (
                        <button
                          type="button"
                          key={a.id}
                          onClick={() =>
                            setEditForm({ ...editForm, athlete_ids: toggleAthlete(editForm.athlete_ids, a.id) })
                          }
                          className={`px-3 py-1 rounded-full text-sm border transition ${
                            editForm.athlete_ids.includes(a.id)
                              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                          }`}
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="text-gray-500 text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Target: {new Date(e.target_date).toLocaleDateString()}
                      </p>
                      {e.description && <p className="text-sm text-gray-600 mt-2">{e.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[e.status]}`}>
                        {e.status}
                      </span>
                    </div>
                  </div>
                  {e.athletes && e.athletes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {e.athletes.map((a) => (
                        <span key={a.id} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                          {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => startEdit(e)} className="text-sm text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="text-sm text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
