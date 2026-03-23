"use client";

import { useEffect, useState } from "react";

interface Exercise { name: string; sets?: number; reps?: string; weight?: string; duration?: string; notes?: string; }
interface TrainingSession {
  id: string; plan_id: string; date: string; title: string; description: string;
  exercises: string; status: string; notes: string; plan_title: string;
}
interface Plan { id: string; title: string; athlete_name?: string; }

export default function SessionsPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    plan_id: "", date: "", title: "", description: "",
    exercises: [{ name: "", sets: 0, reps: "", weight: "", duration: "", notes: "" }] as Exercise[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [sessRes, plansRes] = await Promise.all([fetch("/api/sessions"), fetch("/api/training-plans")]);
    const sessData = await sessRes.json();
    const plansData = await plansRes.json();
    setSessions(sessData.sessions || []);
    setPlans(plansData.plans || []);
  }

  function addExercise() { setForm({ ...form, exercises: [...form.exercises, { name: "", sets: 0, reps: "", weight: "", duration: "", notes: "" }] }); }
  function removeExercise(idx: number) { setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) }); }
  function updateExercise(idx: number, field: keyof Exercise, value: string | number) {
    const updated = [...form.exercises]; updated[idx] = { ...updated[idx], [field]: value }; setForm({ ...form, exercises: updated });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ plan_id: "", date: "", title: "", description: "", exercises: [{ name: "", sets: 0, reps: "", weight: "", duration: "", notes: "" }] });
    setShowForm(false);
    fetchData();
  }

  async function handleUpdateStatus(session: TrainingSession) {
    const parsed = JSON.parse(session.exercises || "[]");
    await fetch("/api/sessions", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: session.id, title: session.title, description: session.description, exercises: parsed, status: editStatus, notes: editNotes }) });
    setEditingId(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this session?")) return;
    await fetch("/api/sessions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>Sessions</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{sessions.length} session{sessions.length !== 1 ? "s" : ""}</p>
        </div>
        {plans.length > 0 && (
          <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary" : "btn-primary"}>
            {showForm ? "Cancel" : "Log Session"}
          </button>
        )}
      </div>

      {plans.length === 0 && (
        <div className="card p-4 mb-6" style={{ borderColor: "rgba(255,107,53,0.2)" }}>
          <p className="text-[13px]" style={{ color: "#FF6B35" }}>Create a training plan before logging sessions.</p>
        </div>
      )}

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <select required value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })} className="input">
                <option value="">Plan...</option>
                {plans.map((p) => <option key={p.id} value={p.id}>{p.title}{p.athlete_name ? ` (${p.athlete_name})` : ""}</option>)}
              </select>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Session title" className="input" />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="input" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Exercises</span>
                <button type="button" onClick={addExercise} className="text-[11px] font-semibold hover:underline" style={{ color: "#00F0FF" }}>+ Add</button>
              </div>
              <div className="space-y-2">
                {form.exercises.map((ex, i) => (
                  <div key={i} className="grid grid-cols-6 gap-2 items-center rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <input value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} placeholder="Exercise" className="input !py-1.5 text-[13px] col-span-2" />
                    <input type="number" value={ex.sets || ""} onChange={(e) => updateExercise(i, "sets", parseInt(e.target.value) || 0)} placeholder="Sets" className="input !py-1.5 text-[13px]" />
                    <input value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} placeholder="Reps" className="input !py-1.5 text-[13px]" />
                    <input value={ex.weight || ex.duration} onChange={(e) => updateExercise(i, "weight", e.target.value)} placeholder="Weight/Dur" className="input !py-1.5 text-[13px]" />
                    <button type="button" onClick={() => removeExercise(i)} className="text-[11px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Session</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>No sessions yet.</p>
          </div>
        ) : sessions.map((s) => {
          const exercises: Exercise[] = JSON.parse(s.exercises || "[]");
          return (
            <div key={s.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[16px] font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>{s.title}</h3>
                    <span className={`badge badge-${s.status}`}>{s.status}</span>
                  </div>
                  <p className="text-[12px] mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {s.plan_title} &middot; {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  {s.description && <p className="text-[13px] mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>{s.description}</p>}
                </div>
                <button onClick={() => handleDelete(s.id)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                  Delete
                </button>
              </div>

              {exercises.length > 0 && (
                <div className="rounded-xl p-4 mb-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-[0.08em]" style={{ color: "rgba(255,255,255,0.2)" }}>
                        <th className="text-left pb-2">Exercise</th>
                        <th className="text-left pb-2">Sets</th>
                        <th className="text-left pb-2">Reps</th>
                        <th className="text-left pb-2">Load</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercises.map((ex, i) => (
                        <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                          <td className="py-2" style={{ color: "rgba(255,255,255,0.8)" }}>{ex.name}</td>
                          <td className="py-2" style={{ color: "rgba(255,255,255,0.4)" }}>{ex.sets || "-"}</td>
                          <td className="py-2" style={{ color: "rgba(255,255,255,0.4)" }}>{ex.reps || "-"}</td>
                          <td className="py-2" style={{ color: "rgba(255,255,255,0.4)" }}>{ex.weight || ex.duration || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {s.notes && (
                <div className="rounded-xl px-4 py-2.5 mb-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <span className="font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Notes:</span> {s.notes}
                  </p>
                </div>
              )}

              {editingId === s.id ? (
                <div className="flex items-center gap-3 pt-2">
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="input !w-auto !py-1.5 text-[13px]">
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="skipped">Skipped</option>
                  </select>
                  <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes..." className="input !py-1.5 text-[13px] flex-1" />
                  <button onClick={() => handleUpdateStatus(s)} className="btn-primary !py-1.5 text-[13px]">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary !py-1.5 text-[13px]">Cancel</button>
                </div>
              ) : (
                <button onClick={() => { setEditingId(s.id); setEditStatus(s.status); setEditNotes(s.notes); }}
                  className="text-[11px] font-semibold pt-1 hover:underline" style={{ color: "#00F0FF" }}>
                  Update Status
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
