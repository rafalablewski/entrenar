"use client";

import { useEffect, useState } from "react";

interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  athlete_name: string;
  endeavour_title: string;
  endeavour_id: string;
  athlete_id: string;
}

interface Athlete {
  id: string;
  name: string;
}

interface Endeavour {
  id: string;
  title: string;
}

export default function TrainingPlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [endeavours, setEndeavours] = useState<Endeavour[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    endeavour_id: "",
    athlete_id: "",
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [plansRes, athRes, endRes] = await Promise.all([
      fetch("/api/training-plans"),
      fetch("/api/athletes"),
      fetch("/api/endeavours"),
    ]);
    const plansData = await plansRes.json();
    const athData = await athRes.json();
    const endData = await endRes.json();
    setPlans(plansData.plans || []);
    setAthletes(athData.athletes || []);
    setEndeavours(endData.endeavours || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/training-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ endeavour_id: "", athlete_id: "", title: "", description: "", start_date: "", end_date: "" });
    setShowForm(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this training plan and all its sessions?")) return;
    await fetch("/api/training-plans", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Training Plans</h1>
        {athletes.length > 0 && endeavours.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "+ New Plan"}
          </button>
        )}
      </div>

      {athletes.length === 0 || endeavours.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700 mb-6">
          You need at least one athlete and one endeavour before creating training plans.
        </div>
      ) : null}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create Training Plan</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endeavour</label>
                <select
                  required
                  value={form.endeavour_id}
                  onChange={(e) => setForm({ ...form, endeavour_id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select endeavour...</option>
                  {endeavours.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Athlete</label>
                <select
                  required
                  value={form.athlete_id}
                  onChange={(e) => setForm({ ...form, athlete_id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select athlete...</option>
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Base Building Phase, Peak Week"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Create Plan
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center text-gray-500">
            <p>No training plans yet.</p>
          </div>
        ) : (
          plans.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {p.athlete_name} &middot; {p.endeavour_title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(p.start_date).toLocaleDateString()} &rarr;{" "}
                    {new Date(p.end_date).toLocaleDateString()}
                  </p>
                  {p.description && <p className="text-sm text-gray-600 mt-2">{p.description}</p>}
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
