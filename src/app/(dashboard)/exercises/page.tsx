"use client";

import { useEffect, useState } from "react";
import AnatomyViewer from "@/components/AnatomyViewer";

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

const categoryColors: Record<string, string> = {
  running: "#4D7CFF",
  swimming: "#06B6D4",
  cycling: "#00FF88",
  triathlon: "#A855F7",
  gym: "#FF6B35",
  hyrox: "#FF3B5C",
  crossfit: "#FF2D92",
  weightlifting: "#F59E0B",
  powerlifting: "#8B5CF6",
};

const categoryLabels: Record<string, string> = {
  running: "Running",
  swimming: "Swimming",
  cycling: "Cycling",
  triathlon: "Triathlon",
  gym: "Gym",
  hyrox: "HYROX",
  crossfit: "CrossFit",
  weightlifting: "Weightlifting",
  powerlifting: "Powerlifting",
};

const difficultyColors: Record<string, string> = {
  beginner: "#00FF88",
  intermediate: "#4D7CFF",
  advanced: "#FF6B35",
  elite: "#FF2D92",
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeMuscleTab, setActiveMuscleTab] = useState<"all" | "primary" | "secondary" | "stabilizer">("all");

  useEffect(() => {
    fetchExercises();
  }, [search, activeCategory]);

  async function fetchExercises() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (activeCategory) params.set("category", activeCategory);
    const res = await fetch(`/api/exercises?${params}`);
    const data = await res.json();
    setExercises(data.exercises || []);
    setTotal(data.totalLibrary || 0);
  }

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    const key = ex.subcategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ex);
    return acc;
  }, {});

  const filteredMuscles = selectedExercise?.muscles?.filter(m =>
    activeMuscleTab === "all" || m.role === activeMuscleTab
  ) || [];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(0,240,255,0.1)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <div>
            <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>
              Exercise Atlas
            </h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {total} exercises &middot; Interactive anatomy &middot; Tissue-level detail
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises, muscles, equipment..."
          className="input !py-3.5 !pl-11 !pr-4 !text-[14px]"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className="px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-[0.03em] transition-all"
          style={{
            background: !activeCategory ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
            color: !activeCategory ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
            border: !activeCategory ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          All
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className="px-4 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-[0.03em] transition-all"
            style={{
              background: activeCategory === key ? `${categoryColors[key]}18` : "rgba(255,255,255,0.03)",
              color: activeCategory === key ? categoryColors[key] : "rgba(255,255,255,0.35)",
              border: activeCategory === key ? `1px solid ${categoryColors[key]}35` : "1px solid rgba(255,255,255,0.06)",
              boxShadow: activeCategory === key ? `0 0 15px ${categoryColors[key]}10` : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-[11px] font-medium uppercase tracking-[0.05em] mb-5" style={{ color: "rgba(255,255,255,0.25)" }}>
        {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {/* Main content - Exercise list + Detail panel */}
      <div className="flex gap-6">
        {/* Exercise list */}
        <div className={`${selectedExercise ? "w-1/2" : "w-full"} transition-all duration-500`}>
          {exercises.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>No exercises found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([subcategory, items]) => (
                <div key={subcategory}>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3 px-1"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    {subcategory}
                  </h3>
                  <div className="space-y-1.5">
                    {items.map((ex) => {
                      const isSelected = selectedExercise?.id === ex.id;
                      return (
                        <div
                          key={ex.id}
                          className="card !rounded-2xl cursor-pointer"
                          onClick={() => setSelectedExercise(isSelected ? null : ex)}
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${categoryColors[ex.category]}08, transparent)`
                              : undefined,
                            borderColor: isSelected ? `${categoryColors[ex.category]}30` : undefined,
                            boxShadow: isSelected ? `0 0 30px ${categoryColors[ex.category]}08` : undefined,
                          }}
                        >
                          <div className="px-5 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: categoryColors[ex.category], boxShadow: `0 0 8px ${categoryColors[ex.category]}50` }} />
                              <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                                {ex.name}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full"
                                style={{
                                  background: `${difficultyColors[ex.difficulty]}12`,
                                  color: difficultyColors[ex.difficulty],
                                  border: `1px solid ${difficultyColors[ex.difficulty]}20`,
                                }}>
                                {ex.difficulty}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {ex.muscles && ex.muscles.length > 0 && (
                                <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.2)" }}>
                                  {ex.muscles.filter(m => m.role === "primary").length} primary
                                </span>
                              )}
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                                style={{ transform: isSelected ? "rotate(90deg)" : "none", transition: "transform 0.3s ease" }}>
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </div>
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

        {/* Detail Panel */}
        {selectedExercise && (
          <div className="w-1/2 sticky top-10 self-start" style={{ animation: "pageReveal 0.4s ease" }}>
            <div className="card p-0 overflow-hidden" style={{ borderColor: `${categoryColors[selectedExercise.category]}20` }}>
              {/* Header */}
              <div className="p-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${categoryColors[selectedExercise.category]}15`,
                          color: categoryColors[selectedExercise.category],
                          border: `1px solid ${categoryColors[selectedExercise.category]}25`,
                        }}>
                        {categoryLabels[selectedExercise.category]}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${difficultyColors[selectedExercise.difficulty]}12`,
                          color: difficultyColors[selectedExercise.difficulty],
                          border: `1px solid ${difficultyColors[selectedExercise.difficulty]}20`,
                        }}>
                        {selectedExercise.difficulty}
                      </span>
                    </div>
                    <h2 className="text-[22px] font-bold tracking-[-0.02em] mt-2" style={{ color: "rgba(255,255,255,0.95)" }}>
                      {selectedExercise.name}
                    </h2>
                  </div>
                  <button onClick={() => setSelectedExercise(null)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-[13px] leading-relaxed mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {selectedExercise.detailedDescription || selectedExercise.description}
                </p>
              </div>

              {/* Movement info */}
              <div className="px-6 py-4 grid grid-cols-3 gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>Pattern</p>
                  <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {selectedExercise.movementPattern?.replace(/-/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>Plane</p>
                  <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {selectedExercise.plane?.replace(/-/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>Force</p>
                  <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {selectedExercise.forceType}
                  </p>
                </div>
              </div>

              {/* Anatomy section */}
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Anatomy
                  </h3>
                </div>

                {/* Anatomy Viewer */}
                <div className="flex justify-center mb-4">
                  <AnatomyViewer
                    highlightedMuscles={selectedExercise.muscleGroups}
                    compact
                  />
                </div>

                {/* Muscle role tabs */}
                <div className="flex gap-1 mb-3">
                  {(["all", "primary", "secondary", "stabilizer"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveMuscleTab(tab)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-[0.03em] transition-all"
                      style={{
                        background: activeMuscleTab === tab ? "rgba(0,240,255,0.08)" : "transparent",
                        color: activeMuscleTab === tab ? "#00F0FF" : "rgba(255,255,255,0.25)",
                      }}>
                      {tab} {tab !== "all" && `(${selectedExercise.muscles?.filter(m => m.role === tab).length || 0})`}
                    </button>
                  ))}
                </div>

                {/* Muscle details */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredMuscles.map((m, i) => (
                    <div key={i} className="rounded-xl p-3" style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <p className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                            {m.name}
                          </p>
                          <p className="text-[10px] italic" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {m.scientificName}
                          </p>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: m.role === "primary" ? "rgba(0,240,255,0.1)" : m.role === "secondary" ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.05)",
                            color: m.role === "primary" ? "#00F0FF" : m.role === "secondary" ? "#A855F7" : "rgba(255,255,255,0.4)",
                            border: `1px solid ${m.role === "primary" ? "rgba(0,240,255,0.2)" : m.role === "secondary" ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.08)"}`,
                          }}>
                          {m.role}
                        </span>
                      </div>

                      {(m.origin || m.insertion || m.innervation) && (
                        <div className="grid grid-cols-1 gap-1 mt-2">
                          {m.origin && (
                            <div className="flex gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider shrink-0 w-16" style={{ color: "rgba(255,59,92,0.6)" }}>Origin</span>
                              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{m.origin}</span>
                            </div>
                          )}
                          {m.insertion && (
                            <div className="flex gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider shrink-0 w-16" style={{ color: "rgba(0,255,136,0.6)" }}>Insertion</span>
                              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{m.insertion}</span>
                            </div>
                          )}
                          {m.innervation && (
                            <div className="flex gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider shrink-0 w-16" style={{ color: "rgba(77,124,255,0.6)" }}>Nerve</span>
                              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{m.innervation}</span>
                            </div>
                          )}
                          {m.action && (
                            <div className="flex gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider shrink-0 w-16" style={{ color: "rgba(168,85,247,0.6)" }}>Action</span>
                              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{m.action}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment & Joints */}
              <div className="px-6 py-4">
                {selectedExercise.equipment.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Equipment</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExercise.equipment.map((eq) => (
                        <span key={eq} className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: "rgba(0,240,255,0.06)", color: "#00F0FF", border: "1px solid rgba(0,240,255,0.12)" }}>
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedExercise.joints && selectedExercise.joints.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Joints Involved</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExercise.joints.map((j) => (
                        <span key={j} className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
                          style={{ background: "rgba(168,85,247,0.06)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.12)" }}>
                          {j}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
