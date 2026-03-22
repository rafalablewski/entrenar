import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  if (user.role === "trainer") {
    const athletes = db
      .prepare(
        `SELECT a.id, a.user_id, a.trainer_id, a.sport, a.notes, a.created_at,
                u.name, u.email
         FROM athletes a JOIN users u ON a.user_id = u.id
         WHERE a.trainer_id = ?
         ORDER BY u.name`
      )
      .all(user.id);
    return NextResponse.json({ athletes });
  } else {
    // Athlete sees own profile
    const athlete = db
      .prepare(
        `SELECT a.id, a.user_id, a.trainer_id, a.sport, a.notes, a.created_at,
                u.name, u.email
         FROM athletes a JOIN users u ON a.user_id = u.id
         WHERE a.user_id = ?`
      )
      .all(user.id);
    return NextResponse.json({ athletes: athlete });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, sport, notes } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const db = getDb();

  // Check if user already exists
  let athleteUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: string } | undefined;

  if (!athleteUser) {
    // Create a placeholder user account for the athlete
    const id = uuidv4();
    const bcrypt = await import("bcryptjs");
    const tempHash = await bcrypt.hash("changeme123", 10);
    db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, 'athlete')").run(
      id, email, name, tempHash
    );
    athleteUser = { id };
  }

  const athleteId = uuidv4();
  try {
    db.prepare("INSERT INTO athletes (id, user_id, trainer_id, sport, notes) VALUES (?, ?, ?, ?, ?)").run(
      athleteId, athleteUser.id, user.id, sport || "", notes || ""
    );
  } catch {
    return NextResponse.json({ error: "This athlete is already assigned to a trainer" }, { status: 400 });
  }

  return NextResponse.json({ id: athleteId });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, sport, notes } = await req.json();
  const db = getDb();

  db.prepare("UPDATE athletes SET sport = ?, notes = ? WHERE id = ?").run(sport || "", notes || "", id);
  return NextResponse.json({ success: true });
}
