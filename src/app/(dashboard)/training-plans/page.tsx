"use client";

import { useEffect, useState } from "react";

interface TrainingPlan {
  id: string; title: string; description: string; start_date: string; end_date: string;
  athlete_name: string; endeavour_title: string; endeavour_id: string; athlete_id: string;
}
interface Athlete { id: string; name: string; }
interface Endeavour { id: string; title: string; }

const GOAL_TYPES = [
  { value: "marathon", label: "Marathon" },
  { value: "half_marathon", label: "Half Marathon" },
  { value: "5k", label: "5K" },
  { value: "10k", label: "10K" },
  { value: "ironman", label: "Ironman" },
  { value: "half_ironman", label: "Half Ironman" },
  { value: "olympic_triathlon", label: "Olympic Triathlon" },
  { value: "sprint_triathlon", label: "Sprint Triathlon" },
  { value: "cycling_century", label: "Century Ride" },
  { value: "cycling_gran_fondo", label: "Gran Fondo" },
  { value: "swimming_open_water", label: "Open Water Swimming" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "muscle_building", label: "Muscle Building" },
  { value: "weight_loss", label: "Weight Loss" },
  { value: "hyrox", label: "HYROX" },
  { value: "crossfit_competition", label: "CrossFit Competition" },
  { value: "powerlifting_meet", label: "Powerlifting Meet" },
  { value: "custom", label: "Custom Goal" },
];

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced", "elite"];
const DAYS_OPTIONS = [3, 4, 5, 6, 7];
const DURATION_OPTIONS = [4, 6, 8, 10, 12, 16, 20, 24, 36, 52];

