import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export type NeonQuery = ReturnType<typeof neon>;

export async function initializeDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('trainer', 'athlete')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS athletes (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id),
      trainer_id TEXT NOT NULL REFERENCES users(id),
      sport TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS endeavours (
      id TEXT PRIMARY KEY,
      trainer_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      target_date TEXT NOT NULL,
      status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS endeavour_athletes (
      endeavour_id TEXT NOT NULL REFERENCES endeavours(id) ON DELETE CASCADE,
      athlete_id TEXT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
      PRIMARY KEY (endeavour_id, athlete_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS training_plans (
      id TEXT PRIMARY KEY,
      endeavour_id TEXT NOT NULL REFERENCES endeavours(id) ON DELETE CASCADE,
      athlete_id TEXT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS training_sessions (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      exercises TEXT DEFAULT '[]',
      status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped')),
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS health_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL CHECK (type IN ('injury', 'pain', 'note')),
      body_area TEXT NOT NULL,
      severity INTEGER DEFAULT 3 CHECK (severity >= 1 AND severity <= 10),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'resolved')),
      reported_at TEXT NOT NULL,
      resolved_at TEXT DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exercise_feedback (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
      exercise_name TEXT NOT NULL,
      rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
      difficulty TEXT CHECK (difficulty IN ('too_easy', 'easy', 'just_right', 'hard', 'too_hard')),
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
