"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Pose3D, JointName } from "./poses";

interface MuscleSystemProps {
  pose: Pose3D;
  activeMuscles: string[];
  opacity?: number;
}

interface MuscleDefinition {
  id: string;
  name: string;
  group: string;
  jointA: JointName;
  jointB: JointName;
  offset: [number, number, number];
  thickness: number;
  color: string;
  lengthScale?: number;
}

const MUSCLES: MuscleDefinition[] = [
  // Chest
  { id: "pec-l", name: "Pectoralis Major L", group: "chest", jointA: "shoulderL", jointB: "spine", offset: [-0.06, 0.08, 0.1], thickness: 0.032, color: "#FF4466" },
  { id: "pec-r", name: "Pectoralis Major R", group: "chest", jointA: "shoulderR", jointB: "spine", offset: [0.06, 0.08, 0.1], thickness: 0.032, color: "#FF4466" },

  // Shoulders
  { id: "delt-ant-l", name: "Anterior Deltoid L", group: "shoulders", jointA: "shoulderL", jointB: "elbowL", offset: [-0.02, 0.04, 0.04], thickness: 0.024, color: "#FF6B35", lengthScale: 0.4 },
  { id: "delt-ant-r", name: "Anterior Deltoid R", group: "shoulders", jointA: "shoulderR", jointB: "elbowR", offset: [0.02, 0.04, 0.04], thickness: 0.024, color: "#FF6B35", lengthScale: 0.4 },
  { id: "delt-lat-l", name: "Lateral Deltoid L", group: "shoulders", jointA: "shoulderL", jointB: "elbowL", offset: [-0.05, 0.04, 0], thickness: 0.022, color: "#FF8C42", lengthScale: 0.4 },
  { id: "delt-lat-r", name: "Lateral Deltoid R", group: "shoulders", jointA: "shoulderR", jointB: "elbowR", offset: [0.05, 0.04, 0], thickness: 0.022, color: "#FF8C42", lengthScale: 0.4 },
  { id: "delt-post-l", name: "Posterior Deltoid L", group: "shoulders", jointA: "shoulderL", jointB: "elbowL", offset: [-0.03, 0.04, -0.04], thickness: 0.02, color: "#E85D2C", lengthScale: 0.4 },
  { id: "delt-post-r", name: "Posterior Deltoid R", group: "shoulders", jointA: "shoulderR", jointB: "elbowR", offset: [0.03, 0.04, -0.04], thickness: 0.02, color: "#E85D2C", lengthScale: 0.4 },

  // Arms - Biceps
  { id: "bicep-l", name: "Biceps L", group: "arms", jointA: "shoulderL", jointB: "elbowL", offset: [0, 0, 0.035], thickness: 0.022, color: "#00F0FF" },
  { id: "bicep-r", name: "Biceps R", group: "arms", jointA: "shoulderR", jointB: "elbowR", offset: [0, 0, 0.035], thickness: 0.022, color: "#00F0FF" },
  // Arms - Triceps
  { id: "tricep-l", name: "Triceps L", group: "arms", jointA: "shoulderL", jointB: "elbowL", offset: [0, 0, -0.03], thickness: 0.02, color: "#5B8FFF" },
  { id: "tricep-r", name: "Triceps R", group: "arms", jointA: "shoulderR", jointB: "elbowR", offset: [0, 0, -0.03], thickness: 0.02, color: "#5B8FFF" },
  // Forearms
  { id: "forearm-l", name: "Forearm L", group: "arms", jointA: "elbowL", jointB: "handL", offset: [0, 0, 0.02], thickness: 0.016, color: "#00D4E0" },
  { id: "forearm-r", name: "Forearm R", group: "arms", jointA: "elbowR", jointB: "handR", offset: [0, 0, 0.02], thickness: 0.016, color: "#00D4E0" },

  // Back
  { id: "trap", name: "Trapezius", group: "back", jointA: "neck", jointB: "spine", offset: [0, 0.04, -0.06], thickness: 0.05, color: "#FF7A28", lengthScale: 0.6 },
  { id: "lat-l", name: "Latissimus Dorsi L", group: "back", jointA: "shoulderL", jointB: "hipL", offset: [-0.06, 0, -0.06], thickness: 0.035, color: "#3A9CFF" },
  { id: "lat-r", name: "Latissimus Dorsi R", group: "back", jointA: "shoulderR", jointB: "hipR", offset: [0.06, 0, -0.06], thickness: 0.035, color: "#3A9CFF" },
  { id: "erector-l", name: "Erector Spinae L", group: "back", jointA: "neck", jointB: "hipL", offset: [-0.03, 0, -0.04], thickness: 0.018, color: "#8B5CF6" },
  { id: "erector-r", name: "Erector Spinae R", group: "back", jointA: "neck", jointB: "hipR", offset: [0.03, 0, -0.04], thickness: 0.018, color: "#8B5CF6" },

  // Core
  { id: "rectus-abs", name: "Rectus Abdominis", group: "core", jointA: "spine", jointB: "hipL", offset: [0, 0, 0.08], thickness: 0.035, color: "#A855F7" },
  { id: "oblique-l", name: "Oblique L", group: "core", jointA: "spine", jointB: "hipL", offset: [-0.06, 0, 0.05], thickness: 0.025, color: "#D946EF" },
  { id: "oblique-r", name: "Oblique R", group: "core", jointA: "spine", jointB: "hipR", offset: [0.06, 0, 0.05], thickness: 0.025, color: "#D946EF" },

  // Glutes
  { id: "glute-l", name: "Gluteus Maximus L", group: "glutes", jointA: "hipL", jointB: "kneeL", offset: [-0.03, 0.04, -0.06], thickness: 0.04, color: "#EC4899", lengthScale: 0.35 },
  { id: "glute-r", name: "Gluteus Maximus R", group: "glutes", jointA: "hipR", jointB: "kneeR", offset: [0.03, 0.04, -0.06], thickness: 0.04, color: "#EC4899", lengthScale: 0.35 },

  // Quads
  { id: "quad-rf-l", name: "Rectus Femoris L", group: "legs", jointA: "hipL", jointB: "kneeL", offset: [0, 0, 0.04], thickness: 0.024, color: "#00FF88" },
  { id: "quad-rf-r", name: "Rectus Femoris R", group: "legs", jointA: "hipR", jointB: "kneeR", offset: [0, 0, 0.04], thickness: 0.024, color: "#00FF88" },
  { id: "quad-vl-l", name: "Vastus Lateralis L", group: "legs", jointA: "hipL", jointB: "kneeL", offset: [-0.03, 0, 0.02], thickness: 0.022, color: "#00E57A" },
  { id: "quad-vl-r", name: "Vastus Lateralis R", group: "legs", jointA: "hipR", jointB: "kneeR", offset: [0.03, 0, 0.02], thickness: 0.022, color: "#00E57A" },
  { id: "quad-vm-l", name: "Vastus Medialis L", group: "legs", jointA: "hipL", jointB: "kneeL", offset: [0.02, -0.04, 0.03], thickness: 0.018, color: "#00CC6E" },
  { id: "quad-vm-r", name: "Vastus Medialis R", group: "legs", jointA: "hipR", jointB: "kneeR", offset: [-0.02, -0.04, 0.03], thickness: 0.018, color: "#00CC6E" },

  // Hamstrings
  { id: "ham-bf-l", name: "Biceps Femoris L", group: "legs", jointA: "hipL", jointB: "kneeL", offset: [-0.02, 0, -0.04], thickness: 0.02, color: "#00E07A" },
  { id: "ham-bf-r", name: "Biceps Femoris R", group: "legs", jointA: "hipR", jointB: "kneeR", offset: [0.02, 0, -0.04], thickness: 0.02, color: "#00E07A" },
  { id: "ham-st-l", name: "Semitendinosus L", group: "legs", jointA: "hipL", jointB: "kneeL", offset: [0.01, 0, -0.04], thickness: 0.018, color: "#00CC6A" },
  { id: "ham-st-r", name: "Semitendinosus R", group: "legs", jointA: "hipR", jointB: "kneeR", offset: [-0.01, 0, -0.04], thickness: 0.018, color: "#00CC6A" },

  // Calves
  { id: "gastroc-l", name: "Gastrocnemius L", group: "legs", jointA: "kneeL", jointB: "footL", offset: [0, 0.02, -0.03], thickness: 0.02, color: "#06B6D4", lengthScale: 0.6 },
  { id: "gastroc-r", name: "Gastrocnemius R", group: "legs", jointA: "kneeR", jointB: "footR", offset: [0, 0.02, -0.03], thickness: 0.02, color: "#06B6D4", lengthScale: 0.6 },
  { id: "tib-l", name: "Tibialis Anterior L", group: "legs", jointA: "kneeL", jointB: "footL", offset: [0, 0, 0.025], thickness: 0.015, color: "#4D7CFF", lengthScale: 0.7 },
  { id: "tib-r", name: "Tibialis Anterior R", group: "legs", jointA: "kneeR", jointB: "footR", offset: [0, 0, 0.025], thickness: 0.015, color: "#4D7CFF", lengthScale: 0.7 },
];

