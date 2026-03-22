import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const planId = req.nextUrl.searchParams.get("plan_id");

  let query = `
    SELECT ts.*, tp.title as plan_title
    FROM training_sessions ts
    JOIN training_plans tp ON ts.plan_id = tp.id
    JOIN endeavours e ON tp.endeavour_id = e.id
  `;
  const params: string[] = [];

  if (user.role === "trainer") {
    query += " WHERE e.trainer_id = ?";
    params.push(user.id);
  } else {
    const athlete = db.prepare("SELECT id FROM athletes WHERE user_id = ?").get(user.id) as { id: string } | undefined;
    if (!athlete) return NextResponse.json({ sessions: [] });
    query += " WHERE tp.athlete_id = ?";
    params.push(athlete.id);
  }

  if (planId) {
    query += " AND ts.plan_id = ?";
    params.push(planId);
  }

  query += " ORDER BY ts.date DESC";
  const sessions = db.prepare(query).all(...params);
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan_id, date, title, description, exercises } = await req.json();
  if (!plan_id || !date || !title) {
    return NextResponse.json({ error: "Plan, date, and title are required" }, { status: 400 });
  }

  const db = getDb();
  const id = uuidv4();
  db.prepare(
    "INSERT INTO training_sessions (id, plan_id, date, title, description, exercises) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, plan_id, date, title, description || "", JSON.stringify(exercises || []));

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, description, exercises, status, notes } = await req.json();
  const db = getDb();

  db.prepare(
    "UPDATE training_sessions SET title = ?, description = ?, exercises = ?, status = ?, notes = ? WHERE id = ?"
  ).run(
    title,
    description || "",
    JSON.stringify(exercises || []),
    status || "scheduled",
    notes || "",
    id
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM training_sessions WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
