import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getDb();

  let reports;

  if (user.role === "trainer") {
    // Trainers see reports from all their athletes
    reports = await sql`
      SELECT hr.*, u.name as user_name
      FROM health_reports hr
      JOIN users u ON hr.user_id = u.id
      WHERE hr.user_id IN (
        SELECT a.user_id FROM athletes a WHERE a.trainer_id = ${user.id}
      )
      ORDER BY hr.reported_at DESC
    `;
  } else {
    // Athletes see their own reports
    reports = await sql`
      SELECT hr.*, u.name as user_name
      FROM health_reports hr
      JOIN users u ON hr.user_id = u.id
      WHERE hr.user_id = ${user.id}
      ORDER BY hr.reported_at DESC
    `;
  }

  return NextResponse.json({ reports });
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, body_area, severity, title, description, reported_at } = await req.json();
  if (!type || !body_area || !title || !reported_at) {
    return NextResponse.json({ error: "Type, body area, title, and date are required" }, { status: 400 });
  }

  const sql = getDb();
  const id = uuidv4();
  await sql`
    INSERT INTO health_reports (id, user_id, type, body_area, severity, title, description, reported_at)
    VALUES (${id}, ${user.id}, ${type}, ${body_area}, ${severity || 3}, ${title}, ${description || ""}, ${reported_at})
  `;

  return NextResponse.json({ id });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, resolved_at, severity, description } = await req.json();
  const sql = getDb();

  await sql`
    UPDATE health_reports
    SET status = ${status || "active"},
        resolved_at = ${resolved_at || null},
        severity = ${severity || 3},
        description = ${description || ""}
    WHERE id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const sql = getDb();
  await sql`DELETE FROM health_reports WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
