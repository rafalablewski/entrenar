export type { ExerciseTemplate } from "./running";
export { runningExercises } from "./running";
export { swimmingExercises } from "./swimming";
export { cyclingExercises, triathlonExercises } from "./cycling";
export { gymExercises } from "./gym";
export {
  hyroxExercises,
  crossfitExercises,
  weightliftingExercises,
  powerliftingExercises,
} from "./hyrox-crossfit-strength";

import { ExerciseTemplate } from "./running";
import { runningExercises } from "./running";
import { swimmingExercises } from "./swimming";
import { cyclingExercises, triathlonExercises } from "./cycling";
import { gymExercises } from "./gym";
import {
  hyroxExercises,
  crossfitExercises,
  weightliftingExercises,
  powerliftingExercises,
} from "./hyrox-crossfit-strength";

export const allExercises: ExerciseTemplate[] = [
  ...runningExercises,
  ...swimmingExercises,
  ...cyclingExercises,
  ...triathlonExercises,
  ...gymExercises,
  ...hyroxExercises,
  ...crossfitExercises,
  ...weightliftingExercises,
  ...powerliftingExercises,
];

export const categories = [
  { id: "running", label: "Running", color: "#3B82F6" },
  { id: "swimming", label: "Swimming", color: "#06B6D4" },
  { id: "cycling", label: "Cycling", color: "#10B981" },
  { id: "triathlon", label: "Triathlon", color: "#8B5CF6" },
  { id: "gym", label: "Gym", color: "#F59E0B" },
  { id: "hyrox", label: "HYROX", color: "#EF4444" },
  { id: "crossfit", label: "CrossFit", color: "#EC4899" },
  { id: "weightlifting", label: "Weightlifting", color: "#F97316" },
  { id: "powerlifting", label: "Powerlifting", color: "#6366F1" },
] as const;

export function getExercisesByCategory(category: string): ExerciseTemplate[] {
  return allExercises.filter((e) => e.category === category);
}

export function searchExercises(query: string): ExerciseTemplate[] {
  const q = query.toLowerCase();
  return allExercises.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.subcategory.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.muscleGroups.some((m) => m.toLowerCase().includes(q))
  );
}
