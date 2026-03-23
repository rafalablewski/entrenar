"use client";

import { useState } from "react";

interface BodyMapProps {
  highlightedMuscles?: string[];
  onMuscleSelect?: (muscleGroup: string) => void;
  selectedMuscle?: string | null;
  peelLevel?: number;
  compact?: boolean;
}

interface MuscleRegion {
  id: string;
  label: string;
  group: string;
  color: string;
  d: string;
  view: "front" | "back";
  layer: "superficial" | "deep";
}

const MUSCLE_REGIONS: MuscleRegion[] = [
  // FRONT VIEW - Superficial
  { id: "chest-l", label: "Pectoralis Major", group: "chest", color: "#FF4466", view: "front", layer: "superficial",
    d: "M48,38 Q40,36 36,42 Q34,48 36,55 Q40,58 48,56 Q52,54 52,48 Q52,42 48,38Z" },
  { id: "chest-r", label: "Pectoralis Major", group: "chest", color: "#FF4466", view: "front", layer: "superficial",
    d: "M52,38 Q60,36 64,42 Q66,48 64,55 Q60,58 52,56 Q48,54 48,48 Q48,42 52,38Z" },
  { id: "front-delt-l", label: "Anterior Deltoid", group: "shoulders", color: "#FF6B35", view: "front", layer: "superficial",
    d: "M33,34 Q28,32 26,36 Q25,42 28,46 Q32,44 34,40 Q36,36 33,34Z" },
  { id: "front-delt-r", label: "Anterior Deltoid", group: "shoulders", color: "#FF6B35", view: "front", layer: "superficial",
    d: "M67,34 Q72,32 74,36 Q75,42 72,46 Q68,44 66,40 Q64,36 67,34Z" },
  { id: "bicep-l", label: "Biceps Brachii", group: "arms", color: "#00F0FF", view: "front", layer: "superficial",
    d: "M26,46 Q23,48 22,54 Q22,60 24,64 Q26,66 28,64 Q30,60 30,54 Q30,48 26,46Z" },
  { id: "bicep-r", label: "Biceps Brachii", group: "arms", color: "#00F0FF", view: "front", layer: "superficial",
    d: "M74,46 Q77,48 78,54 Q78,60 76,64 Q74,66 72,64 Q70,60 70,54 Q70,48 74,46Z" },
  { id: "forearm-l", label: "Brachioradialis", group: "arms", color: "#00D4E0", view: "front", layer: "superficial",
    d: "M24,66 Q22,68 20,74 Q19,80 20,84 Q22,82 24,78 Q26,74 26,68 Q26,66 24,66Z" },
  { id: "forearm-r", label: "Brachioradialis", group: "arms", color: "#00D4E0", view: "front", layer: "superficial",
    d: "M76,66 Q78,68 80,74 Q81,80 80,84 Q78,82 76,78 Q74,74 74,68 Q74,66 76,66Z" },
  { id: "abs", label: "Rectus Abdominis", group: "core", color: "#A855F7", view: "front", layer: "superficial",
    d: "M46,58 Q44,60 44,68 Q44,76 46,80 Q48,82 50,82 Q52,82 54,80 Q56,76 56,68 Q56,60 54,58 Q52,56 50,56 Q48,56 46,58Z" },
  { id: "oblique-l", label: "External Oblique", group: "core", color: "#D946EF", view: "front", layer: "superficial",
    d: "M36,56 Q38,58 42,60 Q44,68 44,76 Q42,78 38,76 Q34,72 34,66 Q34,60 36,56Z" },
  { id: "oblique-r", label: "External Oblique", group: "core", color: "#D946EF", view: "front", layer: "superficial",
    d: "M64,56 Q62,58 58,60 Q56,68 56,76 Q58,78 62,76 Q66,72 66,66 Q66,60 64,56Z" },
  { id: "quad-l", label: "Quadriceps", group: "legs", color: "#00FF88", view: "front", layer: "superficial",
    d: "M38,82 Q36,84 34,92 Q33,100 34,108 Q36,112 40,112 Q44,110 46,104 Q46,96 46,88 Q44,84 42,82 Q40,80 38,82Z" },
  { id: "quad-r", label: "Quadriceps", group: "legs", color: "#00FF88", view: "front", layer: "superficial",
    d: "M62,82 Q64,84 66,92 Q67,100 66,108 Q64,112 60,112 Q56,110 54,104 Q54,96 54,88 Q56,84 58,82 Q60,80 62,82Z" },
  { id: "shin-l", label: "Tibialis Anterior", group: "legs", color: "#4D7CFF", view: "front", layer: "superficial",
    d: "M36,114 Q34,118 34,126 Q34,134 36,138 Q38,136 38,128 Q38,120 38,116 Q38,114 36,114Z" },
  { id: "shin-r", label: "Tibialis Anterior", group: "legs", color: "#4D7CFF", view: "front", layer: "superficial",
    d: "M64,114 Q66,118 66,126 Q66,134 64,138 Q62,136 62,128 Q62,120 62,116 Q62,114 64,114Z" },

  // FRONT VIEW - Deep
  { id: "pec-minor-l", label: "Pectoralis Minor", group: "chest", color: "#FF2255", view: "front", layer: "deep",
    d: "M42,40 Q38,42 38,48 Q40,52 44,50 Q46,46 44,42 Q42,40 42,40Z" },
  { id: "pec-minor-r", label: "Pectoralis Minor", group: "chest", color: "#FF2255", view: "front", layer: "deep",
    d: "M58,40 Q62,42 62,48 Q60,52 56,50 Q54,46 56,42 Q58,40 58,40Z" },
  { id: "serratus-l", label: "Serratus Anterior", group: "core", color: "#F97316", view: "front", layer: "deep",
    d: "M34,48 Q32,52 32,58 Q34,60 36,58 Q36,52 36,48 Q36,46 34,48Z" },
  { id: "serratus-r", label: "Serratus Anterior", group: "core", color: "#F97316", view: "front", layer: "deep",
    d: "M66,48 Q68,52 68,58 Q66,60 64,58 Q64,52 64,48 Q64,46 66,48Z" },

  // BACK VIEW - Superficial
  { id: "trap", label: "Trapezius", group: "back", color: "#FF7A28", view: "back", layer: "superficial",
    d: "M40,30 Q44,28 50,26 Q56,28 60,30 Q62,34 60,40 Q56,44 50,46 Q44,44 40,40 Q38,34 40,30Z" },
  { id: "rear-delt-l", label: "Posterior Deltoid", group: "shoulders", color: "#FF6B35", view: "back", layer: "superficial",
    d: "M33,34 Q28,32 26,36 Q25,42 28,46 Q32,44 34,40 Q36,36 33,34Z" },
  { id: "rear-delt-r", label: "Posterior Deltoid", group: "shoulders", color: "#FF6B35", view: "back", layer: "superficial",
    d: "M67,34 Q72,32 74,36 Q75,42 72,46 Q68,44 66,40 Q64,36 67,34Z" },
  { id: "lat-l", label: "Latissimus Dorsi", group: "back", color: "#3A9CFF", view: "back", layer: "superficial",
    d: "M36,42 Q34,46 34,54 Q34,62 36,68 Q40,72 44,68 Q46,62 46,54 Q46,48 44,44 Q42,42 36,42Z" },
  { id: "lat-r", label: "Latissimus Dorsi", group: "back", color: "#3A9CFF", view: "back", layer: "superficial",
    d: "M64,42 Q66,46 66,54 Q66,62 64,68 Q60,72 56,68 Q54,62 54,54 Q54,48 56,44 Q58,42 64,42Z" },
  { id: "tricep-l", label: "Triceps Brachii", group: "arms", color: "#5B8FFF", view: "back", layer: "superficial",
    d: "M26,46 Q23,48 22,54 Q22,60 24,64 Q26,66 28,64 Q30,60 30,54 Q30,48 26,46Z" },
  { id: "tricep-r", label: "Triceps Brachii", group: "arms", color: "#5B8FFF", view: "back", layer: "superficial",
    d: "M74,46 Q77,48 78,54 Q78,60 76,64 Q74,66 72,64 Q70,60 70,54 Q70,48 74,46Z" },
  { id: "glute-l", label: "Gluteus Maximus", group: "glutes", color: "#EC4899", view: "back", layer: "superficial",
    d: "M38,76 Q36,78 36,84 Q38,88 42,88 Q46,86 48,82 Q48,78 46,76 Q42,74 38,76Z" },
  { id: "glute-r", label: "Gluteus Maximus", group: "glutes", color: "#EC4899", view: "back", layer: "superficial",
    d: "M62,76 Q64,78 64,84 Q62,88 58,88 Q54,86 52,82 Q52,78 54,76 Q58,74 62,76Z" },
  { id: "hamstring-l", label: "Hamstrings", group: "legs", color: "#00E07A", view: "back", layer: "superficial",
    d: "M38,90 Q36,94 34,102 Q34,110 36,114 Q40,114 42,110 Q44,102 44,94 Q42,90 38,90Z" },
  { id: "hamstring-r", label: "Hamstrings", group: "legs", color: "#00E07A", view: "back", layer: "superficial",
    d: "M62,90 Q64,94 66,102 Q66,110 64,114 Q60,114 58,110 Q56,102 56,94 Q58,90 62,90Z" },
  { id: "calf-l", label: "Gastrocnemius", group: "legs", color: "#06B6D4", view: "back", layer: "superficial",
    d: "M36,116 Q34,120 34,128 Q36,134 38,136 Q40,134 40,128 Q40,120 38,116 Q36,116 36,116Z" },
  { id: "calf-r", label: "Gastrocnemius", group: "legs", color: "#06B6D4", view: "back", layer: "superficial",
    d: "M64,116 Q66,120 66,128 Q64,134 62,136 Q60,134 60,128 Q60,120 62,116 Q64,116 64,116Z" },

  // BACK VIEW - Deep
  { id: "rhomboid-l", label: "Rhomboids", group: "back", color: "#6366F1", view: "back", layer: "deep",
    d: "M44,36 Q42,38 42,44 Q44,48 48,46 Q48,42 48,38 Q46,36 44,36Z" },
  { id: "rhomboid-r", label: "Rhomboids", group: "back", color: "#6366F1", view: "back", layer: "deep",
    d: "M56,36 Q58,38 58,44 Q56,48 52,46 Q52,42 52,38 Q54,36 56,36Z" },
  { id: "erector-l", label: "Erector Spinae", group: "back", color: "#8B5CF6", view: "back", layer: "deep",
    d: "M46,48 Q44,52 44,62 Q46,70 48,68 Q48,60 48,52 Q48,48 46,48Z" },
  { id: "erector-r", label: "Erector Spinae", group: "back", color: "#8B5CF6", view: "back", layer: "deep",
    d: "M54,48 Q56,52 56,62 Q54,70 52,68 Q52,60 52,52 Q52,48 54,48Z" },
];

