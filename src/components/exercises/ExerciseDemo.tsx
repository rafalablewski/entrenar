"use client";

import { useState, useEffect } from "react";

interface ExerciseDemoProps {
  exerciseId: string;
  exerciseName: string;
  movementPattern?: string;
}

type Pose = { [joint: string]: [number, number] };

interface ExerciseAnimation {
  name: string;
  poses: [Pose, Pose];
  equipment?: { type: string; d: string };
}

const JOINT_RADIUS = 3;
const LIMB_WIDTH = 2.5;

const STANDING: Pose = {
  head: [50, 12], neck: [50, 18], shoulder_l: [38, 22], shoulder_r: [62, 22],
  elbow_l: [34, 38], elbow_r: [66, 38], hand_l: [32, 52], hand_r: [68, 52],
  hip_l: [42, 55], hip_r: [58, 55], knee_l: [40, 72], knee_r: [60, 72],
  foot_l: [38, 88], foot_r: [62, 88],
};

const EXERCISES: Record<string, ExerciseAnimation> = {
  "horizontal-press": {
    name: "Bench Press",
    poses: [
      { head: [50, 28], neck: [50, 32], shoulder_l: [40, 36], shoulder_r: [60, 36],
        elbow_l: [32, 36], elbow_r: [68, 36], hand_l: [26, 22], hand_r: [74, 22],
        hip_l: [44, 52], hip_r: [56, 52], knee_l: [44, 68], knee_r: [56, 68],
        foot_l: [44, 82], foot_r: [56, 82] },
      { head: [50, 28], neck: [50, 32], shoulder_l: [40, 36], shoulder_r: [60, 36],
        elbow_l: [36, 28], elbow_r: [64, 28], hand_l: [38, 18], hand_r: [62, 18],
        hip_l: [44, 52], hip_r: [56, 52], knee_l: [44, 68], knee_r: [56, 68],
        foot_l: [44, 82], foot_r: [56, 82] },
    ],
    equipment: { type: "barbell", d: "M20,22 L80,22 M20,18 L20,26 M80,18 L80,26" },
  },
  "squat": {
    name: "Squat",
    poses: [
      { ...STANDING, hand_l: [38, 22], hand_r: [62, 22] },
      { head: [50, 28], neck: [50, 32], shoulder_l: [38, 36], shoulder_r: [62, 36],
        elbow_l: [36, 36], elbow_r: [64, 36], hand_l: [38, 36], hand_r: [62, 36],
        hip_l: [40, 60], hip_r: [60, 60], knee_l: [34, 72], knee_r: [66, 72],
        foot_l: [38, 88], foot_r: [62, 88] },
    ],
  },
  "hip-hinge": {
    name: "Deadlift",
    poses: [
      { head: [50, 30], neck: [50, 34], shoulder_l: [42, 40], shoulder_r: [58, 40],
        elbow_l: [40, 54], elbow_r: [60, 54], hand_l: [40, 66], hand_r: [60, 66],
        hip_l: [42, 58], hip_r: [58, 58], knee_l: [38, 72], knee_r: [62, 72],
        foot_l: [38, 88], foot_r: [62, 88] },
      { ...STANDING, hand_l: [40, 52], hand_r: [60, 52] },
    ],
    equipment: { type: "barbell", d: "M24,66 L76,66 M24,62 L24,70 M76,62 L76,70" },
  },
  "vertical-pull": {
    name: "Pull-up",
    poses: [
      { head: [50, 22], neck: [50, 26], shoulder_l: [36, 12], shoulder_r: [64, 12],
        elbow_l: [32, 10], elbow_r: [68, 10], hand_l: [34, 4], hand_r: [66, 4],
        hip_l: [44, 52], hip_r: [56, 52], knee_l: [42, 68], knee_r: [58, 68],
        foot_l: [40, 82], foot_r: [60, 82] },
      { head: [50, 10], neck: [50, 14], shoulder_l: [38, 10], shoulder_r: [62, 10],
        elbow_l: [30, 18], elbow_r: [70, 18], hand_l: [34, 4], hand_r: [66, 4],
        hip_l: [44, 40], hip_r: [56, 40], knee_l: [42, 56], knee_r: [58, 56],
        foot_l: [40, 70], foot_r: [60, 70] },
    ],
    equipment: { type: "bar", d: "M20,4 L80,4" },
  },
  "vertical-press": {
    name: "Overhead Press",
    poses: [
      { ...STANDING, elbow_l: [32, 28], elbow_r: [68, 28], hand_l: [34, 20], hand_r: [66, 20] },
      { ...STANDING, elbow_l: [38, 14], elbow_r: [62, 14], hand_l: [42, 6], hand_r: [58, 6] },
    ],
    equipment: { type: "barbell", d: "M26,20 L74,20 M26,16 L26,24 M74,16 L74,24" },
  },
  "horizontal-pull": {
    name: "Bent-Over Row",
    poses: [
      { head: [50, 26], neck: [50, 30], shoulder_l: [40, 36], shoulder_r: [60, 36],
        elbow_l: [36, 50], elbow_r: [64, 50], hand_l: [38, 62], hand_r: [62, 62],
        hip_l: [44, 56], hip_r: [56, 56], knee_l: [40, 72], knee_r: [60, 72],
        foot_l: [38, 88], foot_r: [62, 88] },
      { head: [50, 26], neck: [50, 30], shoulder_l: [40, 36], shoulder_r: [60, 36],
        elbow_l: [32, 40], elbow_r: [68, 40], hand_l: [38, 44], hand_r: [62, 44],
        hip_l: [44, 56], hip_r: [56, 56], knee_l: [40, 72], knee_r: [60, 72],
        foot_l: [38, 88], foot_r: [62, 88] },
    ],
    equipment: { type: "barbell", d: "M28,62 L72,62 M28,58 L28,66 M72,58 L72,66" },
  },
};

