import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import Link from "next/link";

interface CountRow {
  count: number;
}

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) return null;

  const db = getDb();

  if (user.role === "trainer") {
    const athleteCount = (db.prepare("SELECT COUNT(*) as count FROM athletes WHERE trainer_id = ?").get(user.id) as CountRow).count;
    const endeavourCount = (db.prepare("SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ?").get(user.id) as CountRow).count;
    const activeEndeavours = (db.prepare("SELECT COUNT(*) as count FROM endeavours WHERE trainer_id = ? AND status = 'active'").get(user.id) as CountRow).count;

    const upcomingEndeavours = db.prepare(
      "SELECT * FROM endeavours WHERE trainer_id = ? AND status IN ('planning', 'active') ORDER BY target_date LIMIT 5"
    ).all(user.id) as Array<{ id: string; title: string; target_date: string; status: string }>;

    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">Athletes</p>
            <p className="text-3xl font-bold text-blue-600">{athleteCount}</p>
            <Link href="/athletes" className="text-sm text-blue-500 hover:underline mt-2 block">
              View all
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">Endeavours</p>
            <p className="text-3xl font-bold text-indigo-600">{endeavourCount}</p>
            <Link href="/endeavours" className="text-sm text-indigo-500 hover:underline mt-2 block">
              View all
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">Active Endeavours</p>
            <p className="text-3xl font-bold text-green-600">{activeEndeavours}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Endeavours</h2>
          {upcomingEndeavours.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No upcoming endeavours.{" "}
              <Link href="/endeavours" className="text-blue-500 hover:underline">
                Create one
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingEndeavours.map((e) => (
                <div key={e.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-gray-500">Target: {new Date(e.target_date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      e.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
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
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-1">Training Plans</p>
          <p className="text-3xl font-bold text-blue-600">{planCount}</p>
          <Link href="/training-plans" className="text-sm text-blue-500 hover:underline mt-2 block">
            View plans
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500 mb-1">Completed Sessions</p>
          <p className="text-3xl font-bold text-green-600">{sessionCount}</p>
          <Link href="/sessions" className="text-sm text-green-500 hover:underline mt-2 block">
            View sessions
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming sessions scheduled.</p>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-gray-500">
                    {s.plan_title} &middot; {new Date(s.date).toLocaleDateString()}
                  </p>
                </div>
                <Link href="/sessions" className="text-sm text-blue-500 hover:underline">
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
