export default function Hero() {
  return (
    <section className="relative bg-navy-950 text-white pt-16">
      <div className="hero-pattern relative">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,98,0.08)_0%,transparent_70%)]" />

        <div className="relative max-w-5xl mx-auto px-6 py-32 sm:py-40 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            <span className="text-gold-400 text-xs tracking-[0.15em] uppercase font-medium">
              Private Holding Company
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.15] tracking-tight">
            Building ventures that
            <br />
            <span className="text-gold-400">compound over time</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Prosperity Group LLC is a privately held company with operating
            subsidiaries across proprietary trading, food service, and
            hospitality.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#structure"
              className="px-8 py-3 bg-gold-500 text-navy-950 rounded text-sm font-semibold hover:bg-gold-400 transition-colors"
            >
              View Structure
            </a>
            <a
              href="#ventures"
              className="px-8 py-3 border border-slate-600 text-slate-300 rounded text-sm font-medium hover:border-slate-400 hover:text-white transition-colors"
            >
              Our Ventures
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>
    </section>
  );
}
