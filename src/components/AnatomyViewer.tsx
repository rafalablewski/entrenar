"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ═══════════════════════════════════════════
// MUSCLE DATA - 3D positions and geometry
// ═══════════════════════════════════════════
interface Muscle3D {
  id: string;
  name: string;
  scientificName: string;
  layer: "superficial" | "deep";
  side: "front" | "back" | "both";
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  shape: "box" | "sphere" | "capsule" | "cylinder";
}

const muscles3D: Muscle3D[] = [
  // === FRONT SUPERFICIAL ===
  // Pectorals
  { id: "pec-major-l", name: "Pectoralis Major", scientificName: "Pectoralis major – pars sternocostalis", layer: "superficial", side: "front", color: "#FF4466", position: [-0.22, 0.95, 0.18], scale: [0.32, 0.22, 0.1], shape: "box" },
  { id: "pec-major-r", name: "Pectoralis Major", scientificName: "Pectoralis major – pars sternocostalis", layer: "superficial", side: "front", color: "#FF4466", position: [0.22, 0.95, 0.18], scale: [0.32, 0.22, 0.1], shape: "box" },
  // Anterior Deltoids
  { id: "ant-delt-l", name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", layer: "superficial", side: "front", color: "#FF6B35", position: [-0.48, 1.08, 0.08], scale: [0.14, 0.16, 0.14], shape: "sphere" },
  { id: "ant-delt-r", name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", layer: "superficial", side: "front", color: "#FF6B35", position: [0.48, 1.08, 0.08], scale: [0.14, 0.16, 0.14], shape: "sphere" },
  // Biceps
  { id: "bicep-l", name: "Biceps Brachii", scientificName: "Biceps brachii", layer: "superficial", side: "front", color: "#00F0FF", position: [-0.55, 0.72, 0.06], scale: [0.08, 0.22, 0.09], shape: "capsule" },
  { id: "bicep-r", name: "Biceps Brachii", scientificName: "Biceps brachii", layer: "superficial", side: "front", color: "#00F0FF", position: [0.55, 0.72, 0.06], scale: [0.08, 0.22, 0.09], shape: "capsule" },
  // Rectus Abdominis
  { id: "rectus-abs", name: "Rectus Abdominis", scientificName: "Rectus abdominis", layer: "superficial", side: "front", color: "#A855F7", position: [0, 0.58, 0.15], scale: [0.18, 0.38, 0.06], shape: "box" },
  // Obliques
  { id: "oblique-l", name: "External Oblique", scientificName: "Obliquus externus abdominis", layer: "superficial", side: "front", color: "#D946EF", position: [-0.26, 0.55, 0.12], scale: [0.12, 0.32, 0.06], rotation: [0, 0, 0.15], shape: "box" },
  { id: "oblique-r", name: "External Oblique", scientificName: "Obliquus externus abdominis", layer: "superficial", side: "front", color: "#D946EF", position: [0.26, 0.55, 0.12], scale: [0.12, 0.32, 0.06], rotation: [0, 0, -0.15], shape: "box" },
  // Quadriceps
  { id: "quad-l", name: "Quadriceps", scientificName: "Quadriceps femoris", layer: "superficial", side: "front", color: "#00FF88", position: [-0.18, -0.1, 0.1], scale: [0.14, 0.42, 0.14], shape: "capsule" },
  { id: "quad-r", name: "Quadriceps", scientificName: "Quadriceps femoris", layer: "superficial", side: "front", color: "#00FF88", position: [0.18, -0.1, 0.1], scale: [0.14, 0.42, 0.14], shape: "capsule" },
  // Tibialis Anterior
  { id: "tib-ant-l", name: "Tibialis Anterior", scientificName: "Tibialis anterior", layer: "superficial", side: "front", color: "#4D7CFF", position: [-0.16, -0.72, 0.08], scale: [0.06, 0.28, 0.06], shape: "capsule" },
  { id: "tib-ant-r", name: "Tibialis Anterior", scientificName: "Tibialis anterior", layer: "superficial", side: "front", color: "#4D7CFF", position: [0.16, -0.72, 0.08], scale: [0.06, 0.28, 0.06], shape: "capsule" },

  // === FRONT DEEP ===
  { id: "pec-minor", name: "Pectoralis Minor", scientificName: "Pectoralis minor", layer: "deep", side: "front", color: "#FF2D92", position: [0, 0.96, 0.1], scale: [0.22, 0.14, 0.06], shape: "box" },
  { id: "serratus-l", name: "Serratus Anterior", scientificName: "Serratus anterior", layer: "deep", side: "front", color: "#F97316", position: [-0.34, 0.78, 0.08], scale: [0.08, 0.2, 0.1], shape: "box" },
  { id: "serratus-r", name: "Serratus Anterior", scientificName: "Serratus anterior", layer: "deep", side: "front", color: "#F97316", position: [0.34, 0.78, 0.08], scale: [0.08, 0.2, 0.1], shape: "box" },
  { id: "transversus", name: "Transversus Abdominis", scientificName: "Transversus abdominis", layer: "deep", side: "front", color: "#8B5CF6", position: [0, 0.55, 0.08], scale: [0.28, 0.32, 0.04], shape: "box" },
  { id: "iliopsoas-l", name: "Iliopsoas", scientificName: "Iliacus & Psoas major", layer: "deep", side: "front", color: "#EC4899", position: [-0.14, 0.22, 0.04], scale: [0.07, 0.18, 0.08], shape: "capsule" },
  { id: "iliopsoas-r", name: "Iliopsoas", scientificName: "Iliacus & Psoas major", layer: "deep", side: "front", color: "#EC4899", position: [0.14, 0.22, 0.04], scale: [0.07, 0.18, 0.08], shape: "capsule" },

  // === BACK SUPERFICIAL ===
  { id: "trapezius", name: "Trapezius", scientificName: "Trapezius", layer: "superficial", side: "back", color: "#FF6B35", position: [0, 1.15, -0.14], scale: [0.36, 0.22, 0.06], shape: "box" },
  { id: "lat-l", name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", layer: "superficial", side: "back", color: "#00F0FF", position: [-0.24, 0.72, -0.15], scale: [0.22, 0.38, 0.06], rotation: [0, 0, 0.1], shape: "box" },
  { id: "lat-r", name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", layer: "superficial", side: "back", color: "#00F0FF", position: [0.24, 0.72, -0.15], scale: [0.22, 0.38, 0.06], rotation: [0, 0, -0.1], shape: "box" },
  { id: "post-delt-l", name: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", layer: "superficial", side: "back", color: "#FF6B35", position: [-0.48, 1.06, -0.1], scale: [0.12, 0.14, 0.12], shape: "sphere" },
  { id: "post-delt-r", name: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", layer: "superficial", side: "back", color: "#FF6B35", position: [0.48, 1.06, -0.1], scale: [0.12, 0.14, 0.12], shape: "sphere" },
  { id: "tricep-l", name: "Triceps Brachii", scientificName: "Triceps brachii", layer: "superficial", side: "back", color: "#4D7CFF", position: [-0.56, 0.72, -0.06], scale: [0.09, 0.24, 0.1], shape: "capsule" },
  { id: "tricep-r", name: "Triceps Brachii", scientificName: "Triceps brachii", layer: "superficial", side: "back", color: "#4D7CFF", position: [0.56, 0.72, -0.06], scale: [0.09, 0.24, 0.1], shape: "capsule" },
  { id: "glute-l", name: "Gluteus Maximus", scientificName: "Gluteus maximus", layer: "superficial", side: "back", color: "#FF4466", position: [-0.16, 0.12, -0.16], scale: [0.16, 0.18, 0.12], shape: "sphere" },
  { id: "glute-r", name: "Gluteus Maximus", scientificName: "Gluteus maximus", layer: "superficial", side: "back", color: "#FF4466", position: [0.16, 0.12, -0.16], scale: [0.16, 0.18, 0.12], shape: "sphere" },
  { id: "hamstring-l", name: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", layer: "superficial", side: "back", color: "#00FF88", position: [-0.17, -0.22, -0.1], scale: [0.12, 0.38, 0.12], shape: "capsule" },
  { id: "hamstring-r", name: "Hamstrings", scientificName: "Biceps femoris, Semimembranosus, Semitendinosus", layer: "superficial", side: "back", color: "#00FF88", position: [0.17, -0.22, -0.1], scale: [0.12, 0.38, 0.12], shape: "capsule" },
  { id: "gastroc-l", name: "Gastrocnemius", scientificName: "Gastrocnemius", layer: "superficial", side: "back", color: "#06B6D4", position: [-0.15, -0.68, -0.08], scale: [0.07, 0.22, 0.08], shape: "capsule" },
  { id: "gastroc-r", name: "Gastrocnemius", scientificName: "Gastrocnemius", layer: "superficial", side: "back", color: "#06B6D4", position: [0.15, -0.68, -0.08], scale: [0.07, 0.22, 0.08], shape: "capsule" },

  // === BACK DEEP ===
  { id: "rhomboids", name: "Rhomboids", scientificName: "Rhomboid major & minor", layer: "deep", side: "back", color: "#A855F7", position: [0, 1.02, -0.1], scale: [0.18, 0.2, 0.04], shape: "box" },
  { id: "erector-spinae", name: "Erector Spinae", scientificName: "Erector spinae", layer: "deep", side: "back", color: "#F59E0B", position: [0, 0.65, -0.12], scale: [0.1, 0.55, 0.05], shape: "capsule" },
  { id: "glute-med-l", name: "Gluteus Medius", scientificName: "Gluteus medius", layer: "deep", side: "back", color: "#EC4899", position: [-0.22, 0.2, -0.1], scale: [0.12, 0.12, 0.08], shape: "sphere" },
  { id: "glute-med-r", name: "Gluteus Medius", scientificName: "Gluteus medius", layer: "deep", side: "back", color: "#EC4899", position: [0.22, 0.2, -0.1], scale: [0.12, 0.12, 0.08], shape: "sphere" },
  { id: "soleus-l", name: "Soleus", scientificName: "Soleus", layer: "deep", side: "back", color: "#06B6D4", position: [-0.14, -0.78, -0.04], scale: [0.05, 0.18, 0.05], shape: "capsule" },
  { id: "soleus-r", name: "Soleus", scientificName: "Soleus", layer: "deep", side: "back", color: "#06B6D4", position: [0.14, -0.78, -0.04], scale: [0.05, 0.18, 0.05], shape: "capsule" },
];

// ═══════════════════════════════════════════
// 3D MUSCLE MESH COMPONENT
// ═══════════════════════════════════════════
function MuscleMesh({
  muscle,
  isHighlighted,
  isHovered,
  isSelected,
  isDimmed,
  onHover,
  onUnhover,
  onClick,
}: {
  muscle: Muscle3D;
  isHighlighted: boolean;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const active = isHighlighted || isHovered || isSelected;
  const color = new THREE.Color(muscle.color);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetOpacity = isDimmed ? 0.08 : active ? 0.85 : 0.35;
    const targetEmissive = active ? 0.4 : 0;
    mat.opacity += (targetOpacity - mat.opacity) * delta * 6;
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * delta * 6;

    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetGlow = active ? 0.3 : 0;
      glowMat.opacity += (targetGlow - glowMat.opacity) * delta * 6;
    }

    // Subtle pulse when selected
    if (isSelected && meshRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.03;
      meshRef.current.scale.set(
        muscle.scale[0] * pulse,
        muscle.scale[1] * pulse,
        muscle.scale[2] * pulse
      );
    }
  });

  const geometry = useMemo(() => {
    switch (muscle.shape) {
      case "sphere":
        return new THREE.SphereGeometry(0.5, 16, 16);
      case "capsule":
        return new THREE.CapsuleGeometry(0.35, 0.6, 8, 16);
      case "cylinder":
        return new THREE.CylinderGeometry(0.4, 0.5, 1, 12);
      default:
        return new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    }
  }, [muscle.shape]);

  return (
    <group
      position={muscle.position}
      rotation={muscle.rotation || [0, 0, 0]}
    >
      {/* Glow mesh (slightly larger) */}
      <mesh
        ref={glowRef}
        scale={[muscle.scale[0] * 1.3, muscle.scale[1] * 1.3, muscle.scale[2] * 1.3]}
        geometry={geometry}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Main muscle mesh */}
      <mesh
        ref={meshRef}
        scale={muscle.scale}
        geometry={geometry}
        onPointerEnter={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(); document.body.style.cursor = "pointer"; }}
        onPointerLeave={() => { onUnhover(); document.body.style.cursor = "auto"; }}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.35}
          roughness={0.3}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════
// SKELETON / BODY WIREFRAME
// ═══════════════════════════════════════════
function BodyWireframe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Very subtle rotation drift
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a1a2e",
    transparent: true,
    opacity: 0.15,
    roughness: 0.8,
    metalness: 0.2,
    wireframe: false,
    side: THREE.DoubleSide,
  }), []);

  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.04,
    wireframe: true,
  }), []);

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.52, 0]} material={bodyMaterial}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>
      <mesh position={[0, 1.52, 0]} material={wireMaterial}>
        <sphereGeometry args={[0.125, 12, 12]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.35, 0]} material={bodyMaterial}>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.85, 0]} material={bodyMaterial}>
        <boxGeometry args={[0.55, 0.7, 0.28]} />
      </mesh>
      <mesh position={[0, 0.85, 0]} material={wireMaterial}>
        <boxGeometry args={[0.56, 0.71, 0.29]} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.38, 0]} material={bodyMaterial}>
        <boxGeometry args={[0.48, 0.25, 0.24]} />
      </mesh>

      {/* Upper arms */}
      <mesh position={[-0.52, 0.88, 0]} rotation={[0, 0, 0.2]} material={bodyMaterial}>
        <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
      </mesh>
      <mesh position={[0.52, 0.88, 0]} rotation={[0, 0, -0.2]} material={bodyMaterial}>
        <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
      </mesh>

      {/* Forearms */}
      <mesh position={[-0.58, 0.52, 0.02]} material={bodyMaterial}>
        <capsuleGeometry args={[0.04, 0.26, 6, 12]} />
      </mesh>
      <mesh position={[0.58, 0.52, 0.02]} material={bodyMaterial}>
        <capsuleGeometry args={[0.04, 0.26, 6, 12]} />
      </mesh>

      {/* Upper legs */}
      <mesh position={[-0.16, -0.05, 0]} material={bodyMaterial}>
        <capsuleGeometry args={[0.09, 0.38, 8, 12]} />
      </mesh>
      <mesh position={[0.16, -0.05, 0]} material={bodyMaterial}>
        <capsuleGeometry args={[0.09, 0.38, 8, 12]} />
      </mesh>
      <mesh position={[-0.16, -0.05, 0]} material={wireMaterial}>
        <capsuleGeometry args={[0.095, 0.39, 6, 10]} />
      </mesh>
      <mesh position={[0.16, -0.05, 0]} material={wireMaterial}>
        <capsuleGeometry args={[0.095, 0.39, 6, 10]} />
      </mesh>

      {/* Lower legs */}
      <mesh position={[-0.15, -0.62, 0]} material={bodyMaterial}>
        <capsuleGeometry args={[0.06, 0.36, 8, 12]} />
      </mesh>
      <mesh position={[0.15, -0.62, 0]} material={bodyMaterial}>
        <capsuleGeometry args={[0.06, 0.36, 8, 12]} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.15, -0.92, 0.04]} material={bodyMaterial}>
        <boxGeometry args={[0.08, 0.04, 0.14]} />
      </mesh>
      <mesh position={[0.15, -0.92, 0.04]} material={bodyMaterial}>
        <boxGeometry args={[0.08, 0.04, 0.14]} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════
