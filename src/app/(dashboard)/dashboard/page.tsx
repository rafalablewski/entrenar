import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Link from "next/link";
import { allExercises } from "@/lib/exercises";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) return null;

  const sql = getDb();
  const exerciseCount = allExercises.length;

  if (user.role === "trainer") {
    const athleteRows = await sql`SELECT COUNT(*) as count FROM athletes WHERE trainer_id = ${user.id}`;
    const athleteCount = Number(athleteRows[0].count);

    const endeavourRows = await sql`SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ${user.id}`;
    const endeavourCount = Number(endeavourRows[0].count);

    const activeRows = await sql`SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ${user.id} AND status = 'active'`;
    const activeEndeavours = Number(activeRows[0].count);

    const upcomingEndeavours = await sql`SELECT * FROM endeavours WHERE trainer_id = ${user.id} AND status IN ('planning', 'active') ORDER BY target_date LIMIT 5` as Array<{ id: string; title: string; target_date: string; status: string }>;

    const stats = [
      { label: "Athletes", value: athleteCount, href: "/athletes", color: "#00F0FF", glow: "rgba(0,240,255,0.15)" },
      { label: "Endeavours", value: endeavourCount, href: "/endeavours", color: "#A855F7", glow: "rgba(168,85,247,0.15)" },
      { label: "Active", value: activeEndeavours, href: "/endeavours", color: "#00FF88", glow: "rgba(0,255,136,0.15)" },
      { label: "Exercises", value: exerciseCount, href: "/exercises", color: "#FF6B35", glow: "rgba(255,107,53,0.15)" },
    ];

    return (
      <div>
        <div className="mb-10">
          <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>
            {user.name}
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Trainer Dashboard</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="card p-6 group border-gradient">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                {stat.label}
              </p>
              <p className="text-[36px] font-bold tracking-[-0.03em] transition-all group-hover:scale-105"
                style={{ color: stat.color, textShadow: `0 0 30px ${stat.glow}` }}>
                {stat.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold tracking-[-0.01em]" style={{ color: "rgba(255,255,255,0.85)" }}>
              Upcoming Endeavours
            </h2>
            <Link href="/endeavours" className="text-[11px] font-semibold hover:underline" style={{ color: "#00F0FF" }}>
              View all
            </Link>
          </div>
          {upcomingEndeavours.length === 0 ? (
            <p className="text-[13px] py-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              No upcoming endeavours.{" "}
              <Link href="/endeavours" className="font-medium hover:underline" style={{ color: "#00F0FF" }}>
                Create one
              </Link>
            </p>
          ) : (
            <div className="space-y-0">
              {upcomingEndeavours.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: i < upcomingEndeavours.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{e.title}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(e.target_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`badge badge-${e.status}`}>{e.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Athlete dashboard
  const athleteRows = await sql`SELECT id FROM athletes WHERE user_id = ${user.id}`;
  const athlete = athleteRows[0] as { id: string } | undefined;

  let planCount = 0;
  let sessionCount = 0;
  let upcomingSessions: Array<{ id: string; title: string; date: string; plan_title: string }> = [];

  if (athlete) {
    const planRows = await sql`SELECT COUNT(*) as count FROM training_plans WHERE athlete_id = ${athlete.id}`;
    planCount = Number(planRows[0].count);

    const sessionRows = await sql`SELECT COUNT(*) as count FROM training_sessions ts
         JOIN training_plans tp ON ts.plan_id = tp.id
         WHERE tp.athlete_id = ${athlete.id} AND ts.status = 'completed'`;
    sessionCount = Number(sessionRows[0].count);

    upcomingSessions = await sql`SELECT ts.*, tp.title as plan_title FROM training_sessions ts
         JOIN training_plans tp ON ts.plan_id = tp.id
         WHERE tp.athlete_id = ${athlete.id} AND ts.status = 'scheduled'
         ORDER BY ts.date LIMIT 5` as Array<{ id: string; title: string; date: string; plan_title: string }>;
  }

  const athleteStats = [
    { label: "Plans", value: planCount, href: "/training-plans", color: "#00F0FF", glow: "rgba(0,240,255,0.15)" },
    { label: "Completed", value: sessionCount, href: "/sessions", color: "#00FF88", glow: "rgba(0,255,136,0.15)" },
    { label: "Exercises", value: exerciseCount, href: "/exercises", color: "#FF6B35", glow: "rgba(255,107,53,0.15)" },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[32px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>
          {user.name}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Athlete Dashboard</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {athleteStats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-6 group border-gradient">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              {stat.label}
            </p>
            <p className="text-[36px] font-bold tracking-[-0.03em] transition-all group-hover:scale-105"
              style={{ color: stat.color, textShadow: `0 0 30px ${stat.glow}` }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-[15px] font-bold tracking-[-0.01em] mb-5" style={{ color: "rgba(255,255,255,0.85)" }}>
          Upcoming Sessions
        </h2>
        {upcomingSessions.length === 0 ? (
          <p className="text-[13px] py-4" style={{ color: "rgba(255,255,255,0.3)" }}>No upcoming sessions scheduled.</p>
        ) : (
          <div className="space-y-0">
            {upcomingSessions.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-4"
                style={{ borderBottom: i < upcomingSessions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{s.title}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {s.plan_title} &middot; {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <Link href="/sessions" className="text-[11px] font-semibold hover:underline" style={{ color: "#00F0FF" }}>
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
