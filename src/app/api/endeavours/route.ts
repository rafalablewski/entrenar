import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();

  if (user.role === "trainer") {
    const endeavours = await sql`SELECT * FROM endeavours WHERE trainer_id = ${user.id} ORDER BY target_date`;

    // Get athlete assignments for each endeavour
    const enriched = [];
    for (const e of endeavours) {
      const athletes = await sql`SELECT a.id, u.name FROM endeavour_athletes ea
           JOIN athletes a ON ea.athlete_id = a.id
           JOIN users u ON a.user_id = u.id
           WHERE ea.endeavour_id = ${e.id}`;
      enriched.push({ ...e, athletes });
    }

    return NextResponse.json({ endeavours: enriched });
  } else {
    // Athletes see endeavours they're assigned to
    const athleteRows = await sql`SELECT id FROM athletes WHERE user_id = ${user.id}`;
    const athlete = athleteRows[0] as { id: string } | undefined;

    if (!athlete) return NextResponse.json({ endeavours: [] });

    const endeavours = await sql`SELECT e.* FROM endeavours e
         JOIN endeavour_athletes ea ON e.id = ea.endeavour_id
         WHERE ea.athlete_id = ${athlete.id}
         ORDER BY e.target_date`;

    return NextResponse.json({ endeavours });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, target_date, athlete_ids } = await req.json();
  if (!title || !target_date) {
    return NextResponse.json({ error: "Title and target date are required" }, { status: 400 });
  }

  const sql = getDb();
  const id = uuidv4();

  await sql`INSERT INTO endeavours (id, trainer_id, title, description, target_date) VALUES (${id}, ${user.id}, ${title}, ${description || ""}, ${target_date})`;

  if (athlete_ids && athlete_ids.length > 0) {
    for (const athleteId of athlete_ids) {
      await sql`INSERT INTO endeavour_athletes (endeavour_id, athlete_id) VALUES (${id}, ${athleteId})`;
    }
  }

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, title, description, target_date, status, athlete_ids } = await req.json();
  const sql = getDb();

  await sql`UPDATE endeavours SET title = ${title}, description = ${description || ""}, target_date = ${target_date}, status = ${status || "planning"} WHERE id = ${id} AND trainer_id = ${user.id}`;

  if (athlete_ids !== undefined) {
    await sql`DELETE FROM endeavour_athletes WHERE endeavour_id = ${id}`;
    for (const athleteId of athlete_ids) {
      await sql`INSERT INTO endeavour_athletes (endeavour_id, athlete_id) VALUES (${id}, ${athleteId})`;
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const sql = getDb();
  await sql`DELETE FROM endeavours WHERE id = ${id} AND trainer_id = ${user.id}`;
  return NextResponse.json({ success: true });
}
