"use client";

import { useEffect, useState } from "react";
import BodyMap from "@/components/anatomy/BodyMap";
import ExerciseDetailPanel from "@/components/exercises/ExerciseDetailPanel";

interface MuscleDetail {
  name: string;
  scientificName: string;
  role: "primary" | "secondary" | "stabilizer";
  layer: "superficial" | "deep" | "core";
  origin?: string;
  insertion?: string;
  innervation?: string;
  action?: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  detailedDescription?: string;
  muscleGroups: string[];
  muscles: MuscleDetail[];
  equipment: string[];
  difficulty: string;
  movementPattern: string;
  plane: string;
  forceType: string;
  joints: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  running: "#4D7CFF", swimming: "#06B6D4", cycling: "#00FF88",
  triathlon: "#A855F7", gym: "#FF6B35", hyrox: "#FF3B5C",
  crossfit: "#FF2D92", weightlifting: "#F59E0B", powerlifting: "#8B5CF6",
};

const CATEGORY_LABELS: Record<string, string> = {
  running: "Running", swimming: "Swimming", cycling: "Cycling",
  triathlon: "Triathlon", gym: "Gym", hyrox: "HYROX",
  crossfit: "CrossFit", weightlifting: "Weightlifting", powerlifting: "Powerlifting",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#00FF88", intermediate: "#4D7CFF", advanced: "#FF6B35", elite: "#FF2D92",
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [muscleTab, setMuscleTab] = useState<"all" | "primary" | "secondary" | "stabilizer">("all");

  useEffect(() => { fetchExercises(); }, [search, activeCategory]);

  async function fetchExercises() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (activeCategory) params.set("category", activeCategory);
    const res = await fetch(`/api/exercises?${params}`);
    const data = await res.json();
    setExercises(data.exercises || []);
    setTotal(data.totalLibrary || 0);
  }

  const filtered = selectedMuscleGroup
    ? exercises.filter(ex => ex.muscleGroups?.includes(selectedMuscleGroup))
    : exercises;

  const grouped = filtered.reduce<Record<string, Exercise[]>>((acc, ex) => {
    (acc[ex.subcategory] ??= []).push(ex);
    return acc;
  }, {});

  const visibleMuscles = selectedExercise?.muscles?.filter(
    m => muscleTab === "all" || m.role === muscleTab
  ) || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[36px] font-bold tracking-[-0.04em]" style={{ color: "rgba(255,255,255,0.95)" }}>
          Exercise Atlas
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          {total} exercises &middot; Interactive anatomy &middot; Movement simulation
        </p>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises, muscles, equipment..."
          className="input !py-3.5 !pl-11 !pr-4 !text-[14px]" />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveCategory(null)}
          className="px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all"
          style={{
            background: !activeCategory ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
            color: !activeCategory ? "#fff" : "rgba(255,255,255,0.35)",
            border: !activeCategory ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.06)",
          }}>All</button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: activeCategory === key ? `${CATEGORY_COLORS[key]}15` : "rgba(255,255,255,0.03)",
              color: activeCategory === key ? CATEGORY_COLORS[key] : "rgba(255,255,255,0.35)",
              border: activeCategory === key ? `1px solid ${CATEGORY_COLORS[key]}30` : "1px solid rgba(255,255,255,0.06)",
            }}>{label}</button>
        ))}
      </div>

      {/* Muscle group filter */}
      {selectedMuscleGroup && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>Filtering:</span>
          <button onClick={() => setSelectedMuscleGroup(null)}
            className="muscle-pill" style={{ background: "rgba(0,240,255,0.08)", color: "#00F0FF", border: "1px solid rgba(0,240,255,0.15)" }}>
            {selectedMuscleGroup}
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" fill="none">
              <path d="M2 2l6 6M8 2l-6 6" /></svg>
          </button>
        </div>
      )}

      <p className="text-[11px] font-medium uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>
        {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {/* Main layout */}
      <div className="flex gap-6">
        {/* Exercise list */}
        <div className={`${selectedExercise ? "w-[45%]" : "w-[65%]"} transition-all duration-500`}>
          {filtered.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>No exercises found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([sub, items]) => (
                <div key={sub}>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2.5 px-1"
                    style={{ color: "rgba(255,255,255,0.2)" }}>{sub}</h3>
                  <div className="space-y-1.5">
                    {items.map(ex => {
                      const sel = selectedExercise?.id === ex.id;
                      const c = CATEGORY_COLORS[ex.category] || "#fff";
                      return (
                        <div key={ex.id} onClick={() => { setSelectedExercise(sel ? null : ex); setMuscleTab("all"); }}
                          className="card !rounded-2xl cursor-pointer"
                          style={{
                            background: sel ? `linear-gradient(135deg, ${c}08, transparent)` : undefined,
                            borderColor: sel ? `${c}30` : undefined,
                          }}>
                          <div className="px-5 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}50` }} />
                              <span className="text-[13px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                                {ex.name}</span>
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: `${DIFFICULTY_COLORS[ex.difficulty]}12`, color: DIFFICULTY_COLORS[ex.difficulty],
                                  border: `1px solid ${DIFFICULTY_COLORS[ex.difficulty]}20` }}>{ex.difficulty}</span>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                              style={{ transform: sel ? "rotate(90deg)" : "none", transition: "transform 0.3s ease", flexShrink: 0 }}>
                              <path d="M9 18l6-6-6-6" /></svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className={`${selectedExercise ? "w-[55%]" : "w-[35%]"} transition-all duration-500`}>
          <div className="sticky top-6">
            {selectedExercise ? (
              <ExerciseDetailPanel
                exercise={selectedExercise}
                muscleTab={muscleTab}
                setMuscleTab={setMuscleTab}
                visibleMuscles={visibleMuscles}
                onClose={() => setSelectedExercise(null)}
              />
            ) : (
              <div className="card p-6">
                <h3 className="text-[12px] font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Muscle Filter
                </h3>
                <p className="text-[12px] mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Click a muscle region to filter exercises
                </p>
                <BodyMap
                  onMuscleSelect={(g) => setSelectedMuscleGroup(selectedMuscleGroup === g ? null : g)}
                  selectedMuscle={selectedMuscleGroup}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
