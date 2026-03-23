"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SkinEnvelope, FasciaLayer, SkeletonLayer, PeelSlider } from "./AnatomyLayerComponents";

// ═══════════════════════════════════════════
// MUSCLE DATA - 3D positions and geometry
// ═══════════════════════════════════════════
interface Muscle3D {
  id: string;
  name: string;
  scientificName: string;
  layer: 3 | 4 | 5;
  side: "front" | "back" | "both";
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  shape: "box" | "sphere" | "capsule" | "cylinder";
}

const muscles3D: Muscle3D[] = [
  // ═══════════════════════════════════════════
  // LAYER 3 — SUPERFICIAL MUSCLES (38 entries)
  // ═══════════════════════════════════════════
  // Chest
  { id: "pec-major-l", name: "Pectoralis Major", scientificName: "Pectoralis major – pars sternocostalis", layer: 3, side: "front", color: "#FF4466", position: [-0.22, 0.95, 0.18], scale: [0.30, 0.21, 0.09], shape: "box" },
  { id: "pec-major-r", name: "Pectoralis Major", scientificName: "Pectoralis major – pars sternocostalis", layer: 3, side: "front", color: "#FF4466", position: [0.22, 0.95, 0.18], scale: [0.30, 0.21, 0.09], shape: "box" },
  // Shoulders
  { id: "ant-delt-l", name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", layer: 3, side: "front", color: "#FF6B35", position: [-0.47, 1.08, 0.09], scale: [0.13, 0.15, 0.13], shape: "sphere" },
  { id: "ant-delt-r", name: "Anterior Deltoid", scientificName: "Deltoideus – pars clavicularis", layer: 3, side: "front", color: "#FF6B35", position: [0.47, 1.08, 0.09], scale: [0.13, 0.15, 0.13], shape: "sphere" },
  { id: "lat-delt-l", name: "Lateral Deltoid", scientificName: "Deltoideus – pars acromialis", layer: 3, side: "front", color: "#FF8C42", position: [-0.54, 1.05, 0.00], scale: [0.13, 0.17, 0.13], shape: "sphere" },
  { id: "lat-delt-r", name: "Lateral Deltoid", scientificName: "Deltoideus – pars acromialis", layer: 3, side: "front", color: "#FF8C42", position: [0.54, 1.05, 0.00], scale: [0.13, 0.17, 0.13], shape: "sphere" },
  // Arms
  { id: "bicep-l", name: "Biceps Brachii", scientificName: "Biceps brachii", layer: 3, side: "front", color: "#00F0FF", position: [-0.55, 0.72, 0.06], scale: [0.08, 0.22, 0.09], shape: "capsule" },
  { id: "bicep-r", name: "Biceps Brachii", scientificName: "Biceps brachii", layer: 3, side: "front", color: "#00F0FF", position: [0.55, 0.72, 0.06], scale: [0.08, 0.22, 0.09], shape: "capsule" },
  { id: "brachioradialis-l", name: "Brachioradialis", scientificName: "Brachioradialis", layer: 3, side: "front", color: "#00D4E0", position: [-0.57, 0.46, 0.04], scale: [0.06, 0.20, 0.07], shape: "capsule" },
  { id: "brachioradialis-r", name: "Brachioradialis", scientificName: "Brachioradialis", layer: 3, side: "front", color: "#00D4E0", position: [0.57, 0.46, 0.04], scale: [0.06, 0.20, 0.07], shape: "capsule" },
  { id: "wrist-ext-l", name: "Wrist Extensors", scientificName: "Extensor carpi radialis longus et brevis", layer: 3, side: "front", color: "#00BCD4", position: [-0.57, 0.28, 0.02], scale: [0.05, 0.14, 0.06], shape: "capsule" },
  { id: "wrist-ext-r", name: "Wrist Extensors", scientificName: "Extensor carpi radialis longus et brevis", layer: 3, side: "front", color: "#00BCD4", position: [0.57, 0.28, 0.02], scale: [0.05, 0.14, 0.06], shape: "capsule" },
  // Core
  { id: "rectus-abs", name: "Rectus Abdominis", scientificName: "Rectus abdominis", layer: 3, side: "front", color: "#A855F7", position: [0, 0.58, 0.15], scale: [0.18, 0.38, 0.06], shape: "box" },
  { id: "ext-oblique-l", name: "External Oblique", scientificName: "Obliquus externus abdominis", layer: 3, side: "front", color: "#D946EF", position: [-0.26, 0.55, 0.12], scale: [0.12, 0.32, 0.06], rotation: [0, 0, 0.15], shape: "box" },
  { id: "ext-oblique-r", name: "External Oblique", scientificName: "Obliquus externus abdominis", layer: 3, side: "front", color: "#D946EF", position: [0.26, 0.55, 0.12], scale: [0.12, 0.32, 0.06], rotation: [0, 0, -0.15], shape: "box" },
  // Quads (individual heads)
  { id: "rectus-fem-l", name: "Rectus Femoris", scientificName: "Rectus femoris", layer: 3, side: "front", color: "#00FF88", position: [-0.17, -0.10, 0.12], scale: [0.08, 0.38, 0.09], shape: "capsule" },
  { id: "rectus-fem-r", name: "Rectus Femoris", scientificName: "Rectus femoris", layer: 3, side: "front", color: "#00FF88", position: [0.17, -0.10, 0.12], scale: [0.08, 0.38, 0.09], shape: "capsule" },
  { id: "vastus-lat-l", name: "Vastus Lateralis", scientificName: "Vastus lateralis", layer: 3, side: "front", color: "#00E57A", position: [-0.26, -0.12, 0.08], scale: [0.08, 0.40, 0.09], shape: "capsule" },
  { id: "vastus-lat-r", name: "Vastus Lateralis", scientificName: "Vastus lateralis", layer: 3, side: "front", color: "#00E57A", position: [0.26, -0.12, 0.08], scale: [0.08, 0.40, 0.09], shape: "capsule" },
  { id: "vastus-med-l", name: "Vastus Medialis", scientificName: "Vastus medialis", layer: 3, side: "front", color: "#00CC6E", position: [-0.12, -0.24, 0.10], scale: [0.08, 0.22, 0.08], shape: "sphere" },
  { id: "vastus-med-r", name: "Vastus Medialis", scientificName: "Vastus medialis", layer: 3, side: "front", color: "#00CC6E", position: [0.12, -0.24, 0.10], scale: [0.08, 0.22, 0.08], shape: "sphere" },
  // Lower leg
  { id: "tib-ant-l", name: "Tibialis Anterior", scientificName: "Tibialis anterior", layer: 3, side: "front", color: "#4D7CFF", position: [-0.16, -0.68, 0.08], scale: [0.06, 0.28, 0.06], shape: "capsule" },
  { id: "tib-ant-r", name: "Tibialis Anterior", scientificName: "Tibialis anterior", layer: 3, side: "front", color: "#4D7CFF", position: [0.16, -0.68, 0.08], scale: [0.06, 0.28, 0.06], shape: "capsule" },
  // Back superficial
  { id: "trapezius-upper", name: "Trapezius (upper)", scientificName: "Trapezius – pars descendens", layer: 3, side: "back", color: "#FF7A28", position: [0, 1.15, -0.14], scale: [0.36, 0.22, 0.06], shape: "box" },
  { id: "lat-l", name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", layer: 3, side: "back", color: "#3A9CFF", position: [-0.24, 0.72, -0.15], scale: [0.22, 0.38, 0.06], rotation: [0, 0, 0.10], shape: "box" },
  { id: "lat-r", name: "Latissimus Dorsi", scientificName: "Latissimus dorsi", layer: 3, side: "back", color: "#3A9CFF", position: [0.24, 0.72, -0.15], scale: [0.22, 0.38, 0.06], rotation: [0, 0, -0.10], shape: "box" },
  { id: "post-delt-l", name: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", layer: 3, side: "back", color: "#FF6B35", position: [-0.48, 1.06, -0.10], scale: [0.12, 0.14, 0.12], shape: "sphere" },
  { id: "post-delt-r", name: "Posterior Deltoid", scientificName: "Deltoideus – pars spinalis", layer: 3, side: "back", color: "#FF6B35", position: [0.48, 1.06, -0.10], scale: [0.12, 0.14, 0.12], shape: "sphere" },
  { id: "tricep-l", name: "Triceps Brachii", scientificName: "Triceps brachii", layer: 3, side: "back", color: "#5B8FFF", position: [-0.56, 0.72, -0.06], scale: [0.09, 0.24, 0.10], shape: "capsule" },
  { id: "tricep-r", name: "Triceps Brachii", scientificName: "Triceps brachii", layer: 3, side: "back", color: "#5B8FFF", position: [0.56, 0.72, -0.06], scale: [0.09, 0.24, 0.10], shape: "capsule" },
  { id: "glute-max-l", name: "Gluteus Maximus", scientificName: "Gluteus maximus", layer: 3, side: "back", color: "#EC4899", position: [-0.16, 0.12, -0.16], scale: [0.17, 0.19, 0.12], shape: "sphere" },
  { id: "glute-max-r", name: "Gluteus Maximus", scientificName: "Gluteus maximus", layer: 3, side: "back", color: "#EC4899", position: [0.16, 0.12, -0.16], scale: [0.17, 0.19, 0.12], shape: "sphere" },
  // Hamstrings (individual)
  { id: "biceps-fem-l", name: "Biceps Femoris", scientificName: "Biceps femoris", layer: 3, side: "back", color: "#00E07A", position: [-0.22, -0.20, -0.12], scale: [0.07, 0.38, 0.09], shape: "capsule" },
  { id: "biceps-fem-r", name: "Biceps Femoris", scientificName: "Biceps femoris", layer: 3, side: "back", color: "#00E07A", position: [0.22, -0.20, -0.12], scale: [0.07, 0.38, 0.09], shape: "capsule" },
  { id: "semitendinosus-l", name: "Semitendinosus", scientificName: "Semitendinosus", layer: 3, side: "back", color: "#00CC6A", position: [-0.13, -0.22, -0.12], scale: [0.06, 0.38, 0.08], shape: "capsule" },
  { id: "semitendinosus-r", name: "Semitendinosus", scientificName: "Semitendinosus", layer: 3, side: "back", color: "#00CC6A", position: [0.13, -0.22, -0.12], scale: [0.06, 0.38, 0.08], shape: "capsule" },
  // Calves
  { id: "gastroc-l", name: "Gastrocnemius", scientificName: "Gastrocnemius", layer: 3, side: "back", color: "#06B6D4", position: [-0.15, -0.66, -0.08], scale: [0.08, 0.24, 0.09], shape: "capsule" },
  { id: "gastroc-r", name: "Gastrocnemius", scientificName: "Gastrocnemius", layer: 3, side: "back", color: "#06B6D4", position: [0.15, -0.66, -0.08], scale: [0.08, 0.24, 0.09], shape: "capsule" },

  // ═══════════════════════════════════════════
  // LAYER 4 — INTERMEDIATE MUSCLES (30 entries)
  // ═══════════════════════════════════════════
  { id: "pec-minor-l", name: "Pectoralis Minor", scientificName: "Pectoralis minor", layer: 4, side: "front", color: "#FF2255", position: [-0.18, 0.97, 0.10], scale: [0.14, 0.16, 0.06], rotation: [0, 0, 0.20], shape: "box" },
  { id: "pec-minor-r", name: "Pectoralis Minor", scientificName: "Pectoralis minor", layer: 4, side: "front", color: "#FF2255", position: [0.18, 0.97, 0.10], scale: [0.14, 0.16, 0.06], rotation: [0, 0, -0.20], shape: "box" },
  { id: "serratus-l", name: "Serratus Anterior", scientificName: "Serratus anterior", layer: 4, side: "front", color: "#F97316", position: [-0.34, 0.78, 0.08], scale: [0.08, 0.22, 0.10], shape: "box" },
  { id: "serratus-r", name: "Serratus Anterior", scientificName: "Serratus anterior", layer: 4, side: "front", color: "#F97316", position: [0.34, 0.78, 0.08], scale: [0.08, 0.22, 0.10], shape: "box" },
  { id: "int-oblique-l", name: "Internal Oblique", scientificName: "Obliquus internus abdominis", layer: 4, side: "front", color: "#C026D3", position: [-0.22, 0.55, 0.09], scale: [0.10, 0.28, 0.05], rotation: [0, 0, -0.20], shape: "box" },
  { id: "int-oblique-r", name: "Internal Oblique", scientificName: "Obliquus internus abdominis", layer: 4, side: "front", color: "#C026D3", position: [0.22, 0.55, 0.09], scale: [0.10, 0.28, 0.05], rotation: [0, 0, 0.20], shape: "box" },
  { id: "brachialis-l", name: "Brachialis", scientificName: "Brachialis", layer: 4, side: "front", color: "#00C8D8", position: [-0.55, 0.68, 0.02], scale: [0.07, 0.18, 0.08], shape: "capsule" },
  { id: "brachialis-r", name: "Brachialis", scientificName: "Brachialis", layer: 4, side: "front", color: "#00C8D8", position: [0.55, 0.68, 0.02], scale: [0.07, 0.18, 0.08], shape: "capsule" },
  { id: "vastus-int-l", name: "Vastus Intermedius", scientificName: "Vastus intermedius", layer: 4, side: "front", color: "#00B865", position: [-0.17, -0.10, 0.04], scale: [0.08, 0.38, 0.07], shape: "capsule" },
  { id: "vastus-int-r", name: "Vastus Intermedius", scientificName: "Vastus intermedius", layer: 4, side: "front", color: "#00B865", position: [0.17, -0.10, 0.04], scale: [0.08, 0.38, 0.07], shape: "capsule" },
  { id: "add-longus-l", name: "Adductor Longus", scientificName: "Adductor longus", layer: 4, side: "front", color: "#22C55E", position: [-0.09, -0.08, 0.08], scale: [0.06, 0.32, 0.07], rotation: [0, 0, 0.10], shape: "capsule" },
  { id: "add-longus-r", name: "Adductor Longus", scientificName: "Adductor longus", layer: 4, side: "front", color: "#22C55E", position: [0.09, -0.08, 0.08], scale: [0.06, 0.32, 0.07], rotation: [0, 0, -0.10], shape: "capsule" },
  { id: "add-magnus-l", name: "Adductor Magnus", scientificName: "Adductor magnus", layer: 4, side: "front", color: "#16A34A", position: [-0.10, -0.14, 0.02], scale: [0.07, 0.42, 0.08], rotation: [0, 0, 0.05], shape: "capsule" },
  { id: "add-magnus-r", name: "Adductor Magnus", scientificName: "Adductor magnus", layer: 4, side: "front", color: "#16A34A", position: [0.10, -0.14, 0.02], scale: [0.07, 0.42, 0.08], rotation: [0, 0, -0.05], shape: "capsule" },
  { id: "peroneus-l", name: "Peroneus Longus", scientificName: "Peroneus longus", layer: 4, side: "front", color: "#0EA5E9", position: [-0.22, -0.68, 0.02], scale: [0.05, 0.28, 0.06], shape: "capsule" },
  { id: "peroneus-r", name: "Peroneus Longus", scientificName: "Peroneus longus", layer: 4, side: "front", color: "#0EA5E9", position: [0.22, -0.68, 0.02], scale: [0.05, 0.28, 0.06], shape: "capsule" },
  { id: "rhomboids-l", name: "Rhomboids", scientificName: "Rhomboideus major & minor", layer: 4, side: "back", color: "#6366F1", position: [-0.10, 1.02, -0.10], scale: [0.12, 0.20, 0.04], shape: "box" },
  { id: "rhomboids-r", name: "Rhomboids", scientificName: "Rhomboideus major & minor", layer: 4, side: "back", color: "#6366F1", position: [0.10, 1.02, -0.10], scale: [0.12, 0.20, 0.04], shape: "box" },
  { id: "teres-major-l", name: "Teres Major", scientificName: "Teres major", layer: 4, side: "back", color: "#4F46E5", position: [-0.36, 0.92, -0.12], scale: [0.08, 0.14, 0.07], rotation: [0, 0, 0.35], shape: "capsule" },
  { id: "teres-major-r", name: "Teres Major", scientificName: "Teres major", layer: 4, side: "back", color: "#4F46E5", position: [0.36, 0.92, -0.12], scale: [0.08, 0.14, 0.07], rotation: [0, 0, -0.35], shape: "capsule" },
  { id: "teres-minor-l", name: "Teres Minor", scientificName: "Teres minor", layer: 4, side: "back", color: "#818CF8", position: [-0.40, 0.99, -0.11], scale: [0.07, 0.11, 0.06], rotation: [0, 0, 0.50], shape: "capsule" },
  { id: "teres-minor-r", name: "Teres Minor", scientificName: "Teres minor", layer: 4, side: "back", color: "#818CF8", position: [0.40, 0.99, -0.11], scale: [0.07, 0.11, 0.06], rotation: [0, 0, -0.50], shape: "capsule" },
  { id: "infraspinatus-l", name: "Infraspinatus", scientificName: "Infraspinatus", layer: 4, side: "back", color: "#F97316", position: [-0.30, 1.00, -0.12], scale: [0.14, 0.13, 0.05], shape: "box" },
  { id: "infraspinatus-r", name: "Infraspinatus", scientificName: "Infraspinatus", layer: 4, side: "back", color: "#F97316", position: [0.30, 1.00, -0.12], scale: [0.14, 0.13, 0.05], shape: "box" },
  { id: "glute-med-l", name: "Gluteus Medius", scientificName: "Gluteus medius", layer: 4, side: "back", color: "#DB2777", position: [-0.24, 0.20, -0.11], scale: [0.13, 0.13, 0.08], shape: "sphere" },
  { id: "glute-med-r", name: "Gluteus Medius", scientificName: "Gluteus medius", layer: 4, side: "back", color: "#DB2777", position: [0.24, 0.20, -0.11], scale: [0.13, 0.13, 0.08], shape: "sphere" },
  { id: "semimembranosus-l", name: "Semimembranosus", scientificName: "Semimembranosus", layer: 4, side: "back", color: "#10B981", position: [-0.13, -0.22, -0.08], scale: [0.07, 0.38, 0.08], shape: "capsule" },
  { id: "semimembranosus-r", name: "Semimembranosus", scientificName: "Semimembranosus", layer: 4, side: "back", color: "#10B981", position: [0.13, -0.22, -0.08], scale: [0.07, 0.38, 0.08], shape: "capsule" },

  // ═══════════════════════════════════════════
  // LAYER 5 — DEEP MUSCLES (26 entries)
  // ═══════════════════════════════════════════
  { id: "transversus", name: "Transversus Abdominis", scientificName: "Transversus abdominis", layer: 5, side: "front", color: "#8B5CF6", position: [0, 0.55, 0.06], scale: [0.28, 0.30, 0.04], shape: "box" },
  { id: "iliopsoas-l", name: "Iliopsoas", scientificName: "Iliacus & Psoas major", layer: 5, side: "front", color: "#F472B6", position: [-0.12, 0.22, 0.04], scale: [0.06, 0.22, 0.07], shape: "capsule" },
  { id: "iliopsoas-r", name: "Iliopsoas", scientificName: "Iliacus & Psoas major", layer: 5, side: "front", color: "#F472B6", position: [0.12, 0.22, 0.04], scale: [0.06, 0.22, 0.07], shape: "capsule" },
  { id: "quad-lumb-l", name: "Quadratus Lumborum", scientificName: "Quadratus lumborum", layer: 5, side: "back", color: "#FBBF24", position: [-0.14, 0.48, -0.08], scale: [0.06, 0.22, 0.05], shape: "box" },
  { id: "quad-lumb-r", name: "Quadratus Lumborum", scientificName: "Quadratus lumborum", layer: 5, side: "back", color: "#FBBF24", position: [0.14, 0.48, -0.08], scale: [0.06, 0.22, 0.05], shape: "box" },
  { id: "subscapularis-l", name: "Subscapularis", scientificName: "Subscapularis", layer: 5, side: "front", color: "#EA580C", position: [-0.38, 1.00, 0.02], scale: [0.10, 0.14, 0.05], rotation: [0, 0, 0.30], shape: "box" },
  { id: "subscapularis-r", name: "Subscapularis", scientificName: "Subscapularis", layer: 5, side: "front", color: "#EA580C", position: [0.38, 1.00, 0.02], scale: [0.10, 0.14, 0.05], rotation: [0, 0, -0.30], shape: "box" },
  { id: "supraspinatus-l", name: "Supraspinatus", scientificName: "Supraspinatus", layer: 5, side: "back", color: "#FB923C", position: [-0.32, 1.14, -0.10], scale: [0.10, 0.06, 0.06], shape: "box" },
  { id: "supraspinatus-r", name: "Supraspinatus", scientificName: "Supraspinatus", layer: 5, side: "back", color: "#FB923C", position: [0.32, 1.14, -0.10], scale: [0.10, 0.06, 0.06], shape: "box" },
  { id: "coracobrachialis-l", name: "Coracobrachialis", scientificName: "Coracobrachialis", layer: 5, side: "front", color: "#22D3EE", position: [-0.46, 0.96, 0.04], scale: [0.05, 0.14, 0.06], shape: "capsule" },
  { id: "coracobrachialis-r", name: "Coracobrachialis", scientificName: "Coracobrachialis", layer: 5, side: "front", color: "#22D3EE", position: [0.46, 0.96, 0.04], scale: [0.05, 0.14, 0.06], shape: "capsule" },
  { id: "erector-spinae", name: "Erector Spinae", scientificName: "Erector spinae", layer: 5, side: "back", color: "#F59E0B", position: [0, 0.65, -0.10], scale: [0.12, 0.56, 0.05], shape: "capsule" },
  { id: "multifidus", name: "Multifidus", scientificName: "Multifidus", layer: 5, side: "back", color: "#D97706", position: [0, 0.55, -0.08], scale: [0.06, 0.48, 0.04], shape: "capsule" },
  { id: "glute-min-l", name: "Gluteus Minimus", scientificName: "Gluteus minimus", layer: 5, side: "back", color: "#BE185D", position: [-0.20, 0.18, -0.09], scale: [0.09, 0.11, 0.07], shape: "sphere" },
  { id: "glute-min-r", name: "Gluteus Minimus", scientificName: "Gluteus minimus", layer: 5, side: "back", color: "#BE185D", position: [0.20, 0.18, -0.09], scale: [0.09, 0.11, 0.07], shape: "sphere" },
  { id: "popliteus-l", name: "Popliteus", scientificName: "Popliteus", layer: 5, side: "back", color: "#0891B2", position: [-0.16, -0.44, -0.06], scale: [0.08, 0.06, 0.05], rotation: [0, 0, 0.10], shape: "box" },
  { id: "popliteus-r", name: "Popliteus", scientificName: "Popliteus", layer: 5, side: "back", color: "#0891B2", position: [0.16, -0.44, -0.06], scale: [0.08, 0.06, 0.05], rotation: [0, 0, -0.10], shape: "box" },
  { id: "soleus-l", name: "Soleus", scientificName: "Soleus", layer: 5, side: "back", color: "#0E7490", position: [-0.14, -0.76, -0.04], scale: [0.06, 0.20, 0.06], shape: "capsule" },
  { id: "soleus-r", name: "Soleus", scientificName: "Soleus", layer: 5, side: "back", color: "#0E7490", position: [0.14, -0.76, -0.04], scale: [0.06, 0.20, 0.06], shape: "capsule" },
  { id: "tib-post-l", name: "Tibialis Posterior", scientificName: "Tibialis posterior", layer: 5, side: "back", color: "#164E63", position: [-0.14, -0.68, -0.02], scale: [0.05, 0.24, 0.05], shape: "capsule" },
  { id: "tib-post-r", name: "Tibialis Posterior", scientificName: "Tibialis posterior", layer: 5, side: "back", color: "#164E63", position: [0.14, -0.68, -0.02], scale: [0.05, 0.24, 0.05], shape: "capsule" },
];

// ═══════════════════════════════════════════
// 3D MUSCLE MESH COMPONENT
// ═══════════════════════════════════════════
function MuscleMesh({
  muscle,
  layerOpacity,
  isHighlighted,
  isHovered,
  isSelected,
  isDimmed,
  onHover,
  onUnhover,
  onClick,
}: {
  muscle: Muscle3D;
  layerOpacity: number;
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
  const interactive = layerOpacity >= 0.1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const baseOpacity = isDimmed ? 0.08 : active ? 0.85 : 0.35;
    const targetOpacity = baseOpacity * layerOpacity;
    const targetEmissive = active ? 0.4 : 0;
    mat.opacity += (targetOpacity - mat.opacity) * delta * 6;
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * delta * 6;

    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const targetGlow = active ? 0.3 * layerOpacity : 0;
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
        onPointerEnter={interactive ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(); document.body.style.cursor = "pointer"; } : undefined}
        onPointerLeave={interactive ? () => { onUnhover(); document.body.style.cursor = "auto"; } : undefined}
        onClick={interactive ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); } : undefined}
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
  peelDepth,
  highlightedMuscles,
  hoveredMuscle,
  selectedMuscle,
  onHover,
  onUnhover,
  onSelect,
}: {
  peelDepth: number;
  highlightedMuscles: string[];
  hoveredMuscle: string | null;
  selectedMuscle: string | null;
  onHover: (id: string) => void;
  onUnhover: () => void;
  onSelect: (id: string) => void;
}) {
  // Calculate per-layer opacities from peelDepth (0–100)
  // Each layer fades out over a 20% window
  function linearFade(start: number, end: number): number {
    if (peelDepth <= start) return 1;
    if (peelDepth >= end) return 0;
    return 1 - (peelDepth - start) / (end - start);
  }

  const skinOpacity = linearFade(0, 20);
  const fasciaOpacity = linearFade(20, 40);
  const layer3Opacity = linearFade(40, 60);
  const layer4Opacity = linearFade(60, 80);
  const layer5Opacity = linearFade(80, 100);
  // Skeleton gradually reveals from 40%, fully visible at 80%+
  const skeletonOpacity = peelDepth <= 40 ? 0 : peelDepth >= 80 ? 1 : (peelDepth - 40) / 40;

  function getLayerOpacity(layer: 3 | 4 | 5): number {
    if (layer === 3) return layer3Opacity;
    if (layer === 4) return layer4Opacity;
    return layer5Opacity;
  }

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

      <SkinEnvelope opacity={skinOpacity} />
      <FasciaLayer opacity={fasciaOpacity} />
      <SkeletonLayer opacity={skeletonOpacity} />

      {muscles3D.map(m => (
        <MuscleMesh
          key={m.id}
          muscle={m}
          layerOpacity={getLayerOpacity(m.layer)}
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
  const [peelDepth, setPeelDepth] = useState<number>(0);
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
        <PeelSlider value={peelDepth} onChange={setPeelDepth} />
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
            peelDepth={peelDepth}
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
                Layer {hoveredData.layer}
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
              Layer {selectedData.layer}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export type { Muscle3D };
