"use client";

import BodyMap from "@/components/anatomy/BodyMap";
import ExerciseDemo from "@/components/exercises/ExerciseDemo";

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

interface ExerciseDetailPanelProps {
  exercise: Exercise;
  muscleTab: "all" | "primary" | "secondary" | "stabilizer";
  setMuscleTab: (t: "all" | "primary" | "secondary" | "stabilizer") => void;
  visibleMuscles: MuscleDetail[];
  onClose: () => void;
}

export default function ExerciseDetailPanel({ exercise, muscleTab, setMuscleTab, visibleMuscles, onClose }: ExerciseDetailPanelProps) {
  const c = CATEGORY_COLORS[exercise.category] || "#fff";
  return (
    <div className="card p-0 overflow-hidden" style={{ borderColor: `${c}20`, animation: "fadeUp 0.4s ease" }}>
      {/* Header */}
      <div className="p-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ background: `${c}15`, color: c, border: `1px solid ${c}25` }}>
                {CATEGORY_LABELS[exercise.category]}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ background: `${DIFFICULTY_COLORS[exercise.difficulty]}12`, color: DIFFICULTY_COLORS[exercise.difficulty],
                  border: `1px solid ${DIFFICULTY_COLORS[exercise.difficulty]}20` }}>{exercise.difficulty}</span>
            </div>
            <h2 className="text-[22px] font-bold tracking-[-0.02em] mt-2" style={{ color: "rgba(255,255,255,0.95)" }}>
              {exercise.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-[13px] leading-relaxed mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          {exercise.detailedDescription || exercise.description}</p>
      </div>

      {/* Exercise Demo */}
      <div className="px-6 py-4 demo-box mx-4 my-3 rounded-2xl">
        <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(0,240,255,0.5)" }}>
          Movement Simulation</p>
        <ExerciseDemo exerciseId={exercise.id} exerciseName={exercise.name} movementPattern={exercise.movementPattern} />
      </div>

      {/* Movement info */}
      <div className="px-6 py-3 grid grid-cols-3 gap-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {[
          { label: "Pattern", value: exercise.movementPattern?.replace(/-/g, " ") },
          { label: "Plane", value: exercise.plane },
          { label: "Force", value: exercise.forceType },
        ].map(i => (
          <div key={i.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>{i.label}</p>
            <p className="text-[12px] font-semibold capitalize" style={{ color: "rgba(255,255,255,0.7)" }}>{i.value}</p>
          </div>
        ))}
      </div>

      {/* Anatomy section with mini body map */}
      <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <BodyMap highlightedMuscles={exercise.muscleGroups} compact peelLevel={40} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex gap-1 mb-3">
              {(["all", "primary", "secondary", "stabilizer"] as const).map(tab => (
                <button key={tab} onClick={() => setMuscleTab(tab)}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
                  style={{
                    background: muscleTab === tab ? "rgba(0,240,255,0.08)" : "transparent",
                    color: muscleTab === tab ? "#00F0FF" : "rgba(255,255,255,0.25)",
                  }}>{tab} {tab !== "all" && `(${exercise.muscles?.filter(m => m.role === tab).length || 0})`}</button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {visibleMuscles.map((m, i) => (
                <MuscleCard key={i} muscle={m} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Equipment & Joints */}
      <div className="px-6 py-4">
        {exercise.equipment.length > 0 && (
          <div className="mb-3">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Equipment</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.equipment.map(eq => (
                <span key={eq} className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(0,240,255,0.06)", color: "#00F0FF", border: "1px solid rgba(0,240,255,0.12)" }}>{eq}</span>
              ))}
            </div>
          </div>
        )}
        {exercise.joints?.length > 0 && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Joints</p>
            <div className="flex flex-wrap gap-1.5">
              {exercise.joints.map(j => (
                <span key={j} className="text-[10px] font-medium px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(168,85,247,0.06)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.12)" }}>{j}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MuscleCard({ muscle }: { muscle: MuscleDetail }) {
  return (
    <div className="rounded-xl p-2.5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>{muscle.name}</p>
        <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: muscle.role === "primary" ? "rgba(0,240,255,0.1)" : muscle.role === "secondary" ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.05)",
            color: muscle.role === "primary" ? "#00F0FF" : muscle.role === "secondary" ? "#A855F7" : "rgba(255,255,255,0.4)",
          }}>{muscle.role}</span>
      </div>
      <p className="text-[10px] italic mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{muscle.scientificName}</p>
      {(muscle.origin || muscle.action) && (
        <div className="grid grid-cols-1 gap-0.5 mt-1">
          {muscle.origin && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}><span style={{ color: "rgba(255,59,92,0.6)" }} className="font-bold">O:</span> {muscle.origin}</p>}
          {muscle.insertion && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}><span style={{ color: "rgba(0,255,136,0.6)" }} className="font-bold">I:</span> {muscle.insertion}</p>}
          {muscle.innervation && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}><span style={{ color: "rgba(77,124,255,0.6)" }} className="font-bold">N:</span> {muscle.innervation}</p>}
          {muscle.action && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}><span style={{ color: "rgba(168,85,247,0.6)" }} className="font-bold">A:</span> {muscle.action}</p>}
        </div>
      )}
    </div>
  );
}
