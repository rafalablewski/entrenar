import { NextResponse } from "next/server";
import { getDb, initializeDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  await initializeDb();

  const sql = getDb();

  // Check if admin already exists
  const existing = await sql`SELECT id FROM users WHERE email = 'admin@admin.com'`;
  if (existing.length > 0) {
    return NextResponse.json({ message: "Admin account already exists. Login with admin@admin.com / admin" });
  }

  const id = uuidv4();
  const hash = await bcrypt.hash("admin", 10);
  await sql`INSERT INTO users (id, email, name, password_hash, role) VALUES (${id}, ${"admin@admin.com"}, ${"Admin"}, ${hash}, ${"trainer"})`;

  return NextResponse.json({
    message: "Admin account created!",
    email: "admin@admin.com",
    password: "admin",
    role: "trainer",
  });
}
