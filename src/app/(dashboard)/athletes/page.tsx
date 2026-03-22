"use client";

import { useEffect, useState } from "react";

interface Athlete {
  id: string;
  name: string;
  email: string;
  sport: string;
  notes: string;
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", sport: "", notes: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAthletes();
  }, []);

  async function fetchAthletes() {
    const res = await fetch("/api/athletes");
    const data = await res.json();
    setAthletes(data.athletes || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/athletes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    setForm({ name: "", email: "", sport: "", notes: "" });
    setShowForm(false);
    fetchAthletes();
  }

  async function handleUpdate(athlete: Athlete) {
    await fetch("/api/athletes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: athlete.id, sport: athlete.sport, notes: athlete.notes }),
    });
    setEditing(null);
    fetchAthletes();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Athletes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ Add Athlete"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Athlete</h2>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
              <input
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Add Athlete
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {athletes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No athletes yet. Add your first athlete to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sport</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Notes</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {athletes.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 text-sm font-medium">{a.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{a.email}</td>
                  <td className="px-6 py-4 text-sm">
                    {editing === a.id ? (
                      <input
                        value={a.sport}
                        onChange={(e) =>
                          setAthletes(athletes.map((x) => (x.id === a.id ? { ...x, sport: e.target.value } : x)))
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      a.sport || "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {editing === a.id ? (
                      <input
                        value={a.notes}
                        onChange={(e) =>
                          setAthletes(athletes.map((x) => (x.id === a.id ? { ...x, notes: e.target.value } : x)))
                        }
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      a.notes || "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {editing === a.id ? (
                      <button
                        onClick={() => handleUpdate(a)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditing(a.id)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