const BODY_OUTLINE_FRONT = "M50,8 Q44,8 42,12 Q40,16 42,20 Q44,24 42,26 Q38,28 34,30 Q28,30 24,34 Q22,38 22,42 Q22,48 24,56 Q24,62 22,68 Q20,76 18,84 Q18,86 20,86 Q22,84 24,78 Q26,72 28,68 Q30,72 32,78 Q34,82 36,80 Q36,84 34,92 Q32,102 32,112 Q34,116 34,126 Q34,136 36,140 Q38,142 40,140 Q40,136 38,128 Q38,120 40,114 Q42,112 44,114 Q46,116 48,116 Q50,116 50,116 Q50,116 52,116 Q54,116 56,114 Q58,112 60,114 Q62,120 62,128 Q60,136 60,140 Q62,142 64,140 Q66,136 66,126 Q66,116 68,112 Q68,102 66,92 Q64,84 64,80 Q66,82 68,78 Q70,72 72,68 Q74,72 76,78 Q78,84 80,86 Q82,86 82,84 Q80,76 78,68 Q76,62 76,56 Q78,48 78,42 Q78,38 76,34 Q72,30 66,30 Q62,28 58,26 Q56,24 58,20 Q60,16 58,12 Q56,8 50,8Z";

const BODY_OUTLINE_BACK = BODY_OUTLINE_FRONT;

