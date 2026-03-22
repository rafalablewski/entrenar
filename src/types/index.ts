export type Role = "trainer" | "athlete";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: string;
}

export interface Athlete {
  id: string;
  user_id: string;
  trainer_id: string;
  sport: string;
  notes: string;
  created_at: string;
  // joined fields
  name?: string;
  email?: string;
}

export interface Endeavour {
  id: string;
  trainer_id: string;
  title: string;
  description: string;
  target_date: string;
  status: "planning" | "active" | "completed" | "cancelled";
  created_at: string;
}

export interface EndeavourAthlete {
  endeavour_id: string;
  athlete_id: string;
}

export interface TrainingPlan {
  id: string;
  endeavour_id: string;
  athlete_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  // joined
  athlete_name?: string;
  endeavour_title?: string;
}

export interface TrainingSession {
  id: string;
  plan_id: string;
  date: string;
  title: string;
  description: string;
  exercises: string; // JSON string of exercises
  status: "scheduled" | "completed" | "skipped";
  notes: string;
  created_at: string;
  // joined
  plan_title?: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: string;
  notes?: string;
}
