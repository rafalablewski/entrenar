import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const GOAL_LABELS: Record<string, string> = {
  marathon: "Marathon", half_marathon: "Half Marathon", "5k": "5K", "10k": "10K",
  ironman: "Ironman", half_ironman: "Half Ironman", olympic_triathlon: "Olympic Triathlon",
  sprint_triathlon: "Sprint Triathlon", cycling_century: "Century Ride", cycling_gran_fondo: "Gran Fondo",
  swimming_open_water: "Open Water Swimming", general_fitness: "General Fitness",
  muscle_building: "Muscle Building", weight_loss: "Weight Loss",
  hyrox: "HYROX", crossfit_competition: "CrossFit Competition",
  powerlifting_meet: "Powerlifting Meet", custom: "Custom Goal",
};

interface SessionExercise {
  name: string; sets?: number; reps?: string; weight?: string; duration?: string; notes?: string;
}
interface GenSession {
  date: string; title: string; description: string; exercises: SessionExercise[];
}

const LEVEL_MULT: Record<string, { volume: number; intensity: number }> = {
  beginner: { volume: 0.6, intensity: 0.5 },
  intermediate: { volume: 0.8, intensity: 0.7 },
  advanced: { volume: 1.0, intensity: 0.9 },
  elite: { volume: 1.15, intensity: 1.0 },
};

// Phase config: [volumeMult, intensityMult]
function getPhase(weekIdx: number, totalWeeks: number): { name: string; vol: number; int: number } {
  const pct = weekIdx / totalWeeks;
  if (pct < 0.3) return { name: "Base", vol: 0.7, int: 0.6 };
  if (pct < 0.7) return { name: "Build", vol: 0.9, int: 0.8 };
  if (pct < 0.9) return { name: "Peak", vol: 0.6, int: 1.0 };
  return { name: "Taper", vol: 0.4, int: 0.5 };
}

// Exercise pools by goal category
const RUNNING_POOL: Record<string, SessionExercise[]> = {
  easy: [
    { name: "Easy Run", duration: "30-45 min", notes: "Conversational pace, zone 2" },
    { name: "Recovery Run", duration: "20-30 min", notes: "Very easy effort" },
  ],
  tempo: [
    { name: "Tempo Run", duration: "25-40 min", notes: "Comfortably hard, zone 3-4" },
    { name: "Race Pace Run", duration: "20-30 min", notes: "Goal race pace" },
  ],
  interval: [
    { name: "Track Intervals", sets: 6, reps: "400m", notes: "90s recovery between reps" },
    { name: "Hill Repeats", sets: 8, reps: "60s uphill", notes: "Jog down recovery" },
    { name: "Fartlek", duration: "35 min", notes: "Alternate 2min hard / 2min easy" },
  ],
  long: [
    { name: "Long Run", duration: "60-120 min", notes: "Steady easy pace, hydrate" },
  ],
  strength: [
    { name: "Squats", sets: 3, reps: "12", notes: "Runner-specific strength" },
    { name: "Lunges", sets: 3, reps: "10 each", notes: "Walking lunges" },
    { name: "Single Leg Deadlift", sets: 3, reps: "10 each" },
    { name: "Calf Raises", sets: 3, reps: "15" },
    { name: "Plank", sets: 3, duration: "45s" },
    { name: "Hip Bridges", sets: 3, reps: "15" },
  ],
};

const SWIM_POOL: Record<string, SessionExercise[]> = {
  technique: [
    { name: "Swim Drills - Catch-up", duration: "400m", notes: "Focus on arm extension" },
    { name: "Swim Drills - Fingertip Drag", duration: "400m", notes: "High elbow recovery" },
    { name: "Kick Set", duration: "300m", notes: "With kickboard, steady effort" },
  ],
  endurance: [
    { name: "Endurance Swim", duration: "1500-2500m", notes: "Steady pace, breathe every 3 strokes" },
    { name: "Swim Intervals", sets: 8, reps: "100m", notes: "15s rest between" },
  ],
  sprint: [
    { name: "Sprint Set", sets: 10, reps: "50m", notes: "Max effort, 30s rest" },
    { name: "Descending Set", sets: 4, reps: "200m", notes: "Get faster each rep" },
  ],
};

