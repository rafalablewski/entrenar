import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const sql = getDb();
  const feedback = await sql`
    SELECT * FROM exercise_feedback
    WHERE session_id = ${sessionId}
    ORDER BY created_at ASC
  `;

  return NextResponse.json({ feedback });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { session_id, exercise_name, rpe, difficulty, notes } = await req.json();
  if (!session_id || !exercise_name) {
    return NextResponse.json({ error: "session_id and exercise_name are required" }, { status: 400 });
  }

  const sql = getDb();
  const id = uuidv4();
  await sql`
    INSERT INTO exercise_feedback (id, session_id, exercise_name, rpe, difficulty, notes)
    VALUES (${id}, ${session_id}, ${exercise_name}, ${rpe || null}, ${difficulty || null}, ${notes || ""})
  `;

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, rpe, difficulty, notes } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const sql = getDb();
  await sql`
    UPDATE exercise_feedback
    SET rpe = ${rpe || null}, difficulty = ${difficulty || null}, notes = ${notes || ""}
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const sql = getDb();
  await sql`DELETE FROM exercise_feedback WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