const LIMBS: [string, string][] = [
  ["head", "neck"], ["neck", "shoulder_l"], ["neck", "shoulder_r"],
  ["shoulder_l", "elbow_l"], ["shoulder_r", "elbow_r"],
  ["elbow_l", "hand_l"], ["elbow_r", "hand_r"],
  ["neck", "hip_l"], ["neck", "hip_r"], ["hip_l", "hip_r"],
  ["hip_l", "knee_l"], ["hip_r", "knee_r"],
  ["knee_l", "foot_l"], ["knee_r", "foot_r"],
];

function interpolatePose(a: Pose, b: Pose, t: number): Pose {
  const result: Pose = {};
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  for (const key of Object.keys(a)) {
    result[key] = [
      a[key][0] + (b[key][0] - a[key][0]) * ease,
      a[key][1] + (b[key][1] - a[key][1]) * ease,
    ];
  }
  return result;
}

export default function ExerciseDemo({ movementPattern }: ExerciseDemoProps) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);

  const anim = EXERCISES[movementPattern || ""] || EXERCISES["squat"];

  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let start = performance.now();
    const duration = 2000;
    const animate = (now: number) => {
      const elapsed = (now - start) % (duration * 2);
      const phase = elapsed < duration ? elapsed / duration : 2 - elapsed / duration;
      setT(phase);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const pose = interpolatePose(anim.poses[0], anim.poses[1], t);

  return (
    <div className="relative">
      <svg viewBox="0 0 100 95" className="w-full" style={{ maxHeight: 260 }}>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="95" fill="url(#grid)" />

        {/* Equipment */}
        {anim.equipment && (
          <path d={anim.equipment.d} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Limbs */}
        {LIMBS.map(([a, b]) => (
          <line key={`${a}-${b}`}
            x1={pose[a][0]} y1={pose[a][1]}
            x2={pose[b][0]} y2={pose[b][1]}
            stroke="rgba(0,240,255,0.6)" strokeWidth={LIMB_WIDTH}
            strokeLinecap="round" />
        ))}

        {/* Joints */}
        {Object.entries(pose).map(([id, [x, y]]) => (
          <circle key={id} cx={x} cy={y} r={id === "head" ? 5 : JOINT_RADIUS}
            fill={id === "head" ? "rgba(0,240,255,0.15)" : "rgba(0,240,255,0.3)"}
            stroke="#00F0FF" strokeWidth="0.6" />
        ))}

        {/* Motion trails */}
        <circle cx={pose.hand_l[0]} cy={pose.hand_l[1]} r="6"
          fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="0.5"
          style={{ opacity: Math.abs(t - 0.5) }} />
        <circle cx={pose.hand_r[0]} cy={pose.hand_r[1]} r="6"
          fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="0.5"
          style={{ opacity: Math.abs(t - 0.5) }} />
      </svg>

      {/* Play/pause */}
      <button onClick={() => setPlaying(!playing)}
        className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
        style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(255,255,255,0.6)">
            <rect x="1" y="1" width="3" height="8" /><rect x="6" y="1" width="3" height="8" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(255,255,255,0.6)">
            <polygon points="2,1 9,5 2,9" />
          </svg>
        )}
      </button>
    </div>
  );
}
