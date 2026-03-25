const subsidiaries = [
  {
    name: "Proprietary Trading Firm",
    description:
      "Systematic and discretionary trading strategies across global markets.",
    color: "var(--color-trading)",
    bgClass: "bg-[#1e3a5f]/5",
    borderClass: "border-[#1e3a5f]/20",
    textClass: "text-[#1e3a5f]",
    ownership: [{ holder: "Holding Company", share: "100%" }],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    name: "Food Truck Company",
    description:
      "Mobile food experiences bringing bold flavors to the streets.",
    color: "var(--color-food)",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    textClass: "text-amber-700",
    ownership: [
      { holder: "Holding Company", share: "25%" },
      { holder: "Partner A", share: "25%" },
      { holder: "Partner B", share: "25%" },
      { holder: "Partner C", share: "25%" },
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V11.25m19.5 0h-2.25a.75.75 0 00-.75.75v4.5m0-4.5V9a2.25 2.25 0 00-2.25-2.25h-1.5m-7.5 0V6.375c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v.75m-7.5 0h7.5" />
      </svg>
    ),
  },
  {
    name: "Tea House / Cafe",
    description:
      "A curated tea and coffee experience — quality, community, calm.",
    color: "var(--color-tea)",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-700",
    ownership: [
      { holder: "Holding Company", share: "25%" },
      { holder: "Wife", share: "50%" },
      { holder: "Remaining", share: "25%" },
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[var(--color-primary)] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">PG</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[var(--color-primary)]">
              Prosperity Group
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-8 text-sm text-[var(--color-text-muted)]">
            <a href="#structure" className="hover:text-[var(--color-text)] transition-colors">
              Structure
            </a>
            <a href="#ventures" className="hover:text-[var(--color-text)] transition-colors">
              Ventures
            </a>
            <a href="#contact" className="hover:text-[var(--color-text)] transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-accent)] mb-4">
            Strategic Holding Company
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-primary)] leading-tight">
            Building ventures that
            <br />
            compound over time
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
            Prosperity Group LLC is a privately held company operating across
            proprietary trading, food service, and hospitality.
          </p>
        </div>
      </section>

      {/* Structure Diagram */}
      <section id="structure" className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-text)]">
              Corporate Structure
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              100% owned holding company with three operating subsidiaries
            </p>
          </div>

          {/* Visual tree */}
          <div className="flex flex-col items-center">
            {/* Owner */}
            <div className="px-6 py-3 rounded-lg border-2 border-[var(--color-primary)] bg-white text-sm font-medium text-[var(--color-primary)]">
              Individual Owner
            </div>
            <div className="w-px h-8 bg-[var(--color-border)]" />
            <div className="text-xs text-[var(--color-text-muted)] -mt-1 mb-1">
              100% ownership
            </div>
            <div className="w-px h-4 bg-[var(--color-border)]" />

            {/* Holding */}
            <div className="px-8 py-4 rounded-xl border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-white text-center shadow-lg">
              <p className="font-semibold">Prosperity Group LLC</p>
              <p className="text-xs opacity-80 mt-0.5">Holding Company</p>
            </div>
            <div className="w-px h-8 bg-[var(--color-border)]" />

            {/* Connector line */}
            <div className="relative w-full max-w-3xl">
              <div className="absolute top-0 left-1/6 right-1/6 h-px bg-[var(--color-border)]" />
              <div className="flex justify-between px-[16.666%]">
                <div className="w-px h-8 bg-[var(--color-border)]" />
                <div className="w-px h-8 bg-[var(--color-border)]" />
                <div className="w-px h-8 bg-[var(--color-border)]" />
              </div>
            </div>

            {/* Subsidiaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              {subsidiaries.map((sub) => (
                <div
                  key={sub.name}
                  className={`rounded-xl border ${sub.borderClass} ${sub.bgClass} p-5 text-center`}
                >
                  <div className={`${sub.textClass} flex justify-center mb-3`}>
                    {sub.icon}
                  </div>
                  <p className={`font-semibold text-sm ${sub.textClass}`}>
                    {sub.name}
                  </p>
                  <div className="mt-3 space-y-1">
                    {sub.ownership.map((o) => (
                      <div
                        key={o.holder}
                        className="flex justify-between text-xs text-[var(--color-text-muted)] px-2"
                      >
                        <span>{o.holder}</span>
                        <span className="font-medium">{o.share}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ventures detail */}
      <section id="ventures" className="py-20 px-6 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Our Ventures
          </h2>
          <div className="grid gap-8">
            {subsidiaries.map((sub, i) => (
              <div
                key={sub.name}
                className={`flex flex-col sm:flex-row items-start gap-5 p-6 rounded-xl border ${sub.borderClass} ${sub.bgClass}`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${sub.textClass}`}
                  style={{ backgroundColor: `color-mix(in srgb, ${sub.color} 10%, white)` }}
                >
                  {sub.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[var(--color-text)]">
                    {sub.name}
                  </h3>
                  <p className="mt-1 text-[var(--color-text-muted)] text-sm leading-relaxed">
                    {sub.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sub.ownership.map((o) => (
                      <span
                        key={o.holder}
                        className={`text-xs px-2.5 py-1 rounded-full border ${sub.borderClass} ${sub.textClass} font-medium`}
                      >
                        {o.holder}: {o.share}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>
          <p className="text-[var(--color-text-muted)] mb-8">
            For inquiries about partnerships or investment opportunities.
          </p>
          <a
            href="mailto:hello@prosperitygroup.com"
            className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
          >
            hello@prosperitygroup.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <span>&copy; {new Date().getFullYear()} Prosperity Group LLC</span>
          <span>All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
