import { cookies } from "next/headers";
import { getDb } from "./db";
import { User } from "@/types";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE = "entrenar_session";

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const sql = getDb();

  const sessions = await sql`SELECT user_id FROM sessions WHERE id = ${sessionId}`;
  if (sessions.length === 0) return null;

  const users = await sql`SELECT id, email, name, role, created_at FROM users WHERE id = ${sessions[0].user_id}`;
  if (users.length === 0) return null;

  return users[0] as unknown as User;
}

export async function createSession(userId: string): Promise<string> {
  const sql = getDb();
  const sessionId = uuidv4();

  await sql`INSERT INTO sessions (id, user_id) VALUES (${sessionId}, ${userId})`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return sessionId;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    const sql = getDb();
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: "trainer" | "athlete"
): Promise<User> {
  const sql = getDb();
  const id = uuidv4();
  const passwordHash = await bcrypt.hash(password, 10);

  await sql`INSERT INTO users (id, email, name, password_hash, role) VALUES (${id}, ${email}, ${name}, ${passwordHash}, ${role})`;

  return { id, email, name, role, created_at: new Date().toISOString() };
}

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  const sql = getDb();
  const users = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (users.length === 0) return null;

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) return null;

  return {
    id: user.id as string,
    email: user.email as string,
    name: user.name as string,
    role: user.role as "trainer" | "athlete",
    created_at: user.created_at as string,
  };
}