const BIKE_POOL: Record<string, SessionExercise[]> = {
  endurance: [
    { name: "Endurance Ride", duration: "60-120 min", notes: "Zone 2, steady cadence 85-95 rpm" },
    { name: "Recovery Spin", duration: "30-45 min", notes: "Very easy, high cadence" },
  ],
  tempo: [
    { name: "Tempo Ride", duration: "45-75 min", notes: "Sustained zone 3-4 effort" },
    { name: "Sweet Spot Intervals", sets: 3, duration: "15 min on / 5 min off", notes: "88-93% FTP" },
  ],
  interval: [
    { name: "VO2max Intervals", sets: 5, duration: "4 min on / 4 min off", notes: "Max sustainable effort" },
    { name: "Hill Climb Repeats", sets: 6, duration: "3 min climb", notes: "Seated, high resistance" },
  ],
};

const GYM_PUSH: SessionExercise[] = [
  { name: "Bench Press", sets: 4, reps: "8-10" },
  { name: "Overhead Press", sets: 3, reps: "8-10" },
  { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
  { name: "Lateral Raises", sets: 3, reps: "12-15" },
  { name: "Tricep Dips", sets: 3, reps: "10-12" },
  { name: "Cable Flyes", sets: 3, reps: "12" },
];

const GYM_PULL: SessionExercise[] = [
  { name: "Deadlift", sets: 4, reps: "5-6" },
  { name: "Barbell Row", sets: 4, reps: "8-10" },
  { name: "Pull-ups", sets: 3, reps: "8-12" },
  { name: "Face Pulls", sets: 3, reps: "15" },
  { name: "Bicep Curls", sets: 3, reps: "10-12" },
  { name: "Hammer Curls", sets: 3, reps: "10-12" },
];

const GYM_LEGS: SessionExercise[] = [
  { name: "Back Squat", sets: 4, reps: "6-8" },
  { name: "Romanian Deadlift", sets: 3, reps: "10" },
  { name: "Leg Press", sets: 3, reps: "12" },
  { name: "Walking Lunges", sets: 3, reps: "12 each" },
  { name: "Leg Curls", sets: 3, reps: "12" },
  { name: "Calf Raises", sets: 4, reps: "15" },
];

const HIIT_POOL: SessionExercise[] = [
  { name: "Burpees", sets: 4, reps: "12" },
  { name: "Box Jumps", sets: 4, reps: "10" },
  { name: "Kettlebell Swings", sets: 4, reps: "15" },
  { name: "Battle Ropes", sets: 4, duration: "30s" },
  { name: "Mountain Climbers", sets: 4, duration: "30s" },
  { name: "Rowing Sprint", sets: 5, duration: "500m" },
];

const HYROX_POOL: SessionExercise[] = [
  { name: "SkiErg", duration: "1000m", notes: "Race pace" },
  { name: "Sled Push", sets: 1, duration: "50m", notes: "Heavy load" },
  { name: "Sled Pull", sets: 1, duration: "50m", notes: "Hand over hand" },
  { name: "Burpee Broad Jumps", sets: 1, reps: "80m" },
  { name: "Rowing", duration: "1000m", notes: "Strong pace" },
  { name: "Farmers Carry", sets: 1, duration: "200m", notes: "2x24kg" },
  { name: "Sandbag Lunges", sets: 1, duration: "100m", notes: "20kg bag" },
  { name: "Wall Balls", sets: 1, reps: "75", notes: "9kg ball" },
  { name: "Running Station", duration: "1000m", notes: "Between stations" },
];

const POWERLIFTING_POOL: SessionExercise[] = [
  { name: "Competition Squat", sets: 5, reps: "3-5", notes: "Work up to top set" },
  { name: "Competition Bench", sets: 5, reps: "3-5", notes: "Pause at chest" },
  { name: "Competition Deadlift", sets: 4, reps: "2-4", notes: "Full reset each rep" },
  { name: "Paused Squat", sets: 3, reps: "4", notes: "3s pause at bottom" },
  { name: "Close Grip Bench", sets: 3, reps: "8" },
  { name: "Deficit Deadlift", sets: 3, reps: "5", notes: "2 inch deficit" },
  { name: "Front Squat", sets: 3, reps: "6" },
  { name: "Pendlay Row", sets: 4, reps: "8" },
];

const CROSSFIT_POOL: SessionExercise[] = [
  { name: "Clean & Jerk", sets: 5, reps: "2" },
  { name: "Snatch", sets: 5, reps: "2" },
  { name: "Thrusters", sets: 3, reps: "15", notes: "For time" },
  { name: "Toes-to-Bar", sets: 4, reps: "12" },
  { name: "Double Unders", sets: 3, reps: "50" },
  { name: "Muscle-ups", sets: 5, reps: "3" },
  { name: "Handstand Push-ups", sets: 4, reps: "8" },
  { name: "Assault Bike", duration: "15 cal", sets: 5 },
  { name: "Wall Walks", sets: 3, reps: "5" },
];

const MOBILITY: SessionExercise[] = [
  { name: "Foam Rolling", duration: "10 min", notes: "Full body" },
  { name: "Hip Flexor Stretch", sets: 2, duration: "60s each side" },
  { name: "Pigeon Pose", sets: 2, duration: "60s each side" },
  { name: "Cat-Cow", sets: 1, reps: "10" },
  { name: "World's Greatest Stretch", sets: 2, reps: "5 each side" },
  { name: "Light Walk", duration: "15-20 min", notes: "Active recovery" },
];

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

type GoalCategory = "running" | "triathlon" | "cycling" | "swimming" | "gym" | "hyrox" | "crossfit" | "powerlifting" | "custom";

function goalCategory(goalType: string): GoalCategory {
  if (["marathon", "half_marathon", "5k", "10k"].includes(goalType)) return "running";
  if (["ironman", "half_ironman", "olympic_triathlon", "sprint_triathlon"].includes(goalType)) return "triathlon";
  if (["cycling_century", "cycling_gran_fondo"].includes(goalType)) return "cycling";
  if (goalType === "swimming_open_water") return "swimming";
  if (["general_fitness", "muscle_building", "weight_loss"].includes(goalType)) return "gym";
  if (goalType === "hyrox") return "hyrox";
  if (goalType === "crossfit_competition") return "crossfit";
  if (goalType === "powerlifting_meet") return "powerlifting";
  return "custom";
}

function buildDaySchedule(dayIdx: number, daysPerWeek: number, category: GoalCategory, phase: { name: string; vol: number; int: number }, level: { volume: number; intensity: number }): GenSession | null {
  // dayIdx 0-6 within a week, only fill training days
  const trainingDays = Array.from({ length: 7 }, (_, i) => i)
    .filter((_, i) => {
      if (daysPerWeek >= 7) return true;
      if (daysPerWeek === 6) return i !== 3; // rest Wed
      if (daysPerWeek === 5) return i !== 2 && i !== 5; // rest Wed, Sat
      if (daysPerWeek === 4) return i !== 0 && i !== 2 && i !== 5;
      return i === 1 || i === 3 || i === 5; // 3 days: Tue, Thu, Sat
    });

  if (!trainingDays.includes(dayIdx)) return null;

  const dayInWeek = trainingDays.indexOf(dayIdx);
  const isLast = dayInWeek === trainingDays.length - 1;
  const isFirst = dayInWeek === 0;

  switch (category) {
    case "running": return buildRunningDay(dayInWeek, trainingDays.length, phase, isLast);
    case "triathlon": return buildTriathlonDay(dayInWeek, trainingDays.length, phase, isLast);
    case "cycling": return buildCyclingDay(dayInWeek, trainingDays.length, phase, isLast);
    case "swimming": return buildSwimmingDay(dayInWeek, trainingDays.length, phase, isLast);
    case "gym": return buildGymDay(dayInWeek, trainingDays.length, phase, isFirst);
    case "hyrox": return buildHyroxDay(dayInWeek, trainingDays.length, phase);
    case "crossfit": return buildCrossfitDay(dayInWeek, trainingDays.length, phase);
    case "powerlifting": return buildPowerliftingDay(dayInWeek, trainingDays.length, phase);
    default: return buildGymDay(dayInWeek, trainingDays.length, phase, isFirst);
  }
}

function buildRunningDay(dayInWeek: number, totalDays: number, phase: { name: string }, isLast: boolean): GenSession {
  if (isLast) {
    return { date: "", title: `Long Run - ${phase.name}`, description: "Weekly long run to build endurance", exercises: pick(RUNNING_POOL.long, 1).concat(pick(RUNNING_POOL.strength, 2)) };
  }
  const types = [
    () => ({ title: `Easy Run - ${phase.name}`, description: "Aerobic base building", exercises: pick(RUNNING_POOL.easy, 1) }),
    () => ({ title: `Tempo Run - ${phase.name}`, description: "Lactate threshold work", exercises: pick(RUNNING_POOL.tempo, 1) }),
    () => ({ title: `Interval Session - ${phase.name}`, description: "Speed and VO2max development", exercises: pick(RUNNING_POOL.interval, 2) }),
    () => ({ title: `Strength + Easy Run - ${phase.name}`, description: "Runner-specific strength with easy cardio", exercises: [...pick(RUNNING_POOL.strength, 4), ...pick(RUNNING_POOL.easy, 1)] }),
  ];
  const chosen = types[dayInWeek % types.length]();
  return { date: "", ...chosen };
}

function buildTriathlonDay(dayInWeek: number, totalDays: number, phase: { name: string }, isLast: boolean): GenSession {
  const disciplines = ["swim", "bike", "run"];
  const disc = disciplines[dayInWeek % 3];
  if (isLast) {
    return { date: "", title: `Brick Session - ${phase.name}`, description: "Bike-to-run transition practice", exercises: [...pick(BIKE_POOL.tempo, 1), ...pick(RUNNING_POOL.tempo, 1)] };
  }
  if (disc === "swim") {
    return { date: "", title: `Swim Session - ${phase.name}`, description: "Swim technique and endurance", exercises: [...pick(SWIM_POOL.technique, 1), ...pick(SWIM_POOL.endurance, 1)] };
  }
  if (disc === "bike") {
    return { date: "", title: `Bike Session - ${phase.name}`, description: "Cycling power and endurance", exercises: phase.name === "Base" ? pick(BIKE_POOL.endurance, 1) : pick(BIKE_POOL.interval, 1) };
  }
  return { date: "", title: `Run Session - ${phase.name}`, description: "Running fitness", exercises: phase.name === "Base" ? pick(RUNNING_POOL.easy, 1) : pick(RUNNING_POOL.tempo, 1) };
}

function buildCyclingDay(dayInWeek: number, totalDays: number, phase: { name: string }, isLast: boolean): GenSession {
  if (isLast) {
    return { date: "", title: `Long Endurance Ride - ${phase.name}`, description: "Build time in saddle", exercises: pick(BIKE_POOL.endurance, 1) };
  }
  const types = [
    () => ({ title: `Recovery Spin - ${phase.name}`, description: "Active recovery", exercises: pick(BIKE_POOL.endurance, 1) }),
    () => ({ title: `Tempo Ride - ${phase.name}`, description: "Sustained effort", exercises: pick(BIKE_POOL.tempo, 1) }),
    () => ({ title: `Interval Session - ${phase.name}`, description: "High intensity cycling", exercises: pick(BIKE_POOL.interval, 1) }),
    () => ({ title: `Strength + Spin - ${phase.name}`, description: "Leg strength for cycling", exercises: [...pick(GYM_LEGS, 3), ...pick(BIKE_POOL.endurance, 1)] }),
  ];
  return { date: "", ...types[dayInWeek % types.length]() };
}

function buildSwimmingDay(dayInWeek: number, totalDays: number, phase: { name: string }, isLast: boolean): GenSession {
  if (isLast) {
    return { date: "", title: `Distance Swim - ${phase.name}`, description: "Build swim endurance", exercises: pick(SWIM_POOL.endurance, 1) };
  }
  const types = [
    () => ({ title: `Technique Drills - ${phase.name}`, description: "Swim form work", exercises: pick(SWIM_POOL.technique, 2) }),
    () => ({ title: `Sprint Set - ${phase.name}`, description: "Speed development", exercises: pick(SWIM_POOL.sprint, 1) }),
    () => ({ title: `Endurance Swim - ${phase.name}`, description: "Aerobic swim", exercises: pick(SWIM_POOL.endurance, 1) }),
    () => ({ title: `Dryland + Swim - ${phase.name}`, description: "Strength and swim", exercises: [...pick(GYM_PULL, 2), ...pick(SWIM_POOL.technique, 1)] }),
  ];
  return { date: "", ...types[dayInWeek % types.length]() };
}

function buildGymDay(dayInWeek: number, totalDays: number, phase: { name: string }, isFirst: boolean): GenSession {
  const split = dayInWeek % 3;
  if (split === 0) {
    return { date: "", title: `Push Day - ${phase.name}`, description: "Chest, shoulders, triceps", exercises: pick(GYM_PUSH, phase.name === "Base" ? 4 : 5) };
  }
  if (split === 1) {
    return { date: "", title: `Pull Day - ${phase.name}`, description: "Back, biceps", exercises: pick(GYM_PULL, phase.name === "Base" ? 4 : 5) };
  }
  return { date: "", title: `Legs Day - ${phase.name}`, description: "Quads, hamstrings, glutes", exercises: pick(GYM_LEGS, phase.name === "Base" ? 4 : 5) };
}

function buildHyroxDay(dayInWeek: number, totalDays: number, phase: { name: string }): GenSession {
  const types = [
    () => ({ title: `HYROX Stations - ${phase.name}`, description: "Practice race stations", exercises: pick(HYROX_POOL, 4) }),
    () => ({ title: `Running Endurance - ${phase.name}`, description: "Running between stations", exercises: [...pick(RUNNING_POOL.tempo, 1), ...pick(RUNNING_POOL.easy, 1)] }),
    () => ({ title: `Strength & Conditioning - ${phase.name}`, description: "Functional strength", exercises: [...pick(GYM_LEGS, 2), ...pick(HIIT_POOL, 2)] }),
    () => ({ title: `Full Simulation - ${phase.name}`, description: "HYROX race simulation", exercises: pick(HYROX_POOL, 6) }),
  ];
  return { date: "", ...types[dayInWeek % types.length]() };
}

function buildCrossfitDay(dayInWeek: number, totalDays: number, phase: { name: string }): GenSession {
  const types = [
    () => ({ title: `Olympic Lifting - ${phase.name}`, description: "Snatch and clean technique", exercises: pick(CROSSFIT_POOL, 3) }),
    () => ({ title: `MetCon - ${phase.name}`, description: "Metabolic conditioning WOD", exercises: [...pick(CROSSFIT_POOL, 2), ...pick(HIIT_POOL, 2)] }),
    () => ({ title: `Gymnastics + Strength - ${phase.name}`, description: "Skill work and strength", exercises: [...pick(CROSSFIT_POOL, 2), ...pick(GYM_PUSH, 2)] }),
    () => ({ title: `Endurance WOD - ${phase.name}`, description: "Longer effort workout", exercises: [...pick(HIIT_POOL, 3), ...pick(RUNNING_POOL.easy, 1)] }),
  ];
  return { date: "", ...types[dayInWeek % types.length]() };
}

function buildPowerliftingDay(dayInWeek: number, totalDays: number, phase: { name: string }): GenSession {
  const types = [
    () => ({ title: `Squat Day - ${phase.name}`, description: "Competition squat focus", exercises: pick(POWERLIFTING_POOL.filter(e => e.name.includes("Squat") || e.name.includes("Front")), 2).concat(pick(GYM_LEGS, 2)) }),
    () => ({ title: `Bench Day - ${phase.name}`, description: "Competition bench focus", exercises: pick(POWERLIFTING_POOL.filter(e => e.name.includes("Bench") || e.name.includes("Close")), 2).concat(pick(GYM_PUSH, 2)) }),
    () => ({ title: `Deadlift Day - ${phase.name}`, description: "Competition deadlift focus", exercises: pick(POWERLIFTING_POOL.filter(e => e.name.includes("Deadlift") || e.name.includes("Row")), 2).concat(pick(GYM_PULL, 2)) }),
    () => ({ title: `Accessory Day - ${phase.name}`, description: "Weak point training", exercises: [...pick(GYM_PUSH, 2), ...pick(GYM_PULL, 2)] }),
  ];
  return { date: "", ...types[dayInWeek % types.length]() };
}

function generateTrainingPlan(goalType: string, experienceLevel: string, daysPerWeek: number, weeks: number, customDesc?: string) {
  const category = goalCategory(goalType);
  const level = LEVEL_MULT[experienceLevel] || LEVEL_MULT.intermediate;
  const goalLabel = GOAL_LABELS[goalType] || goalType;

  const description = customDesc || `${weeks}-week periodized ${goalLabel} training plan for ${experienceLevel} athletes. ${daysPerWeek} sessions per week with progressive overload through Base, Build, Peak, and Taper phases.`;

  const sessions: GenSession[] = [];
  const startDate = new Date();

  for (let week = 0; week < weeks; week++) {
    const phase = getPhase(week, weeks);
    for (let day = 0; day < 7; day++) {
      const session = buildDaySchedule(day, daysPerWeek, category, phase, level);
      if (session) {
        session.date = addDays(startDate, week * 7 + day);
        sessions.push(session);
      }
    }
  }

  // Add rest day sessions for non-training days (1 per week)
  for (let week = 0; week < weeks; week++) {
    const phase = getPhase(week, weeks);
    const restSession: GenSession = {
      date: addDays(startDate, week * 7 + (daysPerWeek <= 5 ? 0 : 3)),
      title: `Active Recovery - ${phase.name}`,
      description: "Light movement and mobility work",
      exercises: pick(MOBILITY, 4),
    };
    // Only add if that date doesn't already have a session
    if (!sessions.some(s => s.date === restSession.date)) {
      sessions.push(restSession);
    }
  }

  sessions.sort((a, b) => a.date.localeCompare(b.date));

  return { description, sessions };
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { endeavour_id, athlete_id, goal_type, experience_level, days_per_week, plan_duration_weeks, title, custom_description } = body;

  if (!endeavour_id || !athlete_id || !goal_type || !experience_level || !days_per_week || !plan_duration_weeks) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  const sql = getDb();
  const plan = generateTrainingPlan(goal_type, experience_level, days_per_week, plan_duration_weeks, custom_description);

  const planId = uuidv4();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan_duration_weeks * 7);

  const planTitle = title || `${GOAL_LABELS[goal_type] || goal_type} - ${experience_level.charAt(0).toUpperCase() + experience_level.slice(1)} Plan`;

  await sql`
    INSERT INTO training_plans (id, endeavour_id, athlete_id, title, description, start_date, end_date)
    VALUES (${planId}, ${endeavour_id}, ${athlete_id}, ${planTitle}, ${plan.description}, ${startDate.toISOString().split("T")[0]}, ${endDate.toISOString().split("T")[0]})
  `;

  for (const session of plan.sessions) {
    const sessionId = uuidv4();
    await sql`
      INSERT INTO training_sessions (id, plan_id, date, title, description, exercises, status)
      VALUES (${sessionId}, ${planId}, ${session.date}, ${session.title}, ${session.description}, ${JSON.stringify(session.exercises)}, 'scheduled')
    `;
  }

  return NextResponse.json({ plan_id: planId, sessions_created: plan.sessions.length });
}
