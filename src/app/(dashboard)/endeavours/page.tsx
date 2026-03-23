"use client";

import { useEffect, useState } from "react";

interface Athlete { id: string; name: string; }
interface Endeavour {
  id: string; title: string; description: string; target_date: string; status: string; athletes: Athlete[];
}

export default function EndeavoursPage() {
  const [endeavours, setEndeavours] = useState<Endeavour[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", target_date: "", athlete_ids: [] as string[] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", target_date: "", status: "planning", athlete_ids: [] as string[] });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [endRes, athRes] = await Promise.all([fetch("/api/endeavours"), fetch("/api/athletes")]);
    const endData = await endRes.json();
    const athData = await athRes.json();
    setEndeavours(endData.endeavours || []);
    setAthletes(athData.athletes || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/endeavours", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", description: "", target_date: "", athlete_ids: [] });
    setShowForm(false);
    fetchData();
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/endeavours", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...editForm }) });
    setEditingId(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this endeavour?")) return;
    await fetch("/api/endeavours", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  }

  function toggleAthlete(ids: string[], athleteId: string): string[] {
    return ids.includes(athleteId) ? ids.filter((id) => id !== athleteId) : [...ids, athleteId];
  }

  function startEdit(e: Endeavour) {
    setEditingId(e.id);
    setEditForm({ title: e.title, description: e.description, target_date: e.target_date, status: e.status, athlete_ids: e.athletes?.map((a) => a.id) || [] });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>Endeavours</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Goals and competitions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary" : "btn-primary"}>
          {showForm ? "Cancel" : "New Endeavour"}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title (e.g., Marathon 2026)" className="input" />
              <input type="date" required value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} className="input" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="input" />
            {athletes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {athletes.map((a) => (
                  <button key={a.id} type="button" onClick={() => setForm({ ...form, athlete_ids: toggleAthlete(form.athlete_ids, a.id) })}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                    style={{
                      background: form.athlete_ids.includes(a.id) ? "rgba(0,240,255,0.08)" : "rgba(255,255,255,0.03)",
                      border: form.athlete_ids.includes(a.id) ? "1px solid rgba(0,240,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                      color: form.athlete_ids.includes(a.id) ? "#00F0FF" : "rgba(255,255,255,0.35)",
                    }}>
                    {a.name}
                  </button>
                ))}
              </div>
            )}
            <button type="submit" className="btn-primary">Create</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {endeavours.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>No endeavours yet.</p>
          </div>
        ) : endeavours.map((e) => (
          <div key={e.id} className="card p-6">
            {editingId === e.id ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input required value={editForm.title} onChange={(ev) => setEditForm({ ...editForm, title: ev.target.value })} className="input" />
                  <input type="date" required value={editForm.target_date} onChange={(ev) => setEditForm({ ...editForm, target_date: ev.target.value })} className="input" />
                  <select value={editForm.status} onChange={(ev) => setEditForm({ ...editForm, status: ev.target.value })} className="input">
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <textarea value={editForm.description} onChange={(ev) => setEditForm({ ...editForm, description: ev.target.value })} rows={2} className="input" />
                {athletes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {athletes.map((a) => (
                      <button key={a.id} type="button" onClick={() => setEditForm({ ...editForm, athlete_ids: toggleAthlete(editForm.athlete_ids, a.id) })}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                        style={{
                          background: editForm.athlete_ids.includes(a.id) ? "rgba(0,240,255,0.08)" : "rgba(255,255,255,0.03)",
                          border: editForm.athlete_ids.includes(a.id) ? "1px solid rgba(0,240,255,0.25)" : "1px solid rgba(255,255,255,0.06)",
                          color: editForm.athlete_ids.includes(a.id) ? "#00F0FF" : "rgba(255,255,255,0.35)",
                        }}>
                        {a.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[16px] font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>{e.title}</h3>
                    <span className={`badge badge-${e.status}`}>{e.status}</span>
                  </div>
                  <p className="text-[12px] mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {new Date(e.target_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                  {e.description && <p className="text-[13px] mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>{e.description}</p>}
                  {e.athletes && e.athletes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {e.athletes.map((a) => (
                        <span key={a.id} className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          {a.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(e)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00F0FF")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(e.id)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