// FLOATING GRID FLOOR
// ═══════════════════════════════════════════
function GridFloor() {
  return (
    <group position={[0, -0.98, 0]}>
      <gridHelper args={[4, 20, "#ffffff08", "#ffffff04"]} />
      {/* Circular platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.6, 0.62, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.6, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════
// PARTICLE FIELD
// ═══════════════════════════════════════════
function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.015;
      points.current.rotation.x += delta * 0.008;
    }
  });

  const bufferGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  return (
    <points ref={points} geometry={bufferGeom}>
      <pointsMaterial
        size={0.008}
        color="#00F0FF"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ═══════════════════════════════════════════
// MAIN SCENE COMPONENT
// ═══════════════════════════════════════════
function AnatomyScene({
  activeLayer,
  highlightedMuscles,
  hoveredMuscle,
  selectedMuscle,
  onHover,
  onUnhover,
  onSelect,
}: {
  activeLayer: "all" | "superficial" | "deep";
  highlightedMuscles: string[];
  hoveredMuscle: string | null;
  selectedMuscle: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onSelect: (id: string) => void;
}) {
  const visibleMuscles = muscles3D.filter(m => {
    if (activeLayer !== "all" && m.layer !== activeLayer) return false;
    return true;
  });

  const isHighlighted = useCallback((m: Muscle3D) => {
    if (highlightedMuscles.length === 0) return false;
    return highlightedMuscles.some(h =>
      m.name.toLowerCase().includes(h.toLowerCase()) ||
      m.scientificName.toLowerCase().includes(h.toLowerCase()) ||
      m.id.toLowerCase().includes(h.toLowerCase())
    );
  }, [highlightedMuscles]);

  const hasHighlights = highlightedMuscles.length > 0;

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 3]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[-2, 3, -2]} intensity={0.2} color="#00F0FF" />
      <pointLight position={[0, 2, 2]} intensity={0.3} color="#A855F7" distance={5} />

      <ParticleField />
      <GridFloor />
      <BodyWireframe />

      {visibleMuscles.map(m => (
        <MuscleMesh
          key={m.id}
          muscle={m}
          isHighlighted={isHighlighted(m)}
          isHovered={hoveredMuscle === m.id}
          isSelected={selectedMuscle === m.id}
          isDimmed={hasHighlights && !isHighlighted(m)}
          onHover={() => onHover(m.id)}
          onUnhover={onUnhover}
          onClick={() => onSelect(m.id)}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        autoRotate={!hoveredMuscle && !selectedMuscle}
        autoRotateSpeed={0.5}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

// ═══════════════════════════════════════════
// EXPORTED COMPONENT
// ═══════════════════════════════════════════
interface AnatomyViewerProps {
  highlightedMuscles?: string[];
  onMuscleSelect?: (muscle: Muscle3D) => void;
  compact?: boolean;
}

export default function AnatomyViewer({ highlightedMuscles = [], onMuscleSelect, compact = false }: AnatomyViewerProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "superficial" | "deep">("all");
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const hoveredData = muscles3D.find(m => m.id === hoveredMuscle);
  const selectedData = muscles3D.find(m => m.id === selectedMuscle);

  function handleSelect(id: string) {
    const newSelected = selectedMuscle === id ? null : id;
    setSelectedMuscle(newSelected);
    if (newSelected) {
      const muscle = muscles3D.find(m => m.id === newSelected);
      if (muscle) onMuscleSelect?.(muscle);
    }
  }

  const height = compact ? 350 : 500;

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex items-center gap-3 mb-3">
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
        <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.15)" }}>
          Drag to rotate &middot; Scroll to zoom
        </span>
      </div>

      {/* 3D Canvas */}
      <div className="relative rounded-2xl overflow-hidden" style={{
        height: `${height}px`,
        background: "radial-gradient(ellipse at center, rgba(15,15,30,1) 0%, rgba(5,5,10,1) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Canvas
          camera={{ position: [0, 0.3, 2.5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
        >
          <AnatomyScene
            activeLayer={activeLayer}
            highlightedMuscles={highlightedMuscles}
            hoveredMuscle={hoveredMuscle}
            selectedMuscle={selectedMuscle}
            onHover={setHoveredMuscle}
            onUnhover={() => setHoveredMuscle(null)}
            onSelect={handleSelect}
          />
        </Canvas>

        {/* Hover tooltip overlay */}
        {hoveredData && (
          <div className="absolute top-4 left-4 pointer-events-none z-10"
            style={{
              background: "rgba(5,5,15,0.9)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${hoveredData.color}40`,
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: `0 0 20px ${hoveredData.color}15`,
            }}>
            <p className="text-[12px] font-bold" style={{ color: hoveredData.color }}>
              {hoveredData.name}
            </p>
            <p className="text-[10px] italic mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              {hoveredData.scientificName}
            </p>
            <div className="flex gap-2 mt-1.5">
              <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: `${hoveredData.color}15`, color: hoveredData.color }}>
                {hoveredData.layer}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>
                {hoveredData.side}
              </span>
            </div>
          </div>
        )}

        {/* Corner label */}
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.1)" }}>
            3D ANATOMY
          </span>
        </div>
      </div>

      {/* Selected muscle detail */}
      {selectedData && !compact && (
        <div className="mt-3 p-4 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${selectedData.color}08, transparent)`,
            border: `1px solid ${selectedData.color}20`,
          }}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[13px] font-bold" style={{ color: selectedData.color }}>
              {selectedData.name}
            </h4>
            <button onClick={() => setSelectedMuscle(null)}
              className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Deselect
            </button>
          </div>
          <p className="text-[11px] italic" style={{ color: "rgba(255,255,255,0.4)" }}>
            {selectedData.scientificName}
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `${selectedData.color}12`, color: selectedData.color, border: `1px solid ${selectedData.color}20` }}>
              {selectedData.layer}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export type { Muscle3D };