function MuscleShape({ muscle, fromV, toV, isActive }: {
  muscle: MuscleDefinition; fromV: THREE.Vector3; toV: THREE.Vector3; isActive: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const baseColor = useMemo(() => new THREE.Color(muscle.color), [muscle.color]);
  const activeColor = useMemo(() => new THREE.Color(muscle.color).multiplyScalar(1.8), [muscle.color]);

  useFrame((_, delta) => {
    if (!ref.current || !matRef.current) return;
    const scale = muscle.lengthScale || 1;
    const a = new THREE.Vector3().lerpVectors(fromV, toV, (1 - scale) * 0.5);
    const b = new THREE.Vector3().lerpVectors(fromV, toV, 1 - (1 - scale) * 0.5);
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    mid.add(new THREE.Vector3(...muscle.offset));
    ref.current.position.lerp(mid, Math.min(delta * 12, 1));
    const dir = new THREE.Vector3().subVectors(b, a).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    ref.current.quaternion.slerp(q, Math.min(delta * 12, 1));
    const len = a.distanceTo(b);
    ref.current.scale.y = len / (muscle.thickness * 2 + 0.15);

    const targetColor = isActive ? activeColor : baseColor;
    matRef.current.color.lerp(targetColor, Math.min(delta * 6, 1));
    matRef.current.emissiveIntensity += ((isActive ? 0.6 : 0) - matRef.current.emissiveIntensity) * Math.min(delta * 6, 1);
    matRef.current.opacity += ((isActive ? 0.9 : 0.45) - matRef.current.opacity) * Math.min(delta * 6, 1);
  });

  return (
    <mesh ref={ref}>
      <capsuleGeometry args={[muscle.thickness, 0.15, 8, 16]} />
      <meshStandardMaterial
        ref={matRef}
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={0}
        roughness={0.55}
        metalness={0.1}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function MuscleSystem({ pose, activeMuscles, opacity = 1 }: MuscleSystemProps) {
  const vectors = useMemo(() => {
    const v: Record<JointName, THREE.Vector3> = {} as Record<JointName, THREE.Vector3>;
    for (const key of Object.keys(pose) as JointName[]) {
      v[key] = new THREE.Vector3(...pose[key]);
    }
    return v;
  }, [pose]);

  if (opacity < 0.01) return null;

  return (
    <group>
      {MUSCLES.map(m => (
        <MuscleShape
          key={m.id}
          muscle={m}
          fromV={vectors[m.jointA]}
          toV={vectors[m.jointB]}
          isActive={activeMuscles.includes(m.group)}
        />
      ))}
    </group>
  );
}

export { MUSCLES };
