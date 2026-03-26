import { NextRequest, NextResponse } from "next/server";
import { getDb, ensureDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDb();
    const sql = getDb();
    const notes = await sql`
      SELECT id, title, content, created_at, updated_at
      FROM notes
      ORDER BY updated_at DESC
    `;
    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const sql = getDb();
    const body = await req.json();
    const { title, content } = body;

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      (!title.trim() && !content.trim())
    ) {
      return NextResponse.json(
        { error: "Title and content cannot both be empty" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const [note] = await sql`
      INSERT INTO notes (id, title, content)
      VALUES (${id}, ${title}, ${content})
      RETURNING id, title, content, created_at, updated_at
    `;
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureDb();
    const sql = getDb();
    const body = await req.json();
    const { id, title, content } = body;

    if (
      !id ||
      typeof title !== "string" ||
      typeof content !== "string" ||
      (!title.trim() && !content.trim())
    ) {
      return NextResponse.json(
        { error: "id required; title and content cannot both be empty" },
        { status: 400 }
      );
    }

    const [note] = await sql`
      UPDATE notes
      SET title = ${title}, content = ${content}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, title, content, created_at, updated_at
    `;
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    console.error("PUT /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureDb();
    const sql = getDb();
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id query param is required" },
        { status: 400 }
      );
    }

    const [deleted] = await sql`
      DELETE FROM notes WHERE id = ${id} RETURNING id
    `;
    if (!deleted) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/notes error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
