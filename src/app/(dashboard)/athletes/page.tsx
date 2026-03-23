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
    const res = await fetch("/api/athletes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { const data = await res.json(); setError(data.error); return; }
    setForm({ name: "", email: "", sport: "", notes: "" });
    setShowForm(false);
    fetchAthletes();
  }

  async function handleUpdate(athlete: Athlete) {
    await fetch("/api/athletes", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: athlete.id, sport: athlete.sport, notes: athlete.notes }) });
    setEditing(null);
    fetchAthletes();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>Athletes</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {athletes.length} athlete{athletes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary" : "btn-primary"}>
          {showForm ? "Cancel" : "Add Athlete"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          {error && <p className="text-[13px] mb-3" style={{ color: "#FF3B5C" }}>{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="input" />
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input" />
            <input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} placeholder="Sport" className="input" />
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="input" />
            <div className="col-span-2"><button type="submit" className="btn-primary">Add Athlete</button></div>
          </form>
        </div>
      )}

      {athletes.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>No athletes yet. Add your first athlete to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {athletes.map((a) => (
            <div key={a.id} className="card px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold"
                  style={{ background: "linear-gradient(135deg, rgba(0,240,255,0.12), rgba(77,124,255,0.12))", color: "#00F0FF", border: "1px solid rgba(0,240,255,0.1)" }}>
                  {a.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{a.name}</p>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>{a.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {editing === a.id ? (
                  <>
                    <input value={a.sport} onChange={(e) => setAthletes(athletes.map((x) => x.id === a.id ? { ...x, sport: e.target.value } : x))} placeholder="Sport" className="input !w-32 !py-1.5 text-[13px]" />
                    <input value={a.notes} onChange={(e) => setAthletes(athletes.map((x) => x.id === a.id ? { ...x, notes: e.target.value } : x))} placeholder="Notes" className="input !w-40 !py-1.5 text-[13px]" />
                    <button onClick={() => handleUpdate(a)} className="text-[12px] font-semibold hover:underline" style={{ color: "#00F0FF" }}>Save</button>
                  </>
                ) : (
                  <>
                    {a.sport && <span className="badge badge-active">{a.sport}</span>}
                    <button onClick={() => setEditing(a.id)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#00F0FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                      Edit
                    </button>
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
