"use client";

// ═══════════════════════════════════════════════════════════════════
// ANATOMY LAYER COMPONENTS
// SkinEnvelope, FasciaLayer, SkeletonLayer (Three.js / R3F)
// PeelSlider (React UI)
// ═══════════════════════════════════════════════════════════════════

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ═══════════════════════════════════════════
// 1. SKIN ENVELOPE
// ═══════════════════════════════════════════
// Semi-transparent body-shaped mesh representing skin.
// opacity prop (0–1) is controlled by the parent based on peel slider.

export function SkinEnvelope({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#D4A574",
        transparent: true,
        opacity: 0.72,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  // Drive opacity each frame so it animates smoothly
  useFrame((_, delta) => {
    const target = opacity * 0.72;
    skinMaterial.opacity += (target - skinMaterial.opacity) * Math.min(delta * 8, 1);
    // Hide the whole group when fully transparent to save draw calls
    if (groupRef.current) {
      groupRef.current.visible = skinMaterial.opacity > 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.52, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.13, 20, 20]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.35, 0]} material={skinMaterial}>
        <cylinderGeometry args={[0.065, 0.085, 0.13, 10]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.85, 0]} material={skinMaterial}>
        <boxGeometry args={[0.58, 0.72, 0.30, 2, 2, 2]} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.38, 0]} material={skinMaterial}>
        <boxGeometry args={[0.50, 0.26, 0.25, 2, 2, 2]} />
      </mesh>

      {/* Upper arms */}
      <mesh position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.2]} material={skinMaterial}>
        <capsuleGeometry args={[0.07, 0.30, 6, 14]} />
      </mesh>
      <mesh position={[0.52, 0.88, 0]} rotation={[0, 0, -0.2]} material={skinMaterial}>
        <capsuleGeometry args={[0.07, 0.30, 6, 14]} />
      </mesh>

      {/* Forearms */}
      <mesh position={[-0.58, 0.52, 0.02]} material={skinMaterial}>
        <capsuleGeometry args={[0.05, 0.28, 6, 14]} />
      </mesh>
      <mesh position={[0.58, 0.52, 0.02]} material={skinMaterial}>
        <capsuleGeometry args={[0.05, 0.28, 6, 14]} />
      </mesh>

      {/* Upper legs */}
      <mesh position={[-0.16, -0.05, 0]} material={skinMaterial}>
        <capsuleGeometry args={[0.10, 0.40, 8, 14]} />
      </mesh>
      <mesh position={[0.16, -0.05, 0]} material={skinMaterial}>
        <capsuleGeometry args={[0.10, 0.40, 8, 14]} />
      </mesh>

      {/* Lower legs */}
      <mesh position={[-0.15, -0.62, 0]} material={skinMaterial}>
        <capsuleGeometry args={[0.068, 0.38, 8, 14]} />
      </mesh>
      <mesh position={[0.15, -0.62, 0]} material={skinMaterial}>
        <capsuleGeometry args={[0.068, 0.38, 8, 14]} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.15, -0.92, 0.04]} material={skinMaterial}>
        <boxGeometry args={[0.09, 0.05, 0.15]} />
      </mesh>
      <mesh position={[0.15, -0.92, 0.04]} material={skinMaterial}>
        <boxGeometry args={[0.09, 0.05, 0.15]} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════
// 2. FASCIA LAYER
// ═══════════════════════════════════════════
// Slightly smaller (~0.97×) body envelope representing connective tissue.
// Combines a solid semi-transparent mesh and a wireframe overlay.

