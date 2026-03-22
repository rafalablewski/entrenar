import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const endeavourId = req.nextUrl.searchParams.get("endeavour_id");
  const athleteId = req.nextUrl.searchParams.get("athlete_id");

  let query = `
    SELECT tp.*, u.name as athlete_name, e.title as endeavour_title
    FROM training_plans tp
    JOIN athletes a ON tp.athlete_id = a.id
    JOIN users u ON a.user_id = u.id
    JOIN endeavours e ON tp.endeavour_id = e.id
  `;
  const params: string[] = [];

  if (user.role === "trainer") {
    query += " WHERE e.trainer_id = ?";
    params.push(user.id);
  } else {
    const athlete = db.prepare("SELECT id FROM athletes WHERE user_id = ?").get(user.id) as { id: string } | undefined;
    if (!athlete) return NextResponse.json({ plans: [] });
    query += " WHERE tp.athlete_id = ?";
    params.push(athlete.id);
  }

  if (endeavourId) {
    query += " AND tp.endeavour_id = ?";
    params.push(endeavourId);
  }
  if (athleteId) {
    query += " AND tp.athlete_id = ?";
    params.push(athleteId);
  }

  query += " ORDER BY tp.start_date";
  const plans = db.prepare(query).all(...params);
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { endeavour_id, athlete_id, title, description, start_date, end_date } = await req.json();
  if (!endeavour_id || !athlete_id || !title || !start_date || !end_date) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const db = getDb();
  const id = uuidv4();
  db.prepare(
    "INSERT INTO training_plans (id, endeavour_id, athlete_id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, endeavour_id, athlete_id, title, description || "", start_date, end_date);

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, start_date, end_date } = await req.json();
  const db = getDb();
  db.prepare(
    "UPDATE training_plans SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?"
  ).run(title, description || "", start_date, end_date, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const db = getDb();
  db.prepare("DELETE FROM training_plans WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
