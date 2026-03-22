"use client";

import { useEffect, useState } from "react";

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: string;
  notes?: string;
}

interface TrainingSession {
  id: string;
  plan_id: string;
  date: string;
  title: string;
  description: string;
  exercises: string;
  status: string;
  notes: string;
  plan_title: string;
}

interface Plan {
  id: string;
  title: string;
  athlete_name?: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    plan_id: "",
    date: "",
    title: "",
    description: "",
    exercises: [{ name: "", sets: 0, reps: "", weight: "", duration: "", notes: "" }] as Exercise[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [sessRes, plansRes] = await Promise.all([
      fetch("/api/sessions"),
      fetch("/api/training-plans"),
    ]);
    const sessData = await sessRes.json();
    const plansData = await plansRes.json();
    setSessions(sessData.sessions || []);
    setPlans(plansData.plans || []);
  }

  function addExercise() {
    setForm({
      ...form,
      exercises: [...form.exercises, { name: "", sets: 0, reps: "", weight: "", duration: "", notes: "" }],
    });
  }

  function removeExercise(idx: number) {
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) });
  }

  function updateExercise(idx: number, field: keyof Exercise, value: string | number) {
    const updated = [...form.exercises];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, exercises: updated });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      plan_id: "",
      date: "",
      title: "",
      description: "",
      exercises: [{ name: "", sets: 0, reps: "", weight: "", duration: "", notes: "" }],
    });
    setShowForm(false);
    fetchData();
  }

  async function handleUpdateStatus(session: TrainingSession) {
    const parsed = JSON.parse(session.exercises || "[]");
    await fetch("/api/sessions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: session.id,
        title: session.title,
        description: session.description,
        exercises: parsed,
        status: editStatus,
        notes: editNotes,
      }),
    });
    setEditingId(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this session?")) return;
    await fetch("/api/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    skipped: "bg-gray-100 text-gray-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Training Sessions</h1>
        {plans.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ Log Session"}
          </button>
        )}
      </div>

      {plans.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700 mb-6">
          Create a training plan first before logging sessions.
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Log Training Session</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Training Plan</label>
                <select
                  required
                  value={form.plan_id}
                  onChange={(e) => setForm({ ...form, plan_id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select plan...</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.athlete_name ? `(${p.athlete_name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Upper Body Strength, Tempo Run"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Exercises</label>
                <button type="button" onClick={addExercise} className="text-sm text-blue-600 hover:underline">
                  + Add Exercise
                </button>
              </div>
              <div className="space-y-3">
                {form.exercises.map((ex, idx) => (
                  <div key={idx} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end bg-gray-50 p-3 rounded-lg">
                    <div className="col-span-2 md:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Exercise</label>
                      <input
                        value={ex.name}
                        onChange={(e) => updateExercise(idx, "name", e.target.value)}
                        placeholder="Exercise name"
                        className="w-full border rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sets</label>
                      <input
                        type="number"
                        value={ex.sets || ""}
                        onChange={(e) => updateExercise(idx, "sets", parseInt(e.target.value) || 0)}
                        className="w-full border rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reps</label>
                      <input
                        value={ex.reps}
                        onChange={(e) => updateExercise(idx, "reps", e.target.value)}
                        placeholder="e.g., 8-10"
                        className="w-full border rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Weight/Duration</label>
                      <input
                        value={ex.weight || ex.duration}
                        onChange={(e) => updateExercise(idx, "weight", e.target.value)}
                        placeholder="e.g., 60kg, 30min"
                        className="w-full border rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeExercise(idx)}
                        className="text-red-400 hover:text-red-600 text-sm py-1.5"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Create Session
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
            <p>No training sessions yet.</p>
          </div>
        ) : (
          sessions.map((s) => {
            const exercises: Exercise[] = JSON.parse(s.exercises || "[]");
            return (
              <div key={s.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {s.plan_title} &middot; {new Date(s.date).toLocaleDateString()}
                    </p>
                    {s.description && <p className="text-sm text-gray-600 mt-2">{s.description}</p>}
                  </div>
                  <button onClick={() => handleDelete(s.id)} className="text-sm text-red-500 hover:underline">
                    Delete
                  </button>
                </div>

                {exercises.length > 0 && (
                  <div className="mt-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 text-xs uppercase">
                          <th className="pb-2">Exercise</th>
                          <th className="pb-2">Sets</th>
                          <th className="pb-2">Reps</th>
                          <th className="pb-2">Weight/Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercises.map((ex, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2">{ex.name}</td>
                            <td className="py-2">{ex.sets || "-"}</td>
                            <td className="py-2">{ex.reps || "-"}</td>
                            <td className="py-2">{ex.weight || ex.duration || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {s.notes && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {s.notes}
                    </p>
                  </div>
                )}

                {editingId === s.id ? (
                  <div className="mt-4 flex items-center gap-3">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="skipped">Skipped</option>
                    </select>
                    <input
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
                    />
                    <button
                      onClick={() => handleUpdateStatus(s)}
                      className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setEditingId(s.id);
                        setEditStatus(s.status);
                        setEditNotes(s.notes);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Update Status
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
