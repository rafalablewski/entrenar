"use client";

import { useEffect, useState } from "react";
import ShareableStory from "@/components/ShareableStory";

interface Exercise { name: string; sets?: number; reps?: string; weight?: string; duration?: string; notes?: string; }
interface TrainingSession {
  id: string; plan_id: string; date: string; title: string; description: string;
  exercises: string; status: string; notes: string; plan_title: string;
}
interface Plan { id: string; title: string; athlete_name?: string; }

type Difficulty = "too_easy" | "easy" | "just_right" | "hard" | "too_hard";

interface FeedbackItem {
  id?: string;
  session_id: string;
  exercise_name: string;
  rpe: number;
  difficulty: Difficulty | "";
  notes: string;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; color: string }[] = [
  { value: "too_easy", label: "Too Easy", color: "#22C55E" },
  { value: "easy", label: "Easy", color: "#86EFAC" },
  { value: "just_right", label: "Just Right", color: "#00F0FF" },
  { value: "hard", label: "Hard", color: "#FF6B35" },
  { value: "too_hard", label: "Too Hard", color: "#FF3B5C" },
];

function rpeColor(rpe: number): string {
  if (rpe <= 3) return "#22C55E";
  if (rpe <= 6) return "#EAB308";
  if (rpe <= 9) return "#FF6B35";
  return "#FF3B5C";
}

function difficultyLabel(d: string): string {
  const opt = DIFFICULTY_OPTIONS.find((o) => o.value === d);
  return opt ? opt.label : d;
}

