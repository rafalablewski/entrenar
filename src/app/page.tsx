import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #00F0FF 0%, transparent 70%)", top: "-300px", right: "-200px" }} />
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #A855F7 0%, transparent 70%)", bottom: "-200px", left: "-100px" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #FF2D92 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00F0FF, #4D7CFF)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-[16px] font-bold tracking-[-0.03em]" style={{ color: "rgba(255,255,255,0.95)" }}>
              ENTRENAR
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[13px] font-medium transition-colors px-4 py-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-[13px] !py-2.5 !px-6">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center pt-40 pb-24 px-8 relative z-10">
        <div className="text-center max-w-4xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
            style={{ background: "rgba(0, 240, 255, 0.08)", border: "1px solid rgba(0, 240, 255, 0.15)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#00F0FF", animation: "pulse-glow 2s ease-in-out infinite" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#00F0FF" }} />
            </span>
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase" style={{ color: "#00F0FF" }}>
              Next-Generation Athletic Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[72px] leading-[0.95] font-bold tracking-[-0.04em] mb-7">
            <span style={{ color: "rgba(255,255,255,0.95)" }}>Train beyond</span>
            <br />
            <span className="text-gradient">limits.</span>
          </h1>

          <p className="text-[19px] leading-[1.6] max-w-xl mx-auto mb-12" style={{ color: "rgba(255,255,255,0.45)" }}>
            Interactive 3D anatomy. Tissue-level muscle intelligence.
            The exercise database that lets you see inside the human body.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-[15px] !py-3.5 !px-10">
              Begin Training
            </Link>
            <Link href="/login" className="btn-secondary text-[15px] !py-3.5 !px-10">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "3D Anatomy Atlas",
              desc: "Explore every muscle layer. From skin to bone. Rotate, zoom, and dissect the human body in real-time.",
              accent: "#00F0FF",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              ),
            },
            {
              title: "Muscle Intelligence",
              desc: "Origin, insertion, innervation. Every fiber mapped. Know exactly which tissues are working in every exercise.",
              accent: "#A855F7",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              ),
            },
            {
              title: "Precision Training",
              desc: "250+ exercises. Endeavour-driven programming. Track sessions with surgical precision down to every rep.",
              accent: "#FF6B35",
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
            },
          ].map((f) => (
            <div key={f.title} className="card p-8 group border-gradient">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `rgba(${f.accent === "#00F0FF" ? "0,240,255" : f.accent === "#A855F7" ? "168,85,247" : "255,107,53"},0.1)`,
                  color: f.accent,
                  border: `1px solid ${f.accent}22`,
                }}>
                {f.icon}
              </div>
              <h3 className="text-[17px] font-bold tracking-[-0.02em] mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>
                {f.title}
              </h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} className="py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-[0.05em] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
            ENTRENAR
          </span>
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Train beyond limits.
          </span>
        </div>
      </footer>
    </div>
  );
}
