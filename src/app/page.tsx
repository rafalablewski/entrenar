import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #00F0FF 0%, transparent 60%)", top: "-400px", right: "-300px" }} />
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #A855F7 0%, transparent 60%)", bottom: "-300px", left: "-200px" }} />
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #FF2D92 0%, transparent 60%)", top: "40%", left: "60%" }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00F0FF, #4D7CFF)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-[17px] font-bold tracking-[-0.04em]" style={{ color: "rgba(255,255,255,0.95)" }}>
              ENTRENAR
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[13px] font-medium transition-colors px-4 py-2"
              style={{ color: "rgba(255,255,255,0.5)" }}>Sign in</Link>
            <Link href="/register" className="btn-primary text-[13px] !py-2.5 !px-6">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero - Full viewport */}
      <section className="hero-section px-8 relative z-10">
        <div className="hero-grid" />

        <div className="text-center max-w-5xl relative" style={{ animation: "fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
            style={{ background: "rgba(0, 240, 255, 0.06)", border: "1px solid rgba(0, 240, 255, 0.12)" }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#00F0FF", animation: "pulse-glow 2s ease-in-out infinite" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#00F0FF" }} />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: "#00F0FF" }}>
              Athletic Intelligence Platform
            </span>
          </div>

          <h1 className="text-[clamp(48px,8vw,96px)] leading-[0.92] font-bold tracking-[-0.05em] mb-6">
            <span style={{ color: "rgba(255,255,255,0.95)" }}>See every</span>
            <br />
            <span className="text-gradient">muscle fire.</span>
          </h1>

          <p className="text-[clamp(16px,1.8vw,21px)] leading-[1.5] max-w-2xl mx-auto mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
            Interactive anatomy with real-time muscle visualization.
            Watch exercises come alive. Train with surgical precision.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-[15px] !py-4 !px-12 !rounded-2xl">
              Start Training
            </Link>
            <Link href="/login" className="btn-secondary text-[15px] !py-4 !px-12 !rounded-2xl">
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2" style={{ animation: "float 3s ease-in-out infinite" }}>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
            <rect x="1" y="1" width="18" height="28" rx="9" />
            <circle cx="10" cy="8" r="2" fill="rgba(255,255,255,0.3)">
              <animate attributeName="cy" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </section>

      {/* Feature 1: Anatomy */}
      <section className="py-32 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div style={{ animation: "fadeUp 0.8s ease" }}>
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase mb-4 block" style={{ color: "#00F0FF" }}>
                Anatomy Atlas
              </span>
              <h2 className="text-[clamp(32px,4vw,56px)] font-bold tracking-[-0.04em] leading-[1.05] mb-6"
                style={{ color: "rgba(255,255,255,0.95)" }}>
                Peel back
                <br />
                <span className="text-gradient">every layer.</span>
              </h2>
              <p className="text-[17px] leading-[1.7] mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
                From skin to skeleton. Interactive muscle regions with scientific detail.
                Slide through anatomical layers and see exactly what&apos;s underneath.
              </p>
              <div className="flex flex-col gap-3">
                {[["Front & back views", "Toggle between anterior and posterior anatomy"],
                  ["5-layer peel system", "Skin, fascia, superficial, deep, skeleton"],
                  ["Click any muscle", "Scientific names, origins, insertions, innervation"],
                ].map(([label, desc]) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0"
                      style={{ background: "rgba(0,240,255,0.1)", border: "1px solid rgba(0,240,255,0.2)" }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#00F0FF" strokeWidth="1.5"><path d="M2 5l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{label}</p>
                      <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anatomy preview */}
            <div className="feature-card p-8 flex items-center justify-center">
              <svg viewBox="0 0 200 320" width="260" height="416" style={{ filter: "drop-shadow(0 0 30px rgba(0,240,255,0.1))" }}>
                {/* Body silhouette */}
                <path d="M100,16 Q88,16 84,24 Q80,32 84,40 Q88,48 84,52 Q76,56 68,60 Q56,60 48,68 Q44,76 44,84 Q44,96 48,112 Q48,124 44,136 Q40,152 36,168 Q36,172 40,172 Q44,168 48,156 Q52,144 56,136 Q60,144 64,156 Q68,164 72,160 Q72,168 68,184 Q64,204 64,224 Q68,232 68,252 Q68,272 72,280 Q76,284 80,280 Q80,272 76,256 Q76,240 80,228 Q84,224 88,228 Q92,232 96,232 L104,232 Q108,232 112,228 Q116,224 120,228 Q124,240 124,256 Q120,272 120,280 Q124,284 128,280 Q132,272 132,252 Q132,232 136,224 Q136,204 132,184 Q128,168 128,160 Q132,164 136,156 Q140,144 144,136 Q148,144 152,156 Q156,168 160,172 Q164,172 164,168 Q160,152 156,136 Q152,124 152,112 Q156,96 156,84 Q156,76 152,68 Q144,60 132,60 Q124,56 116,52 Q112,48 116,40 Q120,32 116,24 Q112,16 100,16Z"
                  fill="rgba(0,240,255,0.03)" stroke="rgba(0,240,255,0.15)" strokeWidth="0.8" />
                {/* Chest muscles */}
                <ellipse cx="85" cy="80" rx="14" ry="10" fill="rgba(255,68,102,0.4)" stroke="rgba(255,68,102,0.6)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="115" cy="80" rx="14" ry="10" fill="rgba(255,68,102,0.4)" stroke="rgba(255,68,102,0.6)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
                </ellipse>
                {/* Abs */}
                <rect x="92" y="100" width="16" height="48" rx="4" fill="rgba(168,85,247,0.3)" stroke="rgba(168,85,247,0.5)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
                </rect>
                {/* Quads */}
                <ellipse cx="82" cy="200" rx="10" ry="28" fill="rgba(0,255,136,0.3)" stroke="rgba(0,255,136,0.5)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="118" cy="200" rx="10" ry="28" fill="rgba(0,255,136,0.3)" stroke="rgba(0,255,136,0.5)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3.5s" repeatCount="indefinite" begin="0.3s" />
                </ellipse>
                {/* Biceps */}
                <ellipse cx="46" cy="104" rx="5" ry="14" fill="rgba(0,240,255,0.4)" stroke="rgba(0,240,255,0.6)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="154" cy="104" rx="5" ry="14" fill="rgba(0,240,255,0.4)" stroke="rgba(0,240,255,0.6)" strokeWidth="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" begin="0.4s" />
                </ellipse>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Exercise Demos */}
      <section className="py-32 px-8 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Demo preview */}
            <div className="feature-card p-8 order-2 lg:order-1">
              <svg viewBox="0 0 200 180" width="100%" className="max-w-[400px] mx-auto">
                <defs>
                  <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="200" height="180" fill="url(#heroGrid)" />
                {/* Barbell */}
                <line x1="40" y1="44" x2="160" y2="44" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
                <rect x="40" y="36" width="8" height="16" rx="2" fill="rgba(255,255,255,0.15)" />
                <rect x="152" y="36" width="8" height="16" rx="2" fill="rgba(255,255,255,0.15)" />
                {/* Figure - bench press top position */}
                <line x1="100" y1="68" x2="100" y2="110" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="76" x2="76" y2="60" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round">
                  <animate attributeName="x2" values="76;68;76" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="60;48;60" dur="2s" repeatCount="indefinite" />
                </line>
                <line x1="76" y1="60" x2="78" y2="44" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round">
                  <animate attributeName="x1" values="76;68;76" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="y1" values="60;48;60" dur="2s" repeatCount="indefinite" />
                </line>
                <line x1="100" y1="76" x2="124" y2="60" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round">
                  <animate attributeName="x2" values="124;132;124" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="y2" values="60;48;60" dur="2s" repeatCount="indefinite" />
                </line>
                <line x1="124" y1="60" x2="122" y2="44" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round">
                  <animate attributeName="x1" values="124;132;124" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="y1" values="60;48;60" dur="2s" repeatCount="indefinite" />
                </line>
                <circle cx="100" cy="60" r="8" fill="rgba(0,240,255,0.1)" stroke="rgba(0,240,255,0.4)" strokeWidth="1.5" />
                {/* Legs */}
                <line x1="100" y1="110" x2="88" y2="130" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="110" x2="112" y2="130" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                <line x1="88" y1="130" x2="86" y2="152" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                <line x1="112" y1="130" x2="114" y2="152" stroke="rgba(0,240,255,0.5)" strokeWidth="4" strokeLinecap="round" />
                {/* Motion arcs */}
                <path d="M70,44 Q70,30 86,30" fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="1" strokeDasharray="3,3">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M130,44 Q130,30 114,30" fill="none" stroke="rgba(0,240,255,0.15)" strokeWidth="1" strokeDasharray="3,3">
                  <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase mb-4 block" style={{ color: "#A855F7" }}>
                Exercise Simulation
              </span>
              <h2 className="text-[clamp(32px,4vw,56px)] font-bold tracking-[-0.04em] leading-[1.05] mb-6"
                style={{ color: "rgba(255,255,255,0.95)" }}>
                Watch it
                <br />
                <span className="text-gradient-warm">in motion.</span>
              </h2>
              <p className="text-[17px] leading-[1.7] mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
                Every exercise comes alive with real-time animated demonstrations.
                See the exact movement pattern, joint angles, and equipment position.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[["250+","Exercises"],["9","Categories"],["60+","Muscles mapped"],["5","Peel layers"]].map(([n,l]) => (
                  <div key={l} className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <p className="text-[28px] font-bold tracking-tight" style={{ color: "rgba(255,255,255,0.9)" }}>{n}</p>
                    <p className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Training */}
      <section className="py-32 px-8 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase mb-4 block" style={{ color: "#FF6B35" }}>
            Precision Training
          </span>
          <h2 className="text-[clamp(32px,4vw,56px)] font-bold tracking-[-0.04em] leading-[1.05] mb-6"
            style={{ color: "rgba(255,255,255,0.95)" }}>
            Built for athletes who
            <br />
            <span className="text-gradient">demand more.</span>
          </h2>
          <p className="text-[17px] leading-[1.7] max-w-2xl mx-auto mb-16" style={{ color: "rgba(255,255,255,0.4)" }}>
            Periodized training plans. Session tracking with RPE feedback.
            Health monitoring with injury prevention intelligence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "AI Plan Generator", desc: "Periodized programs with sport-specific exercise selection. Base, build, peak, taper phases.", accent: "#00F0FF", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: "Session Tracking", desc: "Log every set, rep, and weight. Rate perceived exertion. Share workout summaries.", accent: "#A855F7", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
              { title: "Health Intelligence", desc: "Track injuries, pain patterns, and recovery. Body area mapping with severity indicators.", accent: "#FF6B35", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
            ].map(f => (
              <div key={f.title} className="feature-card p-8 text-left group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}20`, color: f.accent }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold tracking-[-0.02em] mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {f.title}
                </h3>
                <p className="text-[14px] leading-[1.65]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <section className="py-32 px-8 relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold tracking-[-0.04em] leading-[1] mb-6 text-shimmer">
            Ready to train beyond limits?
          </h2>
          <p className="text-[17px] mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>Join the next generation of athletic intelligence.</p>
          <Link href="/register" className="btn-primary text-[16px] !py-4 !px-14 !rounded-2xl">Get Started Free</Link>
        </div>
      </section>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} className="py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <span className="text-[12px] font-semibold tracking-[0.05em] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>ENTRENAR</span>
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>Train beyond limits.</span>
        </div>
      </footer>
    </div>
  );
}
