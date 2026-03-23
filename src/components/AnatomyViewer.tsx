"use client";

import { useState } from "react";

interface MuscleZone {
  id: string;
  label: string;
  scientificName: string;
  path: string;
  layer: "superficial" | "deep";
  side: "front" | "back";
  color: string;
}

const muscleZones: MuscleZone[] = [
  // FRONT VIEW - Superficial
  { id: "pectoralis-major", label: "Pectoralis Major", scientificName: "Pectoralis major", path: "M 85 95 Q 100 88 115 95 L 118 115 Q 105 120 100 118 Q 95 120 82 115 Z", layer: "superficial", side: "front", color: "#FF4466" },
  { id: "anterior-deltoid", label: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", path: "M 72 85 Q 68 78 72 72 Q 80 68 85 72 L 85 95 Q 78 92 72 85 Z", layer: "superficial", side: "front", color: "#FF6B35" },
  { id: "anterior-deltoid-r", label: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", path: "M 128 85 Q 132 78 128 72 Q 120 68 115 72 L 115 95 Q 122 92 128 85 Z", layer: "superficial", side: "front", color: "#FF6B35" },
  { id: "biceps-l", label: "Biceps Brachii", scientificName: "Biceps brachii", path: "M 68 95 Q 64 92 62 100 L 60 125 Q 62 128 66 128 L 70 125 Q 72 120 72 100 Z", layer: "superficial", side: "front", color: "#00F0FF" },
  { id: "biceps-r", label: "Biceps Brachii", scientificName: "Biceps brachii", path: "M 132 95 Q 136 92 138 100 L 140 125 Q 138 128 134 128 L 130 125 Q 128 120 128 100 Z", layer: "superficial", side: "front", color: "#00F0FF" },
  { id: "rectus-abdominis", label: "Rectus Abdominis", scientificName: "Rectus abdominis", path: "M 92 118 L 108 118 L 108 165 Q 105 168 100 168 Q 95 168 92 165 Z", layer: "superficial", side: "front", color: "#A855F7" },
  { id: "external-oblique", label: "External Oblique", scientificName: "Obliquus externus abdominis", path: "M 82 115 L 92 118 L 92 160 Q 85 165 80 160 L 80 120 Z", layer: "superficial", side: "front", color: "#D946EF" },
  { id: "external-oblique-r", label: "External Oblique", scientificName: "Obliquus externus abdominis", path: "M 118 115 L 108 118 L 108 160 Q 115 165 120 160 L 120 120 Z", layer: "superficial", side: "front", color: "#D946EF" },
  { id: "quadriceps-l", label: "Quadriceps", scientificName: "Quadriceps femoris", path: "M 82 170 Q 78 175 76 185 L 74 220 Q 76 225 82 228 L 90 225 Q 95 220 94 210 L 95 185 Q 95 175 92 170 Z", layer: "superficial", side: "front", color: "#00FF88" },
  { id: "quadriceps-r", label: "Quadriceps", scientificName: "Quadriceps femoris", path: "M 118 170 Q 122 175 124 185 L 126 220 Q 124 225 118 228 L 110 225 Q 105 220 106 210 L 105 185 Q 105 175 108 170 Z", layer: "superficial", side: "front", color: "#00FF88" },
  { id: "tibialis-anterior-l", label: "Tibialis Anterior", scientificName: "Tibialis anterior", path: "M 80 232 Q 78 235 77 250 L 78 275 Q 80 278 83 278 L 86 275 Q 87 260 86 245 Q 86 238 84 232 Z", layer: "superficial", side: "front", color: "#4D7CFF" },
  { id: "tibialis-anterior-r", label: "Tibialis Anterior", scientificName: "Tibialis anterior", path: "M 120 232 Q 122 235 123 250 L 122 275 Q 120 278 117 278 L 114 275 Q 113 260 114 245 Q 114 238 116 232 Z", layer: "superficial", side: "front", color: "#4D7CFF" },

  // FRONT VIEW - Deep
  { id: "pectoralis-minor", label: "Pectoralis Minor", scientificName: "Pectoralis minor", path: "M 88 97 Q 97 92 105 97 L 107 108 Q 100 112 95 110 Q 90 112 87 108 Z", layer: "deep", side: "front", color: "#FF2D92" },
  { id: "serratus-anterior", label: "Serratus Anterior", scientificName: "Serratus anterior", path: "M 78 105 L 82 100 L 85 118 L 82 130 Q 78 128 78 120 Z", layer: "deep", side: "front", color: "#F97316" },
  { id: "serratus-anterior-r", label: "Serratus Anterior", scientificName: "Serratus anterior", path: "M 122 105 L 118 100 L 115 118 L 118 130 Q 122 128 122 120 Z", layer: "deep", side: "front", color: "#F97316" },
  { id: "transversus-abdominis", label: "Transversus Abdominis", scientificName: "Transversus abdominis", path: "M 88 125 L 112 125 L 112 160 Q 105 165 100 165 Q 95 165 88 160 Z", layer: "deep", side: "front", color: "#8B5CF6" },
  { id: "iliopsoas-l", label: "Iliopsoas", scientificName: "Iliacus & Psoas major", path: "M 88 155 Q 85 160 83 170 L 85 180 Q 88 178 90 172 L 92 160 Z", layer: "deep", side: "front", color: "#EC4899" },
  { id: "iliopsoas-r", label: "Iliopsoas", scientificName: "Iliacus & Psoas major", path: "M 112 155 Q 115 160 117 170 L 115 180 Q 112 178 110 172 L 108 160 Z", layer: "deep", side: "front", color: "#EC4899" },

  // BACK VIEW - Superficial
  { id: "trapezius", label: "Trapezius", scientificName: "Trapezius", path: "M 85 65 Q 95 58 100 55 Q 105 58 115 65 L 118 85 Q 105 82 100 80 Q 95 82 82 85 Z", layer: "superficial", side: "back", color: "#FF6B35" },
  { id: "latissimus-dorsi-l", label: "Latissimus Dorsi", scientificName: "Latissimus dorsi", path: "M 75 90 Q 78 85 82 85 L 92 95 L 92 150 Q 85 155 80 152 L 75 140 Q 72 120 75 90 Z", layer: "superficial", side: "back", color: "#00F0FF" },
  { id: "latissimus-dorsi-r", label: "Latissimus Dorsi", scientificName: "Latissimus dorsi", path: "M 125 90 Q 122 85 118 85 L 108 95 L 108 150 Q 115 155 120 152 L 125 140 Q 128 120 125 90 Z", layer: "superficial", side: "back", color: "#00F0FF" },
  { id: "posterior-deltoid-l", label: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", path: "M 70 75 Q 68 80 68 88 L 72 95 Q 75 92 78 88 L 82 85 Q 78 78 72 75 Z", layer: "superficial", side: "back", color: "#FF6B35" },
  { id: "posterior-deltoid-r", label: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", path: "M 130 75 Q 132 80 132 88 L 128 95 Q 125 92 122 88 L 118 85 Q 122 78 128 75 Z", layer: "superficial", side: "back", color: "#FF6B35" },
  { id: "triceps-l", label: "Triceps Brachii", scientificName: "Triceps brachii", path: "M 65 95 Q 62 100 60 110 L 58 130 Q 60 134 64 134 L 68 130 Q 70 120 70 105 Q 70 98 68 95 Z", layer: "superficial", side: "back", color: "#4D7CFF" },
  { id: "triceps-r", label: "Triceps Brachii", scientificName: "Triceps brachii", path: "M 135 95 Q 138 100 140 110 L 142 130 Q 140 134 136 134 L 132 130 Q 130 120 130 105 Q 130 98 132 95 Z", layer: "superficial", side: "back", color: "#4D7CFF" },
  { id: "glutes-l", label: "Gluteus Maximus", scientificName: "Gluteus maximus", path: "M 80 155 Q 75 162 75 175 Q 78 185 85 185 L 95 182 Q 98 175 98 168 Q 95 160 90 155 Z", layer: "superficial", side: "back", color: "#FF4466" },
  { id: "glutes-r", label: "Gluteus Maximus", scientificName: "Gluteus maximus", path: "M 120 155 Q 125 162 125 175 Q 122 185 115 185 L 105 182 Q 102 175 102 168 Q 105 160 110 155 Z", layer: "superficial", side: "back", color: "#FF4466" },
  { id: "hamstrings-l", label: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", path: "M 78 188 Q 75 195 74 210 L 76 240 Q 80 245 85 242 L 92 238 Q 95 228 94 215 Q 94 200 92 190 Z", layer: "superficial", side: "back", color: "#00FF88" },
  { id: "hamstrings-r", label: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", path: "M 122 188 Q 125 195 126 210 L 124 240 Q 120 245 115 242 L 108 238 Q 105 228 106 215 Q 106 200 108 190 Z", layer: "superficial", side: "back", color: "#00FF88" },
  { id: "gastrocnemius-l", label: "Gastrocnemius", scientificName: "Gastrocnemius", path: "M 76 245 Q 74 252 75 265 L 78 280 Q 82 282 85 280 L 88 265 Q 88 252 86 245 Z", layer: "superficial", side: "back", color: "#06B6D4" },
  { id: "gastrocnemius-r", label: "Gastrocnemius", scientificName: "Gastrocnemius", path: "M 124 245 Q 126 252 125 265 L 122 280 Q 118 282 115 280 L 112 265 Q 112 252 114 245 Z", layer: "superficial", side: "back", color: "#06B6D4" },

  // BACK VIEW - Deep
  { id: "rhomboids", label: "Rhomboids", scientificName: "Rhomboid major & minor", path: "M 90 72 Q 95 68 100 67 Q 105 68 110 72 L 110 95 Q 105 92 100 90 Q 95 92 90 95 Z", layer: "deep", side: "back", color: "#A855F7" },
  { id: "erector-spinae", label: "Erector Spinae", scientificName: "Erector spinae (iliocostalis, longissimus, spinalis)", path: "M 95 80 L 105 80 L 106 155 Q 103 158 100 158 Q 97 158 94 155 Z", layer: "deep", side: "back", color: "#F59E0B" },
  { id: "gluteus-medius-l", label: "Gluteus Medius", scientificName: "Gluteus medius", path: "M 76 148 Q 72 155 72 165 Q 75 172 80 172 L 88 168 Q 90 162 90 155 Q 87 150 82 148 Z", layer: "deep", side: "back", color: "#EC4899" },
  { id: "gluteus-medius-r", label: "Gluteus Medius", scientificName: "Gluteus medius", path: "M 124 148 Q 128 155 128 165 Q 125 172 120 172 L 112 168 Q 110 162 110 155 Q 113 150 118 148 Z", layer: "deep", side: "back", color: "#EC4899" },
  { id: "soleus-l", label: "Soleus", scientificName: "Soleus", path: "M 78 268 Q 77 275 78 285 Q 80 288 83 285 L 85 275 Q 85 270 84 268 Z", layer: "deep", side: "back", color: "#06B6D4" },
  { id: "soleus-r", label: "Soleus", scientificName: "Soleus", path: "M 122 268 Q 123 275 122 285 Q 120 288 117 285 L 115 275 Q 115 270 116 268 Z", layer: "deep", side: "back", color: "#06B6D4" },
];

interface AnatomyViewerProps {
  highlightedMuscles?: string[];
  onMuscleSelect?: (muscle: MuscleZone) => void;
  compact?: boolean;
}

export default function AnatomyViewer({ highlightedMuscles = [], onMuscleSelect, compact = false }: AnatomyViewerProps) {
  const [view, setView] = useState<"front" | "back">("front");
  const [activeLayer, setActiveLayer] = useState<"all" | "superficial" | "deep">("all");
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleZone | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleZone | null>(null);

  const visibleMuscles = muscleZones.filter(m => {
    if (m.side !== view) return false;
    if (activeLayer !== "all" && m.layer !== activeLayer) return false;
    return true;
  });

  const isHighlighted = (m: MuscleZone) => {
    if (highlightedMuscles.length === 0) return false;
    return highlightedMuscles.some(h =>
      m.label.toLowerCase().includes(h.toLowerCase()) ||
      m.scientificName.toLowerCase().includes(h.toLowerCase()) ||
      m.id.toLowerCase().includes(h.toLowerCase())
    );
  };

  function handleMuscleClick(m: MuscleZone) {
    setSelectedMuscle(selectedMuscle?.id === m.id ? null : m);
    onMuscleSelect?.(m);
  }

  const size = compact ? { width: 200, height: 300 } : { width: 200, height: 300 };

  return (
    <div className={compact ? "" : "flex flex-col items-center"}>
      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["front", "back"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] transition-all"
              style={{
                background: view === v ? "rgba(0,240,255,0.1)" : "transparent",
                color: view === v ? "#00F0FF" : "rgba(255,255,255,0.3)",
              }}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["all", "superficial", "deep"] as const).map(l => (
            <button key={l} onClick={() => setActiveLayer(l)}
              className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.05em] transition-all"
              style={{
                background: activeLayer === l ? "rgba(168,85,247,0.1)" : "transparent",
                color: activeLayer === l ? "#A855F7" : "rgba(255,255,255,0.25)",
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Body */}
      <div className="relative">
        <svg viewBox="40 40 120 260" width={size.width} height={size.height}
          className="drop-shadow-lg">
          {/* Body outline */}
          <g opacity="0.15" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none">
            {/* Head */}
            <circle cx="100" cy="50" r="10" />
            {/* Neck */}
            <line x1="96" y1="60" x2="96" y2="65" />
            <line x1="104" y1="60" x2="104" y2="65" />
            {/* Torso */}
            <path d="M 72 68 Q 68 72 66 85 L 62 95 L 58 130 Q 62 140 65 145 Q 70 150 75 155 L 78 170 Q 80 175 82 170 L 95 168 L 100 170 L 105 168 L 118 170 Q 120 175 122 170 L 125 155 Q 130 150 135 145 Q 138 140 142 130 L 138 95 L 134 85 Q 132 72 128 68 Q 115 62 100 60 Q 85 62 72 68 Z" />
            {/* Legs */}
            <path d="M 82 170 Q 78 185 76 200 L 74 230 Q 76 248 78 260 L 80 290 Q 82 295 85 295 L 88 290 Q 92 270 94 250 Q 96 230 95 210 L 95 185 Q 95 175 92 170" />
            <path d="M 118 170 Q 122 185 124 200 L 126 230 Q 124 248 122 260 L 120 290 Q 118 295 115 295 L 112 290 Q 108 270 106 250 Q 104 230 105 210 L 105 185 Q 105 175 108 170" />
          </g>

          {/* Muscles */}
          {visibleMuscles.map(m => {
            const highlighted = isHighlighted(m);
            const hovered = hoveredMuscle?.id === m.id;
            const selected = selectedMuscle?.id === m.id;
            const active = highlighted || hovered || selected;
            return (
              <path
                key={m.id}
                d={m.path}
                fill={m.color}
                fillOpacity={active ? 0.7 : (highlightedMuscles.length > 0 && !highlighted ? 0.08 : 0.3)}
                stroke={active ? m.color : "transparent"}
                strokeWidth={active ? 1 : 0}
                className="anatomy-muscle cursor-pointer transition-all duration-200"
                style={{
                  filter: active ? `drop-shadow(0 0 8px ${m.color}80)` : "none",
                }}
                onMouseEnter={() => setHoveredMuscle(m)}
                onMouseLeave={() => setHoveredMuscle(null)}
                onClick={() => handleMuscleClick(m)}
              />
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredMuscle && (
          <div className="absolute top-2 left-full ml-4 z-20 pointer-events-none"
            style={{
              background: "rgba(10,10,20,0.95)",
              border: `1px solid ${hoveredMuscle.color}40`,
              borderRadius: "12px",
              padding: "10px 14px",
              minWidth: "180px",
              boxShadow: `0 0 20px ${hoveredMuscle.color}15`,
            }}>
            <p className="text-[12px] font-bold" style={{ color: hoveredMuscle.color }}>
              {hoveredMuscle.label}
            </p>
            <p className="text-[10px] italic mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              {hoveredMuscle.scientificName}
            </p>
            <p className="text-[10px] mt-1 uppercase tracking-[0.05em]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {hoveredMuscle.layer} layer
            </p>
          </div>
        )}
      </div>

      {/* Selected muscle detail */}
      {selectedMuscle && !compact && (
        <div className="mt-4 w-full max-w-xs p-4 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${selectedMuscle.color}30`,
          }}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[13px] font-bold" style={{ color: selectedMuscle.color }}>
              {selectedMuscle.label}
            </h4>
            <button onClick={() => setSelectedMuscle(null)}
              className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Close
            </button>
          </div>
          <p className="text-[11px] italic mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            {selectedMuscle.scientificName}
          </p>
          <div className="flex gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: `${selectedMuscle.color}15`,
                color: selectedMuscle.color,
                border: `1px solid ${selectedMuscle.color}25`,
              }}>
              {selectedMuscle.layer}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
              {selectedMuscle.side} view
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
