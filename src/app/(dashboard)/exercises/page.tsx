"use client";

import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  defaultSets?: number;
  defaultReps?: string;
  defaultDuration?: string;
  defaultDistance?: string;
  defaultRest?: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
}

const categoryColors: Record<string, string> = {
  running: "#3B82F6",
  swimming: "#06B6D4",
  cycling: "#10B981",
  triathlon: "#8B5CF6",
  gym: "#F59E0B",
  hyrox: "#EF4444",
  crossfit: "#EC4899",
  weightlifting: "#F97316",
  powerlifting: "#6366F1",
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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold tracking-tight">Exercise Library</h1>
        <p className="text-[14px] text-[#9CA3AF] mt-1">
          {total} exercises across 9 disciplines
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises, muscles, equipment..."
          className="input !py-3 !px-4 !text-[15px]"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
            !activeCategory
              ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
              : "border-[rgba(0,0,0,0.08)] text-[#6B6B6B] hover:border-[rgba(0,0,0,0.2)]"
          }`}
        >
          All
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
              activeCategory === key
                ? "text-white"
                : "border-[rgba(0,0,0,0.08)] text-[#6B6B6B] hover:border-[rgba(0,0,0,0.2)]"
            }`}
            style={
              activeCategory === key
                ? { backgroundColor: categoryColors[key], borderColor: categoryColors[key] }
                : undefined
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-[12px] text-[#9CA3AF] mb-4">
        {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {/* Grouped exercises */}
      {exercises.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[14px] text-[#9CA3AF]">No exercises found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([subcategory, items]) => (
            <div key={subcategory}>
              <h3 className="text-[12px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2 px-1">
                {subcategory}
              </h3>
              <div className="space-y-1">
                {items.map((ex) => (
                  <div
                    key={ex.id}
                    className="card !rounded-xl cursor-pointer"
                    onClick={() => setExpanded(expanded === ex.id ? null : ex.id)}
                  >
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryColors[ex.category] }}
                        />
                        <span className="text-[14px] font-medium">{ex.name}</span>
                        <span className="badge bg-[#F5F5F5] text-[#9CA3AF] !text-[10px]">
                          {ex.difficulty}
                        </span>
                      </div>
                      <svg
                        className={`w-4 h-4 text-[#9CA3AF] transition-transform ${expanded === ex.id ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {expanded === ex.id && (
                      <div className="px-4 pb-4 pt-1 border-t border-[rgba(0,0,0,0.04)]">
                        <p className="text-[13px] text-[#6B6B6B] mb-3">{ex.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
                          {ex.defaultSets && (
                            <div>
                              <p className="text-[#9CA3AF]">Sets</p>
                              <p className="font-medium">{ex.defaultSets}</p>
                            </div>
                          )}
                          {ex.defaultReps && (
                            <div>
                              <p className="text-[#9CA3AF]">Reps</p>
                              <p className="font-medium">{ex.defaultReps}</p>
                            </div>
                          )}
                          {ex.defaultDuration && (
                            <div>
                              <p className="text-[#9CA3AF]">Duration</p>
                              <p className="font-medium">{ex.defaultDuration}</p>
                            </div>
                          )}
                          {ex.defaultDistance && (
                            <div>
                              <p className="text-[#9CA3AF]">Distance</p>
                              <p className="font-medium">{ex.defaultDistance}</p>
                            </div>
                          )}
                          {ex.defaultRest && (
                            <div>
                              <p className="text-[#9CA3AF]">Rest</p>
                              <p className="font-medium">{ex.defaultRest}</p>
                            </div>
                          )}
                        </div>
                        {ex.muscleGroups.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {ex.muscleGroups.map((m) => (
                              <span key={m} className="badge bg-[#F5F5F5] text-[#6B6B6B] !text-[10px]">
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                        {ex.equipment.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {ex.equipment.map((eq) => (
                              <span key={eq} className="badge bg-[#EBF5FF] text-[#0071E3] !text-[10px]">
                                {eq}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
