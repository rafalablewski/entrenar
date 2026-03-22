import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-6xl font-bold mb-4">Entrenar</h1>
        <p className="text-xl text-blue-100 mb-8">
          The platform for personal trainers and athletes to plan, track, and
          conquer their next endeavour together.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl px-6">
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">&#127947;</div>
          <h3 className="font-semibold text-lg mb-2">Manage Athletes</h3>
          <p className="text-blue-100 text-sm">
            Trainers can onboard athletes and track their profiles, sports, and goals.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">&#127942;</div>
          <h3 className="font-semibold text-lg mb-2">Plan Endeavours</h3>
          <p className="text-blue-100 text-sm">
            Set target events and competitions, assign athletes, and build structured plans.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center">
          <div className="text-3xl mb-3">&#128200;</div>
          <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
          <p className="text-blue-100 text-sm">
            Log training sessions, record exercises, and monitor progress towards goals.
          </p>
        </div>
      </div>
    </div>
  );
}