export default function BodyMap({
  highlightedMuscles = [],
  onMuscleSelect,
  selectedMuscle,
  peelLevel = 0,
  compact = false,
}: BodyMapProps) {
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [localPeel, setLocalPeel] = useState(peelLevel);

  const peel = peelLevel || localPeel;
  const showDeep = peel > 50;
  const skinOpacity = Math.max(0, 1 - peel / 30);
  const superficialOpacity = peel < 80 ? 1 : Math.max(0.2, 1 - (peel - 80) / 20);

  const visibleMuscles = MUSCLE_REGIONS.filter(m => {
    if (m.view !== view) return false;
    if (m.layer === "deep" && !showDeep) return false;
    if (m.layer === "superficial" && peel > 95) return false;
    return true;
  });

  const size = compact ? 200 : 340;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* View toggle */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
        {(["front", "back"] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: view === v ? "rgba(0,240,255,0.12)" : "transparent",
              color: view === v ? "#00F0FF" : "rgba(255,255,255,0.3)",
            }}>
            {v}
          </button>
        ))}
      </div>

      {/* SVG Body */}
      <div className="relative" style={{ width: size, height: size * 1.6 }}>
        <svg viewBox="0 0 100 160" width={size} height={size * 1.6}
          style={{ filter: "drop-shadow(0 0 20px rgba(0,240,255,0.08))" }}>
          {/* Body outline / skin */}
          <path d={view === "front" ? BODY_OUTLINE_FRONT : BODY_OUTLINE_BACK}
            fill={`rgba(212,165,116,${skinOpacity * 0.15})`}
            stroke={`rgba(255,255,255,${0.08 + skinOpacity * 0.08})`}
            strokeWidth="0.4" />

          {/* Muscle regions */}
          {visibleMuscles.map(m => {
            const isHighlighted = highlightedMuscles.includes(m.group);
            const isHovered = hoveredMuscle === m.id;
            const isSelected = selectedMuscle === m.group;
            const active = isHighlighted || isHovered || isSelected;
            const opacity = m.layer === "superficial" ? superficialOpacity : 0.85;

            return (
              <path key={m.id} d={m.d}
                fill={m.color}
                fillOpacity={active ? opacity * 0.7 : opacity * 0.25}
                stroke={active ? m.color : `${m.color}60`}
                strokeWidth={active ? "0.8" : "0.3"}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  filter: active ? `drop-shadow(0 0 6px ${m.color}80)` : "none",
                }}
                onMouseEnter={() => setHoveredMuscle(m.id)}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => onMuscleSelect?.(m.group)}
              />
            );
          })}

          {/* Skeleton lines when deeply peeled */}
          {peel > 60 && (
            <g opacity={Math.min(1, (peel - 60) / 30)} stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" fill="none">
              <line x1="50" y1="26" x2="50" y2="80" />
              <line x1="50" y1="40" x2="34" y2="34" />
              <line x1="50" y1="40" x2="66" y2="34" />
              <line x1="34" y1="34" x2="22" y2="68" />
              <line x1="66" y1="34" x2="78" y2="68" />
              <line x1="50" y1="80" x2="40" y2="112" />
              <line x1="50" y1="80" x2="60" y2="112" />
              <line x1="40" y1="112" x2="38" y2="140" />
              <line x1="60" y1="112" x2="62" y2="140" />
              <ellipse cx="50" cy="14" rx="8" ry="10" stroke="rgba(255,255,255,0.1)" />
            </g>
          )}
        </svg>

        {/* Hover tooltip */}
        {hoveredMuscle && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg z-10"
            style={{ background: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-[11px] font-semibold text-center whitespace-nowrap" style={{ color: "rgba(255,255,255,0.9)" }}>
              {MUSCLE_REGIONS.find(m => m.id === hoveredMuscle)?.label}
            </p>
          </div>
        )}
      </div>

      {/* Peel slider */}
      {!compact && (
        <div className="w-full max-w-[280px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
              Anatomy Depth
            </span>
            <span className="text-[10px] font-mono" style={{ color: "#00F0FF" }}>
              {peel < 30 ? "Skin" : peel < 60 ? "Muscles" : peel < 85 ? "Deep" : "Skeleton"}
            </span>
          </div>
          <input type="range" min="0" max="100" value={localPeel}
            onChange={(e) => setLocalPeel(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, #D4A574 0%, #FF4466 30%, #A855F7 60%, rgba(255,255,255,0.2) 100%)`,
              accentColor: "#00F0FF",
            }}
          />
        </div>
      )}
    </div>
  );
}
