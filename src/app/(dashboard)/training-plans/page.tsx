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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight">Training Plans</h1>
          <p className="text-[14px] text-[#9CA3AF] mt-1">
            {plans.length} plan{plans.length !== 1 ? "s" : ""}
          </p>
        </div>
        {athletes.length > 0 && endeavours.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? "btn-secondary" : "btn-primary"}
          >
            {showForm ? "Cancel" : "New Plan"}
          </button>
        )}
      </div>

      {(athletes.length === 0 || endeavours.length === 0) && (
        <div className="card p-4 mb-6 border-[#FFF7ED]">
          <p className="text-[13px] text-[#D97706]">
            Add athletes and create an endeavour before building plans.
          </p>
        </div>
      )}

      {showForm && (
        <div className="card p-6 mb-6">
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                value={form.endeavour_id}
                onChange={(e) => setForm({ ...form, endeavour_id: e.target.value })}
                className="input"
              >
                <option value="">Endeavour...</option>
                {endeavours.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
              <select
                required
                value={form.athlete_id}
                onChange={(e) => setForm({ ...form, athlete_id: e.target.value })}
                className="input"
              >
                <option value="">Athlete...</option>
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Plan title"
                className="input"
              />
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="input"
              />
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="input"
              />
              <input
                type="date"
                required
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="input"
              />
            </div>
            <button type="submit" className="btn-primary">Create Plan</button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {plans.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-[14px] text-[#9CA3AF]">No training plans yet.</p>
          </div>
        ) : (
          plans.map((p) => (
            <div key={p.id} className="card p-5 flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-semibold">{p.title}</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-1">
                  {p.athlete_name} &middot; {p.endeavour_title}
                </p>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                  {new Date(p.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} &rarr;{" "}
                  {new Date(p.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                {p.description && <p className="text-[13px] text-[#6B6B6B] mt-2">{p.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-[12px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
