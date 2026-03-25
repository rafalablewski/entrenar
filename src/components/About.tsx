const pillars = [
  {
    title: "Long-Term Orientation",
    description:
      "We build and acquire businesses to hold indefinitely. Every decision prioritizes durable value over short-term gains.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Capital Discipline",
    description:
      "Rigorous allocation of capital across subsidiaries. Each venture is capitalized appropriately and operates on its own merits.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    ),
  },
  {
    title: "Operator Mindset",
    description:
      "We don't just invest — we operate. Each subsidiary benefits from hands-on leadership, shared infrastructure, and group expertise.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17l-5.384-3.077A5.994 5.994 0 003.5 14.25 5.994 5.994 0 006.038 16.5a5.994 5.994 0 005.383-1.33zM12.578 15.17l5.384-3.077A5.994 5.994 0 0020.5 14.25a5.994 5.994 0 00-2.538 2.25 5.994 5.994 0 00-5.384-1.33zM12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z"
      />
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-500 font-medium mb-3">
            Our Philosophy
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-navy-900">
            Principles that guide us
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto leading-relaxed">
            We operate at the intersection of patience and ambition — building
            a portfolio of businesses designed to last.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="text-center px-4">
              <div className="w-12 h-12 mx-auto mb-5 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-navy-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {pillar.icon}
                </svg>
              </div>
              <h3 className="font-semibold text-navy-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
