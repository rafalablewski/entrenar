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

  useEffect(() => { fetchAthletes(); }, []);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Athletes</h1>
          <p className="text-[14px] text-[#9CA3AF] mt-1">{athletes.length} athlete{athletes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary" : "btn-primary"}>
          {showForm ? "Cancel" : "Add Athlete"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          {error && <p className="text-[13px] text-red-500 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="input" />
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input" />
            <input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} placeholder="Sport" className="input" />
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="input" />
            <div className="col-span-2">
              <button type="submit" className="btn-primary">Add Athlete</button>
            </div>
          </form>
        </div>
      )}

      {athletes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[14px] text-[#9CA3AF]">No athletes yet. Add your first athlete to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {athletes.map((a) => (
            <div key={a.id} className="card px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#F0F0F0] flex items-center justify-center text-[12px] font-semibold text-[#6B6B6B]">
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-medium">{a.name}</p>
                  <p className="text-[12px] text-[#9CA3AF]">{a.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {editing === a.id ? (
                  <>
                    <input value={a.sport} onChange={(e) => setAthletes(athletes.map((x) => x.id === a.id ? { ...x, sport: e.target.value } : x))} placeholder="Sport" className="input !w-32 !py-1.5 text-[13px]" />
                    <input value={a.notes} onChange={(e) => setAthletes(athletes.map((x) => x.id === a.id ? { ...x, notes: e.target.value } : x))} placeholder="Notes" className="input !w-40 !py-1.5 text-[13px]" />
                    <button onClick={() => handleUpdate(a)} className="text-[12px] text-[#0071E3] font-medium hover:underline">Save</button>
                  </>
                ) : (
                  <>
                    {a.sport && <span className="badge bg-[#F5F5F5] text-[#6B6B6B]">{a.sport}</span>}
                    <button onClick={() => setEditing(a.id)} className="text-[12px] text-[#9CA3AF] hover:text-[#0071E3] transition-colors">Edit</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