export function FasciaLayer({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#E8D5C4",
        transparent: true,
        opacity: 0.45,
        roughness: 0.5,
        metalness: 0.02,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#F0E8DF",
        transparent: true,
        opacity: 0.08,
        wireframe: true,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    const solidTarget = opacity * 0.45;
    const wireTarget = opacity * 0.08;
    solidMaterial.opacity += (solidTarget - solidMaterial.opacity) * Math.min(delta * 8, 1);
    wireMaterial.opacity += (wireTarget - wireMaterial.opacity) * Math.min(delta * 8, 1);
    if (groupRef.current) {
      groupRef.current.visible = solidMaterial.opacity > 0.005;
    }
  });

  // All segments uniformly scaled 0.97× vs SkinEnvelope
  const S = 0.97;

  return (
    <group ref={groupRef} scale={[S, S, S]}>
      {/* Head — solid + wire */}
      <mesh position={[0, 1.52, 0]} material={solidMaterial}>
        <sphereGeometry args={[0.13, 20, 20]} />
      </mesh>
      <mesh position={[0, 1.52, 0]} material={wireMaterial}>
        <sphereGeometry args={[0.131, 14, 14]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.35, 0]} material={solidMaterial}>
        <cylinderGeometry args={[0.065, 0.085, 0.13, 10]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.85, 0]} material={solidMaterial}>
        <boxGeometry args={[0.58, 0.72, 0.30, 3, 3, 3]} />
      </mesh>
      <mesh position={[0, 0.85, 0]} material={wireMaterial}>
        <boxGeometry args={[0.585, 0.725, 0.305, 4, 6, 3]} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.38, 0]} material={solidMaterial}>
        <boxGeometry args={[0.50, 0.26, 0.25]} />
      </mesh>

      {/* Upper arms */}
      <mesh position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.2]} material={solidMaterial}>
        <capsuleGeometry args={[0.07, 0.30, 6, 14]} />
      </mesh>
      <mesh position={[0.52, 0.88, 0]} rotation={[0, 0, -0.2]} material={solidMaterial}>
        <capsuleGeometry args={[0.07, 0.30, 6, 14]} />
      </mesh>
      <mesh position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.2]} material={wireMaterial}>
        <capsuleGeometry args={[0.071, 0.30, 4, 10]} />
      </mesh>
      <mesh position={[0.52, 0.88, 0]} rotation={[0, 0, -0.2]} material={wireMaterial}>
        <capsuleGeometry args={[0.071, 0.30, 4, 10]} />
      </mesh>

      {/* Forearms */}
      <mesh position={[-0.58, 0.52, 0.02]} material={solidMaterial}>
        <capsuleGeometry args={[0.05, 0.28, 6, 14]} />
      </mesh>
      <mesh position={[0.58, 0.52, 0.02]} material={solidMaterial}>
        <capsuleGeometry args={[0.05, 0.28, 6, 14]} />
      </mesh>

      {/* Upper legs */}
      <mesh position={[-0.16, -0.05, 0]} material={solidMaterial}>
        <capsuleGeometry args={[0.10, 0.40, 8, 14]} />
      </mesh>
      <mesh position={[0.16, -0.05, 0]} material={solidMaterial}>
        <capsuleGeometry args={[0.10, 0.40, 8, 14]} />
      </mesh>
      <mesh position={[-0.16, -0.05, 0]} material={wireMaterial}>
        <capsuleGeometry args={[0.101, 0.40, 5, 10]} />
      </mesh>
      <mesh position={[0.16, -0.05, 0]} material={wireMaterial}>
        <capsuleGeometry args={[0.101, 0.40, 5, 10]} />
      </mesh>

      {/* Lower legs */}
      <mesh position={[-0.15, -0.62, 0]} material={solidMaterial}>
        <capsuleGeometry args={[0.068, 0.38, 8, 14]} />
      </mesh>
      <mesh position={[0.15, -0.62, 0]} material={solidMaterial}>
        <capsuleGeometry args={[0.068, 0.38, 8, 14]} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.15, -0.92, 0.04]} material={solidMaterial}>
        <boxGeometry args={[0.09, 0.05, 0.15]} />
      </mesh>
      <mesh position={[0.15, -0.92, 0.04]} material={solidMaterial}>
        <boxGeometry args={[0.09, 0.05, 0.15]} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════
// 3. SKELETON LAYER
// ═══════════════════════════════════════════
// Fades IN as peel increases (opacity goes 0 → 1 over 40–80% peel range).
// Includes skull, spine, ribcage, pelvis, scapulae, humeri, femurs, tibias.

