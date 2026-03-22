import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Link from "next/link";
import { allExercises } from "@/lib/exercises";

interface CountRow {
  count: number;
}

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) return null;

  const db = getDb();
  const exerciseCount = allExercises.length;

  if (user.role === "trainer") {
    const athleteCount = (db.prepare("SELECT COUNT(*) as count FROM athletes WHERE trainer_id = ?").get(user.id) as CountRow).count;
    const endeavourCount = (db.prepare("SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ?").get(user.id) as CountRow).count;
    const activeEndeavours = (db.prepare("SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ? AND status = 'active'").get(user.id) as CountRow).count;

    const upcomingEndeavours = db.prepare(
      "SELECT * FROM endeavours WHERE trainer_id = ? AND status IN ('planning', 'active') ORDER BY target_date LIMIT 5"
    ).all(user.id) as Array<{ id: string; title: string; target_date: string; status: string }>;

    return (
      <div>
        <div className="mb-10">
          <h1 className="text-[28px] font-semibold tracking-tight">
            {user.name}
          </h1>
          <p className="text-[14px] text-[#9CA3AF] mt-1">Trainer Dashboard</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Athletes", value: athleteCount, href: "/athletes", color: "#0071E3" },
            { label: "Endeavours", value: endeavourCount, href: "/endeavours", color: "#8B5CF6" },
            { label: "Active", value: activeEndeavours, href: "/endeavours", color: "#10B981" },
            { label: "Exercises", value: exerciseCount, href: "/exercises", color: "#F59E0B" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="card p-5 group">
              <p className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="text-[32px] font-semibold tracking-tight" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-semibold tracking-tight">Upcoming Endeavours</h2>
            <Link href="/endeavours" className="text-[12px] text-[#0071E3] hover:underline">
              View all
            </Link>
          </div>
          {upcomingEndeavours.length === 0 ? (
            <p className="text-[13px] text-[#9CA3AF] py-4">
              No upcoming endeavours.{" "}
              <Link href="/endeavours" className="text-[#0071E3] hover:underline">
                Create one
              </Link>
            </p>
          ) : (
            <div className="space-y-0">
              {upcomingEndeavours.map((e, i) => (
                <div
                  key={e.id}
                  className={`flex items-center justify-between py-3.5 ${
                    i < upcomingEndeavours.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""
                  }`}
                >
                  <div>
                    <p className="text-[14px] font-medium">{e.title}</p>
                    <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                      {new Date(e.target_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      e.status === "active"
                        ? "bg-[#ECFDF5] text-[#059669]"
                        : "bg-[#FFF7ED] text-[#D97706]"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Athlete dashboard
  const athlete = db.prepare("SELECT id FROM athletes WHERE user_id = ?").get(user.id) as { id: string } | undefined;

  const planCount = athlete
    ? (db.prepare("SELECT COUNT(*) as count FROM training_plans WHERE athlete_id = ?").get(athlete.id) as CountRow).count
    : 0;

  const sessionCount = athlete
    ? (db.prepare(
        `SELECT COUNT(*) as count FROM training_sessions ts
         JOIN training_plans tp ON ts.plan_id = tp.id
         WHERE tp.athlete_id = ? AND ts.status = 'completed'`
      ).get(athlete.id) as CountRow).count
    : 0;

  const upcomingSessions = athlete
    ? db.prepare(
        `SELECT ts.*, tp.title as plan_title FROM training_sessions ts
         JOIN training_plans tp ON ts.plan_id = tp.id
         WHERE tp.athlete_id = ? AND ts.status = 'scheduled'
         ORDER BY ts.date LIMIT 5`
      ).all(athlete.id) as Array<{ id: string; title: string; date: string; plan_title: string }>
    : [];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-[28px] font-semibold tracking-tight">{user.name}</h1>
        <p className="text-[14px] text-[#9CA3AF] mt-1">Athlete Dashboard</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Plans", value: planCount, href: "/training-plans", color: "#0071E3" },
          { label: "Completed", value: sessionCount, href: "/sessions", color: "#10B981" },
          { label: "Exercises", value: exerciseCount, href: "/exercises", color: "#F59E0B" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-5 group">
            <p className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">
              {stat.label}
            </p>
            <p className="text-[32px] font-semibold tracking-tight" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-[15px] font-semibold tracking-tight mb-5">Upcoming Sessions</h2>
        {upcomingSessions.length === 0 ? (
          <p className="text-[13px] text-[#9CA3AF] py-4">No upcoming sessions scheduled.</p>
        ) : (
          <div className="space-y-0">
            {upcomingSessions.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center justify-between py-3.5 ${
                  i < upcomingSessions.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""
                }`}
              >
                <div>
                  <p className="text-[14px] font-medium">{s.title}</p>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    {s.plan_title} &middot; {new Date(s.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Link href="/sessions" className="text-[12px] text-[#0071E3] hover:underline">
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
