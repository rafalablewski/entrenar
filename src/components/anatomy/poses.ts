/** Exercise pose data for 3D skeleton animation.
 * Each pose defines 3D joint positions. The animator interpolates between start/end poses. */

export interface Pose3D {
  head: [number, number, number];
  neck: [number, number, number];
  shoulderL: [number, number, number];
  shoulderR: [number, number, number];
  elbowL: [number, number, number];
  elbowR: [number, number, number];
  handL: [number, number, number];
  handR: [number, number, number];
  spine: [number, number, number];
  hipL: [number, number, number];
  hipR: [number, number, number];
  kneeL: [number, number, number];
  kneeR: [number, number, number];
  footL: [number, number, number];
  footR: [number, number, number];
}

export type JointName = keyof Pose3D;

export const JOINT_CONNECTIONS: [JointName, JointName][] = [
  ["head", "neck"], ["neck", "shoulderL"], ["neck", "shoulderR"],
  ["shoulderL", "elbowL"], ["shoulderR", "elbowR"],
  ["elbowL", "handL"], ["elbowR", "handR"],
  ["neck", "spine"], ["spine", "hipL"], ["spine", "hipR"],
  ["hipL", "hipR"],
  ["hipL", "kneeL"], ["hipR", "kneeR"],
  ["kneeL", "footL"], ["kneeR", "footR"],
];

const STANDING: Pose3D = {
  head: [0, 1.75, 0], neck: [0, 1.6, 0],
  shoulderL: [-0.22, 1.5, 0], shoulderR: [0.22, 1.5, 0],
  elbowL: [-0.28, 1.2, 0.05], elbowR: [0.28, 1.2, 0.05],
  handL: [-0.26, 0.95, 0.1], handR: [0.26, 0.95, 0.1],
  spine: [0, 1.15, 0],
  hipL: [-0.12, 0.9, 0], hipR: [0.12, 0.9, 0],
  kneeL: [-0.13, 0.5, 0.02], kneeR: [0.13, 0.5, 0.02],
  footL: [-0.14, 0.05, 0.06], footR: [0.14, 0.05, 0.06],
};

export interface ExercisePose {
  start: Pose3D;
  end: Pose3D;
  activeMuscles: string[];
}

