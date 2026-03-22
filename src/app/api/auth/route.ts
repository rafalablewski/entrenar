import { NextRequest, NextResponse } from "next/server";
import { loginUser, registerUser, createSession, destroySession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "login") {
    const { email, password } = body;
    const user = await loginUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ user });
  }

  if (action === "register") {
    const { name, email, password, role, trainerEmail } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    if (role === "athlete") {
      if (!trainerEmail) {
        return NextResponse.json({ error: "Trainer email is required for athletes" }, { status: 400 });
      }
      const trainer = db.prepare("SELECT id FROM users WHERE email = ? AND role = 'trainer'").get(trainerEmail) as { id: string } | undefined;
      if (!trainer) {
        return NextResponse.json({ error: "Trainer not found. Ask your trainer to register first." }, { status: 400 });
      }
    }

    try {
      const user = await registerUser(email, password, name, role);

      if (role === "athlete" && trainerEmail) {
        const trainer = db.prepare("SELECT id FROM users WHERE email = ? AND role = 'trainer'").get(trainerEmail) as { id: string };
        db.prepare("INSERT INTO athletes (id, user_id, trainer_id) VALUES (?, ?, ?)").run(
          uuidv4(),
          user.id,
          trainer.id
        );
      }

      await createSession(user.id);
      return NextResponse.json({ user });
    } catch {
      return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
  }

  if (action === "logout") {
    await destroySession();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
