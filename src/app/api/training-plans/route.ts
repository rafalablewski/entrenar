import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();
  const endeavourId = req.nextUrl.searchParams.get("endeavour_id");
  const athleteId = req.nextUrl.searchParams.get("athlete_id");

  let plans;

  if (user.role === "trainer") {
    plans = await sql`
      SELECT tp.*, u.name as athlete_name, e.title as endeavour_title
      FROM training_plans tp
      JOIN athletes a ON tp.athlete_id = a.id
      JOIN users u ON a.user_id = u.id
      JOIN endeavours e ON tp.endeavour_id = e.id
      WHERE e.trainer_id = ${user.id}
      ORDER BY tp.start_date
    `;
  } else {
    const athletes = await sql`SELECT id FROM athletes WHERE user_id = ${user.id}`;
    if (athletes.length === 0) return NextResponse.json({ plans: [] });
    const athlete = athletes[0];

    plans = await sql`
      SELECT tp.*, u.name as athlete_name, e.title as endeavour_title
      FROM training_plans tp
      JOIN athletes a ON tp.athlete_id = a.id
      JOIN users u ON a.user_id = u.id
      JOIN endeavours e ON tp.endeavour_id = e.id
      WHERE tp.athlete_id = ${athlete.id}
      ORDER BY tp.start_date
    `;
  }

  if (endeavourId) {
    plans = plans.filter((p: any) => p.endeavour_id === endeavourId);
  }
  if (athleteId) {
    plans = plans.filter((p: any) => p.athlete_id === athleteId);
  }

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

  const sql = getDb();
  const id = uuidv4();
  await sql`
    INSERT INTO training_plans (id, endeavour_id, athlete_id, title, description, start_date, end_date)
    VALUES (${id}, ${endeavour_id}, ${athlete_id}, ${title}, ${description || ""}, ${start_date}, ${end_date})
  `;

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, start_date, end_date } = await req.json();
  const sql = getDb();
  await sql`
    UPDATE training_plans
    SET title = ${title}, description = ${description || ""}, start_date = ${start_date}, end_date = ${end_date}
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const sql = getDb();
  await sql`DELETE FROM training_plans WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