function difficultyColor(d: string): string {
  const opt = DIFFICULTY_OPTIONS.find((o) => o.value === d);
  return opt ? opt.color : "rgba(255,255,255,0.4)";
}

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
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackItem[]>>({});
  const [feedbackEditing, setFeedbackEditing] = useState<Record<string, boolean>>({});
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [shareSession, setShareSession] = useState<TrainingSession | null>(null);

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

  async function toggleFeedback(sessionId: string, exercises: Exercise[]) {
    if (feedbackOpenId === sessionId) {
      setFeedbackOpenId(null);
      return;
    }
    setFeedbackOpenId(sessionId);
    // Fetch existing feedback
    const res = await fetch(`/api/exercise-feedback?session_id=${sessionId}`);
    const data = await res.json();
    const existing: FeedbackItem[] = (data.feedback || []).map((f: any) => ({
      id: f.id, session_id: f.session_id, exercise_name: f.exercise_name,
      rpe: f.rpe || 5, difficulty: f.difficulty || "", notes: f.notes || "",
    }));
    // For exercises without feedback, create blank entries
    const items: FeedbackItem[] = exercises.map((ex) => {
      const found = existing.find((f) => f.exercise_name === ex.name);
      return found || { session_id: sessionId, exercise_name: ex.name, rpe: 5, difficulty: "", notes: "" };
    });
    setFeedbackMap((prev) => ({ ...prev, [sessionId]: items }));
    // If there are any saved items, default to view mode
    setFeedbackEditing((prev) => ({ ...prev, [sessionId]: existing.length === 0 }));
  }

  function updateFeedbackItem(sessionId: string, exerciseName: string, field: keyof FeedbackItem, value: any) {
    setFeedbackMap((prev) => ({
      ...prev,
      [sessionId]: (prev[sessionId] || []).map((f) =>
        f.exercise_name === exerciseName ? { ...f, [field]: value } : f
      ),
    }));
  }

  async function saveFeedback(sessionId: string) {
    setSavingFeedback(true);
    const items = feedbackMap[sessionId] || [];
    for (const item of items) {
      if (item.id) {
        await fetch("/api/exercise-feedback", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, rpe: item.rpe, difficulty: item.difficulty || null, notes: item.notes }),
        });
      } else {
        const res = await fetch("/api/exercise-feedback", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, exercise_name: item.exercise_name, rpe: item.rpe, difficulty: item.difficulty || null, notes: item.notes }),
        });
        const data = await res.json();
        item.id = data.id;
      }
    }
    setFeedbackMap((prev) => ({ ...prev, [sessionId]: [...items] }));
    setFeedbackEditing((prev) => ({ ...prev, [sessionId]: false }));
    setSavingFeedback(false);
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
                <div className="flex gap-3">
                  <button onClick={() => setShareSession(s)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#A855F7")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                    Share
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
                    Delete
                  </button>
                </div>
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

              {/* Feedback Section */}
              {exercises.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => toggleFeedback(s.id, exercises)}
                    className="text-[11px] font-semibold hover:underline"
                    style={{ color: "#00F0FF" }}
                  >
                    {feedbackOpenId === s.id ? "Hide Feedback" : "Rate Exercises"}
                  </button>

                  {feedbackOpenId === s.id && feedbackMap[s.id] && (
                    <div className="mt-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>Exercise Feedback</span>
                        {!feedbackEditing[s.id] && (
                          <button onClick={() => setFeedbackEditing((prev) => ({ ...prev, [s.id]: true }))}
                            className="text-[11px] font-semibold hover:underline" style={{ color: "#00F0FF" }}>
                            Edit
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        {feedbackMap[s.id].map((fb) => (
                          <div key={fb.exercise_name} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                            <div className="text-[13px] font-semibold mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>{fb.exercise_name}</div>

                            {feedbackEditing[s.id] ? (
                              <>
                                {/* RPE Slider */}
                                <div className="mb-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>RPE</span>
                                    <span className="text-[13px] font-bold" style={{ color: rpeColor(fb.rpe) }}>{fb.rpe}</span>
                                  </div>
                                  <input
                                    type="range" min={1} max={10} value={fb.rpe}
                                    onChange={(e) => updateFeedbackItem(s.id, fb.exercise_name, "rpe", parseInt(e.target.value))}
                                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                    style={{
                                      background: `linear-gradient(to right, ${rpeColor(fb.rpe)} 0%, ${rpeColor(fb.rpe)} ${((fb.rpe - 1) / 9) * 100}%, rgba(255,255,255,0.08) ${((fb.rpe - 1) / 9) * 100}%, rgba(255,255,255,0.08) 100%)`,
                                      accentColor: rpeColor(fb.rpe),
                                    }}
                                  />
                                </div>

                                {/* Difficulty Pills */}
                                <div className="mb-2">
                                  <span className="text-[11px] block mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>Difficulty</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {DIFFICULTY_OPTIONS.map((opt) => {
                                      const selected = fb.difficulty === opt.value;
                                      return (
                                        <button key={opt.value} type="button"
                                          onClick={() => updateFeedbackItem(s.id, fb.exercise_name, "difficulty", selected ? "" : opt.value)}
                                          className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                                          style={{
                                            background: selected ? `${opt.color}12` : "rgba(255,255,255,0.03)",
                                            border: selected ? `1px solid ${opt.color}40` : "1px solid rgba(255,255,255,0.06)",
                                            color: selected ? opt.color : "rgba(255,255,255,0.35)",
                                          }}>
                                          {opt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Notes */}
                                <input
                                  value={fb.notes}
                                  onChange={(e) => updateFeedbackItem(s.id, fb.exercise_name, "notes", e.target.value)}
                                  placeholder="Notes..."
                                  className="input !py-1.5 text-[12px] w-full"
                                />
                              </>
                            ) : (
                              /* View mode - show saved feedback inline */
                              <div className="flex items-center gap-3 flex-wrap">
                                {fb.id && (
                                  <>
                                    <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg" style={{ color: rpeColor(fb.rpe), background: `${rpeColor(fb.rpe)}15` }}>
                                      RPE {fb.rpe}
                                    </span>
                                    {fb.difficulty && (
                                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg" style={{ color: difficultyColor(fb.difficulty), background: `${difficultyColor(fb.difficulty)}15` }}>
                                        {difficultyLabel(fb.difficulty)}
                                      </span>
                                    )}
                                    {fb.notes && (
                                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{fb.notes}</span>
                                    )}
                                  </>
                                )}
                                {!fb.id && (
                                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>No feedback yet</span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {feedbackEditing[s.id] && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => saveFeedback(s.id)} disabled={savingFeedback}
                            className="btn-primary !py-1.5 text-[12px]">
                            {savingFeedback ? "Saving..." : "Save All Feedback"}
                          </button>
                          <button onClick={() => setFeedbackEditing((prev) => ({ ...prev, [s.id]: false }))}
                            className="btn-secondary !py-1.5 text-[12px]">
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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

      {shareSession && (
        <ShareableStory
          data={{
            title: shareSession.title,
            date: shareSession.date,
            planTitle: shareSession.plan_title,
            exercises: JSON.parse(shareSession.exercises || "[]"),
            notes: shareSession.notes,
            status: shareSession.status,
          }}
          onClose={() => setShareSession(null)}
        />
      )}
    </div>
  );
}
