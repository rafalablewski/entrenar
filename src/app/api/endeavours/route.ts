import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();

  if (user.role === "trainer") {
    const endeavours = db
      .prepare("SELECT * FROM endeavours WHERE trainer_id = ? ORDER BY target_date")
      .all(user.id);

    // Get athlete assignments for each endeavour
    const enriched = (endeavours as Array<Record<string, unknown>>).map((e) => {
      const athletes = db
        .prepare(
          `SELECT a.id, u.name FROM endeavour_athletes ea
           JOIN athletes a ON ea.athlete_id = a.id
           JOIN users u ON a.user_id = u.id
           WHERE ea.endeavour_id = ?`
        )
        .all(e.id as string);
      return { ...e, athletes };
    });

    return NextResponse.json({ endeavours: enriched });
  } else {
    // Athletes see endeavours they're assigned to
    const athlete = db
      .prepare("SELECT id FROM athletes WHERE user_id = ?")
      .get(user.id) as { id: string } | undefined;

    if (!athlete) return NextResponse.json({ endeavours: [] });

    const endeavours = db
      .prepare(
        `SELECT e.* FROM endeavours e
         JOIN endeavour_athletes ea ON e.id = ea.endeavour_id
         WHERE ea.athlete_id = ?
         ORDER BY e.target_date`
      )
      .all(athlete.id);

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

  const db = getDb();
  const id = uuidv4();

  db.prepare(
    "INSERT INTO endeavours (id, trainer_id, title, description, target_date) VALUES (?, ?, ?, ?, ?)"
  ).run(id, user.id, title, description || "", target_date);

  if (athlete_ids && athlete_ids.length > 0) {
    const insert = db.prepare("INSERT INTO endeavour_athletes (endeavour_id, athlete_id) VALUES (?, ?)");
    for (const athleteId of athlete_ids) {
      insert.run(id, athleteId);
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
  const db = getDb();

  db.prepare(
    "UPDATE endeavours SET title = ?, description = ?, target_date = ?, status = ? WHERE id = ? AND trainer_id = ?"
  ).run(title, description || "", target_date, status || "planning", id, user.id);

  if (athlete_ids !== undefined) {
    db.prepare("DELETE FROM endeavour_athletes WHERE endeavour_id = ?").run(id);
    const insert = db.prepare("INSERT INTO endeavour_athletes (endeavour_id, athlete_id) VALUES (?, ?)");
    for (const athleteId of athlete_ids) {
      insert.run(id, athleteId);
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
  const db = getDb();
  db.prepare("DELETE FROM endeavours WHERE id = ? AND trainer_id = ?").run(id, user.id);
  return NextResponse.json({ success: true });
}
