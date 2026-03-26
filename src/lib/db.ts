import { neon, NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false>;
let dbInitialized = false;

export function getDb() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    sql = neon(databaseUrl);
  }
  return sql;
}

export async function ensureDb() {
  if (dbInitialized) return;
  const db = getDb();
  await db`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  dbInitialized = true;
}
