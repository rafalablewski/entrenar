import { cookies } from "next/headers";
import { getDb } from "./db";
import { User } from "@/types";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE = "entrenar_session";

interface SessionRow {
  user_id: string;
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const db = getDb();

  // Ensure session table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const session = db
    .prepare("SELECT user_id FROM sessions WHERE id = ?")
    .get(sessionId) as SessionRow | undefined;
  if (!session) return null;

  const user = db
    .prepare("SELECT id, email, name, role, created_at FROM users WHERE id = ?")
    .get(session.user_id) as User | undefined;

  return user || null;
}

export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const sessionId = uuidv4();
  db.prepare("INSERT INTO sessions (id, user_id) VALUES (?, ?)").run(
    sessionId,
    userId
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return sessionId;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    const db = getDb();
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "trainer" | "athlete"
): Promise<User> {
  const db = getDb();
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  db.prepare(
    "INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)"
  ).run(id, email, name, passwordHash, role);

  return { id, email, name, role, created_at: new Date().toISOString() };
}

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | (User & { password_hash: string })
    | undefined;

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.name, role: user.role, created_at: user.created_at };
}
