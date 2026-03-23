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
    return <TrainerDashboard user={user} sql={sql} exerciseCount={exerciseCount} />;
  }

  return <AthleteDashboard user={user} sql={sql} exerciseCount={exerciseCount} />;
}

async function TrainerDashboard({ user, sql, exerciseCount }: { user: { id: string; name: string }; sql: ReturnType<typeof getDb>; exerciseCount: number }) {
  const athleteRows = await sql`SELECT COUNT(*) as count FROM athletes WHERE trainer_id = ${user.id}`;
  const athleteCount = Number(athleteRows[0].count);

  const endeavourRows = await sql`SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ${user.id}`;
  const endeavourCount = Number(endeavourRows[0].count);

  const activeRows = await sql`SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ${user.id} AND status = 'active'`;
  const activeEndeavours = Number(activeRows[0].count);

  const upcomingEndeavours = await sql`SELECT * FROM endeavours WHERE trainer_id = ${user.id} AND status IN ('planning', 'active') ORDER BY target_date LIMIT 5` as Array<{ id: string; title: string; target_date: string; status: string }>;

  const stats = [
    { label: "Athletes", value: athleteCount, href: "/athletes", color: "#00F0FF", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" },
    { label: "Endeavours", value: endeavourCount, href: "/endeavours", color: "#A855F7", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Active", value: activeEndeavours, href: "/endeavours", color: "#00FF88", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
    { label: "Exercises", value: exerciseCount, href: "/exercises", color: "#FF6B35", icon: "M4 6h16M4 12h16M4 18h16" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.6s ease" }}>
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "#00F0FF" }}>
          Trainer Dashboard
        </p>
        <h1 className="text-[36px] font-bold tracking-[-0.04em]" style={{ color: "rgba(255,255,255,0.95)" }}>
          Welcome back, {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.25)" }}>
                {stat.label}
              </p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}20` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
            </div>
            <p className="text-[40px] font-bold tracking-[-0.04em] transition-all group-hover:scale-105"
              style={{ color: stat.color, textShadow: `0 0 40px ${stat.color}25` }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Endeavours */}
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
            <div className="py-8 text-center">
              <p className="text-[13px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>No upcoming endeavours</p>
              <Link href="/endeavours" className="text-[12px] font-semibold" style={{ color: "#00F0FF" }}>
                Create one
              </Link>
            </div>
          ) : (
            <div>
              {upcomingEndeavours.map((e, i) => (
                <div key={e.id} className="flex items-center justify-between py-4"
                  style={{ borderBottom: i < upcomingEndeavours.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
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

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-[15px] font-bold tracking-[-0.01em] mb-5" style={{ color: "rgba(255,255,255,0.85)" }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: "Browse Exercise Atlas", desc: "250+ exercises with anatomy", href: "/exercises", color: "#00F0FF" },
              { label: "Create Training Plan", desc: "AI-powered periodized programs", href: "/training-plans", color: "#A855F7" },
              { label: "Log a Session", desc: "Track workouts with RPE feedback", href: "/sessions", color: "#00FF88" },
              { label: "Health Reports", desc: "Track injuries and recovery", href: "/health", color: "#FF6B35" },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className="flex items-center justify-between p-4 rounded-2xl transition-all hover:translate-x-1"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{a.label}</p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{a.desc}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function AthleteDashboard({ user, sql, exerciseCount }: { user: { id: string; name: string }; sql: ReturnType<typeof getDb>; exerciseCount: number }) {
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

  const stats = [
    { label: "Plans", value: planCount, href: "/training-plans", color: "#00F0FF" },
    { label: "Completed", value: sessionCount, href: "/sessions", color: "#00FF88" },
    { label: "Exercises", value: exerciseCount, href: "/exercises", color: "#FF6B35" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.6s ease" }}>
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "#00FF88" }}>
          Athlete Dashboard
        </p>
        <h1 className="text-[36px] font-bold tracking-[-0.04em]" style={{ color: "rgba(255,255,255,0.95)" }}>
          Welcome back, {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="stat-card group">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
              {stat.label}
            </p>
            <p className="text-[40px] font-bold tracking-[-0.04em] transition-all group-hover:scale-105"
              style={{ color: stat.color, textShadow: `0 0 40px ${stat.color}25` }}>
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
          <div>
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