export function SkeletonLayer({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const boneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#F5E6D3",
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0,
        emissive: new THREE.Color("#F5E6D3"),
        emissiveIntensity: 0.05,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    const target = opacity * 0.92;
    boneMaterial.opacity += (target - boneMaterial.opacity) * Math.min(delta * 8, 1);
    if (groupRef.current) {
      groupRef.current.visible = boneMaterial.opacity > 0.005;
    }
  });

  // Spine vertebrae: 6 cylinders stacked from y=0.40 to y=1.20 at z=-0.04
  const spineSegments = useMemo(() => {
    const count = 6;
    const yStart = 0.40;
    const yEnd = 1.20;
    const step = (yEnd - yStart) / (count - 1);
    return Array.from({ length: count }, (_, i) => yStart + i * step);
  }, []);

  // Ribs: 7 pairs from y=0.68 to y=1.05
  const ribPairs = useMemo(() => {
    const count = 7;
    const yStart = 0.68;
    const yEnd = 1.05;
    const step = (yEnd - yStart) / (count - 1);
    return Array.from({ length: count }, (_, i) => {
      const y = yStart + i * step;
      // Ribs narrow toward the top (clavicle region)
      const spread = THREE.MathUtils.lerp(0.22, 0.10, i / (count - 1));
      const length = THREE.MathUtils.lerp(0.22, 0.14, i / (count - 1));
      return { y, spread, length };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* ── Skull ── */}
      <mesh position={[0, 1.52, 0]} material={boneMaterial}>
        <sphereGeometry args={[0.10, 18, 18]} />
      </mesh>
      {/* Mandible hint */}
      <mesh position={[0, 1.42, 0.05]} material={boneMaterial}>
        <boxGeometry args={[0.08, 0.03, 0.06]} />
      </mesh>

      {/* ── Spine ── */}
      {spineSegments.map((y, i) => (
        <mesh key={`spine-${i}`} position={[0, y, -0.04]} material={boneMaterial}>
          <cylinderGeometry args={[0.022, 0.022, 0.085, 8]} />
        </mesh>
      ))}

      {/* ── Ribcage ── */}
      {ribPairs.map(({ y, spread, length }, i) => (
        <group key={`rib-${i}`}>
          {/* Left rib */}
          <mesh
            position={[-spread / 2 - length / 4, y, 0.02]}
            rotation={[0, 0, -Math.PI / 2 + 0.3]}
            material={boneMaterial}
          >
            <cylinderGeometry args={[0.008, 0.008, length, 6]} />
          </mesh>
          {/* Right rib */}
          <mesh
            position={[spread / 2 + length / 4, y, 0.02]}
            rotation={[0, 0, Math.PI / 2 - 0.3]}
            material={boneMaterial}
          >
            <cylinderGeometry args={[0.008, 0.008, length, 6]} />
          </mesh>
          {/* Sternum segment */}
          <mesh position={[0, y, 0.14]} material={boneMaterial}>
            <boxGeometry args={[0.03, 0.04, 0.02]} />
          </mesh>
        </group>
      ))}

      {/* ── Clavicles ── */}
      <mesh position={[-0.18, 1.10, 0.05]} rotation={[0, 0.2, 0.1]} material={boneMaterial}>
        <cylinderGeometry args={[0.012, 0.012, 0.26, 6]} />
      </mesh>
      <mesh position={[0.18, 1.10, 0.05]} rotation={[0, -0.2, -0.1]} material={boneMaterial}>
        <cylinderGeometry args={[0.012, 0.012, 0.26, 6]} />
      </mesh>

      {/* ── Scapulae ── */}
      <mesh position={[-0.32, 1.02, -0.10]} rotation={[0.15, 0.1, 0.05]} material={boneMaterial}>
        <boxGeometry args={[0.14, 0.14, 0.018]} />
      </mesh>
      <mesh position={[0.32, 1.02, -0.10]} rotation={[0.15, -0.1, -0.05]} material={boneMaterial}>
        <boxGeometry args={[0.14, 0.14, 0.018]} />
      </mesh>

      {/* ── Humeri (upper arms) ── */}
      <mesh position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.2]} material={boneMaterial}>
        <cylinderGeometry args={[0.022, 0.018, 0.32, 8]} />
      </mesh>
      <mesh position={[0.52, 0.88, 0]} rotation={[0, 0, -0.2]} material={boneMaterial}>
        <cylinderGeometry args={[0.022, 0.018, 0.32, 8]} />
      </mesh>

      {/* ── Radius/Ulna hint (forearms — two thin cylinders per side) ── */}
      <mesh position={[-0.60, 0.52, 0.01]} material={boneMaterial}>
        <cylinderGeometry args={[0.013, 0.011, 0.28, 6]} />
      </mesh>
      <mesh position={[-0.56, 0.52, 0.03]} material={boneMaterial}>
        <cylinderGeometry args={[0.010, 0.008, 0.28, 6]} />
      </mesh>
      <mesh position={[0.60, 0.52, 0.01]} material={boneMaterial}>
        <cylinderGeometry args={[0.013, 0.011, 0.28, 6]} />
      </mesh>
      <mesh position={[0.56, 0.52, 0.03]} material={boneMaterial}>
        <cylinderGeometry args={[0.010, 0.008, 0.28, 6]} />
      </mesh>

      {/* ── Pelvis ── */}
      <mesh position={[0, 0.32, 0]} material={boneMaterial}>
        <boxGeometry args={[0.38, 0.18, 0.22]} />
      </mesh>
      {/* Iliac wings */}
      <mesh position={[-0.22, 0.36, -0.02]} rotation={[0.1, 0, 0.2]} material={boneMaterial}>
        <boxGeometry args={[0.12, 0.10, 0.05]} />
      </mesh>
      <mesh position={[0.22, 0.36, -0.02]} rotation={[0.1, 0, -0.2]} material={boneMaterial}>
        <boxGeometry args={[0.12, 0.10, 0.05]} />
      </mesh>

      {/* ── Femurs (upper legs) ── */}
      <mesh position={[-0.16, -0.06, 0]} material={boneMaterial}>
        <cylinderGeometry args={[0.026, 0.022, 0.44, 8]} />
      </mesh>
      <mesh position={[0.16, -0.06, 0]} material={boneMaterial}>
        <cylinderGeometry args={[0.026, 0.022, 0.44, 8]} />
      </mesh>

      {/* ── Patellas (kneecaps) ── */}
      <mesh position={[-0.15, -0.34, 0.07]} material={boneMaterial}>
        <sphereGeometry args={[0.025, 8, 8]} />
      </mesh>
      <mesh position={[0.15, -0.34, 0.07]} material={boneMaterial}>
        <sphereGeometry args={[0.025, 8, 8]} />
      </mesh>

      {/* ── Tibias (lower legs) ── */}
      <mesh position={[-0.14, -0.63, 0.01]} material={boneMaterial}>
        <cylinderGeometry args={[0.020, 0.016, 0.40, 8]} />
      </mesh>
      <mesh position={[0.14, -0.63, 0.01]} material={boneMaterial}>
        <cylinderGeometry args={[0.020, 0.016, 0.40, 8]} />
      </mesh>
      {/* Fibula hint */}
      <mesh position={[-0.17, -0.63, -0.01]} material={boneMaterial}>
        <cylinderGeometry args={[0.010, 0.009, 0.38, 6]} />
      </mesh>
      <mesh position={[0.17, -0.63, -0.01]} material={boneMaterial}>
        <cylinderGeometry args={[0.010, 0.009, 0.38, 6]} />
      </mesh>

      {/* ── Feet / Talus hint ── */}
      <mesh position={[-0.15, -0.90, 0.04]} material={boneMaterial}>
        <boxGeometry args={[0.06, 0.03, 0.10]} />
      </mesh>
      <mesh position={[0.15, -0.90, 0.04]} material={boneMaterial}>
        <boxGeometry args={[0.06, 0.03, 0.10]} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════
// 4. PEEL SLIDER (React UI, no Three.js)
// ═══════════════════════════════════════════
// Props match the usage in AnatomyViewer: value / onChange.

interface PeelSliderProps {
  value: number;
  onChange: (v: number) => void;
}

const LAYER_LABELS = ["Skin", "Fascia", "Superficial", "Deep", "Skeleton"] as const;

// Gradient stops for the five zones
const TRACK_GRADIENT =
  "linear-gradient(to right, #D4A574 0%, #D4A574 20%, #E8D5C4 20%, #E8D5C4 40%, #C84B5A 40%, #C84B5A 60%, #E07090 60%, #E07090 80%, #F5E6D3 80%, #F5E6D3 100%)";

export function PeelSlider({ value, onChange }: PeelSliderProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 60,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        userSelect: "none",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Peel Depth
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#A855F7",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(value)}%
        </span>
      </div>

      {/* Track + thumb */}
      <div style={{ position: "relative", width: "100%", height: 18 }}>
        {/* Gradient track background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 6,
            transform: "translateY(-50%)",
            borderRadius: 3,
            background: TRACK_GRADIENT,
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />
        {/* Filled portion highlight */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${value}%`,
            height: 6,
            transform: "translateY(-50%)",
            borderRadius: 3,
            background: TRACK_GRADIENT,
            backgroundSize: "100vw 100%",
            backgroundPosition: "left center",
            opacity: 1,
            pointerEvents: "none",
          }}
        />
        {/* Native range input (transparent, sits on top) */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            margin: 0,
            padding: 0,
          }}
        />
        {/* Custom thumb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${value}%`,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#A855F7",
            border: "2px solid rgba(255,255,255,0.8)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 8px #A855F766",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Zone tick marks + labels */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 2,
        }}
      >
        {LAYER_LABELS.map((label, i) => {
          // Tick positions at 0%, 25%, 50%, 75%, 100% — evenly spread across 5 labels
          const pct = i * 25;
          const isActive = value >= pct - 12.5 && value < pct + 12.5;
          return (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: i === 0 ? "flex-start" : i === 4 ? "flex-end" : "center",
                width: "20%",
                gap: 2,
              }}
            >
              {/* Tick */}
              <div
                style={{
                  width: 1,
                  height: 4,
                  background: isActive ? "#A855F7" : "rgba(255,255,255,0.2)",
                  alignSelf: "center",
                }}
              />
              {/* Label */}
              <span
                style={{
                  fontSize: 8,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