export const EXERCISE_POSES: Record<string, ExercisePose> = {
  "horizontal-press": {
    start: {
      ...STANDING,
      head: [0, 1.18, 0], neck: [0, 1.12, 0],
      shoulderL: [-0.22, 1.08, 0], shoulderR: [0.22, 1.08, 0],
      elbowL: [-0.38, 1.08, 0.12], elbowR: [0.38, 1.08, 0.12],
      handL: [-0.36, 1.08, 0.32], handR: [0.36, 1.08, 0.32],
      spine: [0, 0.95, 0],
      hipL: [-0.12, 0.8, 0], hipR: [0.12, 0.8, 0],
      kneeL: [-0.12, 0.5, 0.2], kneeR: [0.12, 0.5, 0.2],
      footL: [-0.14, 0.05, 0.06], footR: [0.14, 0.05, 0.06],
    },
    end: {
      ...STANDING,
      head: [0, 1.18, 0], neck: [0, 1.12, 0],
      shoulderL: [-0.22, 1.08, 0], shoulderR: [0.22, 1.08, 0],
      elbowL: [-0.26, 1.08, 0.28], elbowR: [0.26, 1.08, 0.28],
      handL: [-0.22, 1.08, 0.52], handR: [0.22, 1.08, 0.52],
      spine: [0, 0.95, 0],
      hipL: [-0.12, 0.8, 0], hipR: [0.12, 0.8, 0],
      kneeL: [-0.12, 0.5, 0.2], kneeR: [0.12, 0.5, 0.2],
      footL: [-0.14, 0.05, 0.06], footR: [0.14, 0.05, 0.06],
    },
    activeMuscles: ["chest", "shoulders", "arms"],
  },
  "squat": {
    start: { ...STANDING },
    end: {
      ...STANDING,
      head: [0, 1.35, 0.05], neck: [0, 1.22, 0.05],
      shoulderL: [-0.22, 1.12, 0.08], shoulderR: [0.22, 1.12, 0.08],
      elbowL: [-0.28, 1.0, 0.15], elbowR: [0.28, 1.0, 0.15],
      handL: [-0.22, 1.12, 0.08], handR: [0.22, 1.12, 0.08],
      spine: [0, 0.95, 0.06],
      hipL: [-0.15, 0.65, 0.08], hipR: [0.15, 0.65, 0.08],
      kneeL: [-0.18, 0.38, 0.2], kneeR: [0.18, 0.38, 0.2],
      footL: [-0.16, 0.05, 0.06], footR: [0.16, 0.05, 0.06],
    },
    activeMuscles: ["legs", "glutes", "core"],
  },
  "hip-hinge": {
    start: {
      ...STANDING,
      head: [0, 1.45, 0.15], neck: [0, 1.35, 0.12],
      shoulderL: [-0.22, 1.25, 0.1], shoulderR: [0.22, 1.25, 0.1],
      elbowL: [-0.24, 1.0, 0.15], elbowR: [0.24, 1.0, 0.15],
      handL: [-0.22, 0.75, 0.1], handR: [0.22, 0.75, 0.1],
      spine: [0, 1.05, 0.08],
      hipL: [-0.12, 0.85, 0.02], hipR: [0.12, 0.85, 0.02],
      kneeL: [-0.13, 0.48, 0.06], kneeR: [0.13, 0.48, 0.06],
    },
    end: { ...STANDING, handL: [-0.22, 0.95, 0.08], handR: [0.22, 0.95, 0.08] },
    activeMuscles: ["back", "legs", "glutes", "core"],
  },
  "vertical-pull": {
    start: {
      ...STANDING,
      head: [0, 1.65, 0], neck: [0, 1.55, 0],
      shoulderL: [-0.28, 1.52, 0], shoulderR: [0.28, 1.52, 0],
      elbowL: [-0.32, 1.7, 0], elbowR: [0.32, 1.7, 0],
      handL: [-0.26, 1.88, 0], handR: [0.26, 1.88, 0],
      spine: [0, 1.2, 0],
      hipL: [-0.12, 0.85, 0], hipR: [0.12, 0.85, 0],
      kneeL: [-0.13, 0.48, 0.04], kneeR: [0.13, 0.48, 0.04],
    },
    end: {
      ...STANDING,
      head: [0, 1.82, 0], neck: [0, 1.72, 0],
      shoulderL: [-0.24, 1.66, 0], shoulderR: [0.24, 1.66, 0],
      elbowL: [-0.34, 1.52, 0.1], elbowR: [0.34, 1.52, 0.1],
      handL: [-0.26, 1.88, 0], handR: [0.26, 1.88, 0],
      spine: [0, 1.4, 0],
      hipL: [-0.12, 1.05, 0], hipR: [0.12, 1.05, 0],
      kneeL: [-0.13, 0.7, 0.04], kneeR: [0.13, 0.7, 0.04],
      footL: [-0.14, 0.35, 0.06], footR: [0.14, 0.35, 0.06],
    },
    activeMuscles: ["back", "arms"],
  },
  "vertical-press": {
    start: {
      ...STANDING,
      elbowL: [-0.30, 1.42, 0.12], elbowR: [0.30, 1.42, 0.12],
      handL: [-0.26, 1.52, 0.18], handR: [0.26, 1.52, 0.18],
    },
    end: {
      ...STANDING,
      elbowL: [-0.24, 1.7, 0.02], elbowR: [0.24, 1.7, 0.02],
      handL: [-0.18, 1.9, 0], handR: [0.18, 1.9, 0],
    },
    activeMuscles: ["shoulders", "arms", "core"],
  },
  "horizontal-pull": {
    start: {
      ...STANDING,
      head: [0, 1.5, 0.12], neck: [0, 1.4, 0.1],
      shoulderL: [-0.22, 1.3, 0.08], shoulderR: [0.22, 1.3, 0.08],
      elbowL: [-0.24, 1.1, 0.18], elbowR: [0.24, 1.1, 0.18],
      handL: [-0.22, 0.9, 0.12], handR: [0.22, 0.9, 0.12],
      spine: [0, 1.05, 0.06],
    },
    end: {
      ...STANDING,
      head: [0, 1.5, 0.12], neck: [0, 1.4, 0.1],
      shoulderL: [-0.22, 1.3, 0.08], shoulderR: [0.22, 1.3, 0.08],
      elbowL: [-0.34, 1.25, -0.05], elbowR: [0.34, 1.25, -0.05],
      handL: [-0.24, 1.1, 0.06], handR: [0.24, 1.1, 0.06],
      spine: [0, 1.05, 0.06],
    },
    activeMuscles: ["back", "arms"],
  },
};

export const DEFAULT_POSE = STANDING;

export function interpolatePoses(a: Pose3D, b: Pose3D, t: number): Pose3D {
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const result = {} as Pose3D;
  for (const key of Object.keys(a) as JointName[]) {
    result[key] = [
      a[key][0] + (b[key][0] - a[key][0]) * ease,
      a[key][1] + (b[key][1] - a[key][1]) * ease,
      a[key][2] + (b[key][2] - a[key][2]) * ease,
    ];
  }
  return result;
}
