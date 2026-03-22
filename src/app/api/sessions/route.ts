import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const planId = req.nextUrl.searchParams.get("plan_id");

  let sessions;

  if (user.role === "trainer") {
    sessions = await sql`
      SELECT ts.*, tp.title as plan_title
      FROM training_sessions ts
      JOIN training_plans tp ON ts.plan_id = tp.id
      JOIN endeavours e ON tp.endeavour_id = e.id
      WHERE e.trainer_id = ${user.id}
      ORDER BY ts.date DESC
    `;
  } else {
    const athletes = await sql`SELECT id FROM athletes WHERE user_id = ${user.id}`;
    if (athletes.length === 0) return NextResponse.json({ sessions: [] });
    const athlete = athletes[0];

    sessions = await sql`
      SELECT ts.*, tp.title as plan_title
      FROM training_sessions ts
      JOIN training_plans tp ON ts.plan_id = tp.id
      WHERE tp.athlete_id = ${athlete.id}
      ORDER BY ts.date DESC
    `;
  }

  if (planId) {
    sessions = sessions.filter((s: any) => s.plan_id === planId);
  }

  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan_id, date, title, description, exercises } = await req.json();
  if (!plan_id || !date || !title) {
    return NextResponse.json({ error: "Plan, date, and title are required" }, { status: 400 });
  }

  const sql = getDb();
  const id = uuidv4();
  await sql`
    INSERT INTO training_sessions (id, plan_id, date, title, description, exercises)
    VALUES (${id}, ${plan_id}, ${date}, ${title}, ${description || ""}, ${JSON.stringify(exercises || [])})
  `;

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, description, exercises, status, notes } = await req.json();
  const sql = getDb();

  await sql`
    UPDATE training_sessions
    SET title = ${title}, description = ${description || ""}, exercises = ${JSON.stringify(exercises || [])},
        status = ${status || "scheduled"}, notes = ${notes || ""}
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const sql = getDb();
  await sql`DELETE FROM training_sessions WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
