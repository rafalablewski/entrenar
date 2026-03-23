"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Pose3D, JointName, JOINT_CONNECTIONS } from "./poses";

interface SkeletonRigProps {
  pose: Pose3D;
  opacity?: number;
}

const BONE_COLOR = new THREE.Color("#E8E0D4");
const JOINT_COLOR = new THREE.Color("#D4CFC8");
const GLOW_COLOR = new THREE.Color("#00F0FF");

/** Bone thickness by connection */
const BONE_THICKNESS: Partial<Record<string, number>> = {
  "head-neck": 0.015,
  "neck-spine": 0.022,
  "neck-shoulderL": 0.018, "neck-shoulderR": 0.018,
  "shoulderL-elbowL": 0.016, "shoulderR-elbowR": 0.016,
  "elbowL-handL": 0.012, "elbowR-handR": 0.012,
  "spine-hipL": 0.02, "spine-hipR": 0.02,
  "hipL-hipR": 0.018,
  "hipL-kneeL": 0.018, "hipR-kneeR": 0.018,
  "kneeL-footL": 0.015, "kneeR-footR": 0.015,
};

/** Joint size overrides */
const JOINT_SIZE: Partial<Record<JointName, number>> = {
  head: 0.065, neck: 0.02, spine: 0.025,
  shoulderL: 0.022, shoulderR: 0.022,
  elbowL: 0.018, elbowR: 0.018,
  handL: 0.014, handR: 0.014,
  hipL: 0.024, hipR: 0.024,
  kneeL: 0.02, kneeR: 0.02,
  footL: 0.016, footR: 0.016,
};

function Bone({ from, to, thickness }: { from: THREE.Vector3; to: THREE.Vector3; thickness: number }) {
  const ref = useRef<THREE.Mesh>(null);

  const { position, quaternion, length } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );
    return { position: mid, quaternion: q, length: len };
  }, [from, to]);

  return (
    <mesh ref={ref} position={position} quaternion={quaternion}>
      <capsuleGeometry args={[thickness, length - thickness * 2, 6, 12]} />
      <meshStandardMaterial
        color={BONE_COLOR}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function Joint({ position, size }: { position: THREE.Vector3; size: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={JOINT_COLOR}
        roughness={0.3}
        metalness={0.15}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function SkullMesh({ position }: { position: THREE.Vector3 }) {
  return (
    <group position={position}>
      {/* Cranium */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color={BONE_COLOR} roughness={0.35} metalness={0.1} transparent opacity={0.85} />
      </mesh>
      {/* Jaw */}
      <mesh position={[0, -0.04, 0.02]}>
        <boxGeometry args={[0.05, 0.025, 0.04]} />
        <meshStandardMaterial color={BONE_COLOR} roughness={0.4} metalness={0.1} transparent opacity={0.75} />
      </mesh>
      {/* Eye sockets glow */}
      <mesh position={[-0.02, 0.01, 0.055]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color={GLOW_COLOR} emissive={GLOW_COLOR} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.02, 0.01, 0.055]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color={GLOW_COLOR} emissive={GLOW_COLOR} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function RibCage({ pose }: { pose: Pose3D }) {
  const ribRef = useRef<THREE.Group>(null);
  const neckV = new THREE.Vector3(...pose.neck);
  const spineV = new THREE.Vector3(...pose.spine);

  useFrame(() => {
    if (!ribRef.current) return;
    const dir = new THREE.Vector3().subVectors(spineV, neckV).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
    ribRef.current.quaternion.copy(q);
    const mid = new THREE.Vector3().addVectors(neckV, spineV).multiplyScalar(0.5);
    ribRef.current.position.copy(mid);
  });

  const ribs = useMemo(() => {
    const r: React.JSX.Element[] = [];
    for (let i = 0; i < 6; i++) {
      const y = -0.12 + i * 0.04;
      const width = 0.08 + Math.sin((i / 5) * Math.PI) * 0.06;
      r.push(
        <mesh key={i} position={[0, y, 0.02]} rotation={[0.3, 0, 0]}>
          <torusGeometry args={[width, 0.005, 6, 16, Math.PI]} />
          <meshStandardMaterial color={BONE_COLOR} roughness={0.4} transparent opacity={0.5} />
        </mesh>
      );
    }
    return r;
  }, []);

  return <group ref={ribRef}>{ribs}</group>;
}

export default function SkeletonRig({ pose, opacity = 1 }: SkeletonRigProps) {
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
      {/* Bones */}
      {JOINT_CONNECTIONS.map(([a, b]) => {
        const key = `${a}-${b}`;
        const thickness = BONE_THICKNESS[key] || 0.015;
        return <Bone key={key} from={vectors[a]} to={vectors[b]} thickness={thickness} />;
      })}

      {/* Joints (except head - replaced by skull) */}
      {(Object.keys(vectors) as JointName[])
        .filter(k => k !== "head")
        .map(k => (
          <Joint key={k} position={vectors[k]} size={JOINT_SIZE[k] || 0.015} />
        ))}

      {/* Skull */}
      <SkullMesh position={vectors.head} />

      {/* Rib cage */}
      <RibCage pose={pose} />

      {/* Spine discs */}
      {[0.25, 0.5, 0.75].map(t => {
        const p = new THREE.Vector3().lerpVectors(vectors.neck, vectors.spine, t);
        return (
          <mesh key={t} position={p}>
            <cylinderGeometry args={[0.025, 0.025, 0.008, 8]} />
            <meshStandardMaterial color={BONE_COLOR} roughness={0.4} transparent opacity={0.5} />
          </mesh>
        );
      })}

      {/* Pelvis */}
      <mesh position={new THREE.Vector3().addVectors(vectors.hipL, vectors.hipR).multiplyScalar(0.5)}>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color={BONE_COLOR} roughness={0.35} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
