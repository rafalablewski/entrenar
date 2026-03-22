import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight text-[#1A1A1A]">
            entrenar
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="btn-primary text-[13px] !py-2 !px-5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF5FF] text-[#0071E3] text-[12px] font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]"></span>
            Built for trainers and athletes
          </div>
          <h1 className="text-[52px] leading-[1.05] font-semibold tracking-[-0.035em] text-[#1A1A1A] mb-5">
            Prepare for your
            <br />
            next endeavour
          </h1>
          <p className="text-[17px] leading-relaxed text-[#6B6B6B] max-w-lg mx-auto mb-10">
            The minimalist platform where personal trainers and athletes
            collaborate on training plans, track sessions, and build towards
            competition day.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-[15px] !py-3 !px-8">
              Start Training
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-[15px] !py-3 !px-8"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "250+ Exercises",
              desc: "Comprehensive library spanning running, swimming, cycling, gym, HYROX, CrossFit, weightlifting, and powerlifting.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              ),
            },
            {
              title: "Endeavour-Driven",
              desc: "Every plan leads to a goal — a marathon, a competition, a personal milestone. Stay focused on what matters.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
            {
              title: "Session Tracking",
              desc: "Log every set, rep, and distance. Athletes and trainers stay in sync with real-time progress updates.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="card p-7">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[#6B6B6B] mb-4">
                {f.icon}
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#6B6B6B]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,0,0,0.06)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-[12px] text-[#9CA3AF]">entrenar</span>
          <span className="text-[12px] text-[#9CA3AF]">Train with purpose.</span>
        </div>
      </footer>
    </div>
  );
}