export default function TrainingPlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [endeavours, setEndeavours] = useState<Endeavour[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAiForm, setShowAiForm] = useState(false);
  const [form, setForm] = useState({ endeavour_id: "", athlete_id: "", title: "", description: "", start_date: "", end_date: "" });
  const [aiForm, setAiForm] = useState({
    endeavour_id: "", athlete_id: "", goal_type: "marathon", experience_level: "intermediate",
    days_per_week: 4, plan_duration_weeks: 12, title: "", custom_description: "",
  });
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [plansRes, athRes, endRes] = await Promise.all([fetch("/api/training-plans"), fetch("/api/athletes"), fetch("/api/endeavours")]);
    const plansData = await plansRes.json();
    const athData = await athRes.json();
    const endData = await endRes.json();
    setPlans(plansData.plans || []);
    setAthletes(athData.athletes || []);
    setEndeavours(endData.endeavours || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/training-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ endeavour_id: "", athlete_id: "", title: "", description: "", start_date: "", end_date: "" });
    setShowForm(false);
    fetchData();
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setSuccessMsg("");
    try {
      const res = await fetch("/api/generate-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aiForm) });
      const data = await res.json();
      if (data.sessions_created) {
        setSuccessMsg(`Plan generated with ${data.sessions_created} sessions!`);
        setShowAiForm(false);
        setAiForm({ ...aiForm, title: "", custom_description: "" });
        fetchData();
      }
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this training plan and all its sessions?")) return;
    await fetch("/api/training-plans", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  }

  const canCreate = athletes.length > 0 && endeavours.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>Training Plans</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{plans.length} plan{plans.length !== 1 ? "s" : ""}</p>
        </div>
        {canCreate && (
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAiForm(!showAiForm); setShowForm(false); setSuccessMsg(""); }}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: showAiForm ? "rgba(168,85,247,0.08)" : "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.08))",
                border: "1px solid rgba(168,85,247,0.3)",
                color: showAiForm ? "rgba(255,255,255,0.5)" : "#A855F7",
              }}
            >
              {showAiForm ? "Cancel" : "AI Generate"}
            </button>
            <button onClick={() => { setShowForm(!showForm); setShowAiForm(false); setSuccessMsg(""); }} className={showForm ? "btn-secondary" : "btn-primary"}>
              {showForm ? "Cancel" : "New Plan"}
            </button>
          </div>
        )}
      </div>

      {!canCreate && (
        <div className="card p-4 mb-6" style={{ borderColor: "rgba(255,107,53,0.2)" }}>
          <p className="text-[13px]" style={{ color: "#FF6B35" }}>Add athletes and create an endeavour before building plans.</p>
        </div>
      )}

      {successMsg && (
        <div className="card p-4 mb-6" style={{ borderColor: "rgba(0,255,136,0.2)", background: "rgba(0,255,136,0.04)" }}>
          <p className="text-[13px] font-semibold" style={{ color: "#00FF88" }}>{successMsg}</p>
        </div>
      )}

      {/* AI Generation Form */}
      {showAiForm && (
        <div className="card p-6 mb-6" style={{ borderColor: "rgba(168,85,247,0.15)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[14px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>AI Plan Generator</span>
          </div>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <select required value={aiForm.endeavour_id} onChange={(e) => setAiForm({ ...aiForm, endeavour_id: e.target.value })} className="input">
                <option value="">Endeavour...</option>
                {endeavours.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              <select required value={aiForm.athlete_id} onChange={(e) => setAiForm({ ...aiForm, athlete_id: e.target.value })} className="input">
                <option value="">Athlete...</option>
                {athletes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 block" style={{ color: "rgba(255,255,255,0.35)" }}>Goal Type</label>
              <select value={aiForm.goal_type} onChange={(e) => setAiForm({ ...aiForm, goal_type: e.target.value })} className="input">
                {GOAL_TYPES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 block" style={{ color: "rgba(255,255,255,0.35)" }}>Experience Level</label>
              <div className="flex gap-2">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button key={lvl} type="button" onClick={() => setAiForm({ ...aiForm, experience_level: lvl })}
                    className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all flex-1 capitalize"
                    style={{
                      background: aiForm.experience_level === lvl ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.03)",
                      border: aiForm.experience_level === lvl ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      color: aiForm.experience_level === lvl ? "#A855F7" : "rgba(255,255,255,0.4)",
                    }}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 block" style={{ color: "rgba(255,255,255,0.35)" }}>Days per Week</label>
              <div className="flex gap-2">
                {DAYS_OPTIONS.map((d) => (
                  <button key={d} type="button" onClick={() => setAiForm({ ...aiForm, days_per_week: d })}
                    className="w-12 h-10 rounded-xl text-[13px] font-semibold transition-all"
                    style={{
                      background: aiForm.days_per_week === d ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.03)",
                      border: aiForm.days_per_week === d ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      color: aiForm.days_per_week === d ? "#A855F7" : "rgba(255,255,255,0.4)",
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2 block" style={{ color: "rgba(255,255,255,0.35)" }}>Plan Duration</label>
              <select value={aiForm.plan_duration_weeks} onChange={(e) => setAiForm({ ...aiForm, plan_duration_weeks: parseInt(e.target.value) })} className="input">
                {DURATION_OPTIONS.map((w) => <option key={w} value={w}>{w} weeks</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input value={aiForm.title} onChange={(e) => setAiForm({ ...aiForm, title: e.target.value })} placeholder="Custom title (optional)" className="input" />
              <input value={aiForm.custom_description} onChange={(e) => setAiForm({ ...aiForm, custom_description: e.target.value })} placeholder="Notes for the plan (optional)" className="input" />
            </div>

            <button type="submit" disabled={generating}
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: generating ? "rgba(168,85,247,0.1)" : "linear-gradient(135deg, #A855F7, #7C3AED)",
                color: generating ? "#A855F7" : "white",
                opacity: generating ? 0.7 : 1,
                animation: generating ? "pulse 2s infinite" : "none",
              }}>
              {generating ? "Generating..." : "Generate Plan"}
            </button>
          </form>
        </div>
      )}

      {/* Manual Form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select required value={form.endeavour_id} onChange={(e) => setForm({ ...form, endeavour_id: e.target.value })} className="input">
                <option value="">Endeavour...</option>
                {endeavours.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              <select required value={form.athlete_id} onChange={(e) => setForm({ ...form, athlete_id: e.target.value })} className="input">
                <option value="">Athlete...</option>
                {athletes.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Plan title" className="input" />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input" />
              <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="input" />
              <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="input" />
            </div>
            <button type="submit" className="btn-primary">Create Plan</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {plans.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>No training plans yet.</p>
          </div>
        ) : plans.map((p) => (
          <div key={p.id} className="card p-6 flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>{p.title}</h3>
              <p className="text-[12px] mt-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                {p.athlete_name} &middot; {p.endeavour_title}
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                {new Date(p.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} &rarr;{" "}
                {new Date(p.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              {p.description && <p className="text-[13px] mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>{p.description}</p>}
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-[12px] font-medium transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3B5C")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
