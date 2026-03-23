"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SkeletonRig from "./SkeletonRig";
import MuscleSystem from "./MuscleSystem";
import {
  Pose3D, DEFAULT_POSE, EXERCISE_POSES,
  interpolatePoses,
} from "./poses";

interface Anatomy3DViewerProps {
  movementPattern?: string;
  highlightedMuscles?: string[];
  compact?: boolean;
}

/** Animated scene content (runs inside Canvas) */
function Scene({ movementPattern, highlightedMuscles = [] }: {
  movementPattern?: string;
  highlightedMuscles: string[];
}) {
  const [pose, setPose] = useState<Pose3D>(DEFAULT_POSE);
  const phaseRef = useRef(0);
  const exercisePose = movementPattern ? EXERCISE_POSES[movementPattern] : null;
  const activeMuscles = exercisePose?.activeMuscles || highlightedMuscles;

  useFrame((_, delta) => {
    if (!exercisePose) return;
    phaseRef.current += delta * 0.8;
    const t = (Math.sin(phaseRef.current * Math.PI) + 1) / 2;
    setPose(interpolatePoses(exercisePose.start, exercisePose.end, t));
  });

  useEffect(() => {
    if (!exercisePose) {
      setPose(DEFAULT_POSE);
      phaseRef.current = 0;
    }
  }, [exercisePose]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color="#E8E0FF" />
      <directionalLight position={[-2, 3, -3]} intensity={0.3} color="#00F0FF" />
      <pointLight position={[0, 1.2, 1]} intensity={0.4} color="#00F0FF" distance={3} />

      {/* Floor grid */}
      <gridHelper args={[2, 20, "#1a1a2e", "#0f0f18"]} position={[0, 0, 0]} />

      {/* Ground plane glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial
          color="#00F0FF"
          emissive="#00F0FF"
          emissiveIntensity={0.15}
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Skeleton */}
      <SkeletonRig pose={pose} />

      {/* Muscles */}
      <MuscleSystem pose={pose} activeMuscles={activeMuscles} />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        minDistance={0.8}
        maxDistance={3.5}
        target={[0, 1.0, 0]}
        autoRotate={!exercisePose}
        autoRotateSpeed={1.2}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.1}
      />
    </>
  );
}

/** Muscle legend overlay */
function MuscleLegend({ activeMuscles }: { activeMuscles: string[] }) {
  const groups = [
    { id: "chest", label: "Chest", color: "#FF4466" },
    { id: "shoulders", label: "Shoulders", color: "#FF6B35" },
    { id: "arms", label: "Arms", color: "#00F0FF" },
    { id: "back", label: "Back", color: "#3A9CFF" },
    { id: "core", label: "Core", color: "#A855F7" },
    { id: "glutes", label: "Glutes", color: "#EC4899" },
    { id: "legs", label: "Legs", color: "#00FF88" },
  ];

  return (
    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
      {groups.map(g => {
        const active = activeMuscles.includes(g.id);
        return (
          <div key={g.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider"
            style={{
              background: active ? `${g.color}20` : "rgba(255,255,255,0.03)",
              color: active ? g.color : "rgba(255,255,255,0.2)",
              border: `1px solid ${active ? `${g.color}40` : "rgba(255,255,255,0.04)"}`,
              transition: "all 0.3s ease",
            }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{
              backgroundColor: active ? g.color : "rgba(255,255,255,0.15)",
              boxShadow: active ? `0 0 6px ${g.color}` : "none",
            }} />
            {g.label}
          </div>
        );
      })}
    </div>
  );
}

export default function Anatomy3DViewer({
  movementPattern,
  highlightedMuscles = [],
  compact = false,
}: Anatomy3DViewerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const exercisePose = movementPattern ? EXERCISE_POSES[movementPattern] : null;
  const activeMuscles = exercisePose?.activeMuscles || highlightedMuscles;

  const height = compact ? 320 : 500;

  const handleToggle = useCallback(() => setIsPlaying(p => !p), []);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{
      height,
      background: "linear-gradient(180deg, rgba(5,5,12,0.95) 0%, rgba(10,10,20,0.98) 100%)",
      border: "1px solid rgba(0,240,255,0.08)",
    }}>
      <Canvas
        camera={{ position: [0, 1.1, 2.2], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {isPlaying && (
          <Scene
            movementPattern={movementPattern}
            highlightedMuscles={highlightedMuscles}
          />
        )}
        {!isPlaying && (
          <Scene
            highlightedMuscles={highlightedMuscles}
          />
        )}
      </Canvas>

      {/* Play/Pause */}
      {exercisePose && (
        <button onClick={handleToggle}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {isPlaying ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(255,255,255,0.7)">
              <rect x="1" y="1" width="3" height="8" /><rect x="6" y="1" width="3" height="8" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(255,255,255,0.7)">
              <polygon points="2,1 9,5 2,9" />
            </svg>
          )}
        </button>
      )}

      {/* Exercise label */}
      {movementPattern && (
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg z-10"
          style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,240,255,0.15)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#00F0FF" }}>
            {movementPattern.replace(/-/g, " ")}
          </p>
        </div>
      )}

      {/* Muscle legend */}
      <MuscleLegend activeMuscles={activeMuscles} />

      {/* 3D badge */}
      <div className="absolute top-3 right-14 px-2 py-1 rounded-md z-10"
        style={{ background: "rgba(0,240,255,0.08)", border: "1px solid rgba(0,240,255,0.15)" }}>
        <span className="text-[8px] font-bold tracking-wider" style={{ color: "#00F0FF" }}>3D</span>
      </div>
    </div>
  );
}
