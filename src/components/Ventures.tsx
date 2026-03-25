const ventures = [
  {
    name: "Proprietary Trading Firm",
    category: "Financial Services",
    description:
      "Systematic and discretionary trading strategies across global equity, futures, and options markets. Fully owned by the holding company, this subsidiary generates returns through quantitative research and disciplined risk management.",
    highlights: ["Global Markets", "Quantitative Research", "Risk Management"],
    accent: "border-l-navy-700",
    dotColor: "bg-navy-700",
    ownership: "100% Holding Co.",
  },
  {
    name: "Food Truck Company",
    category: "Food & Beverage",
    description:
      "A mobile food venture bringing bold, chef-driven cuisine to the streets. Structured as an equal partnership between four stakeholders, combining culinary expertise with operational agility.",
    highlights: ["Mobile Operations", "Chef-Driven", "Equal Partnership"],
    accent: "border-l-amber-500",
    dotColor: "bg-amber-500",
    ownership: "25% Holding Co. + 3 Partners",
  },
  {
    name: "Tea House / Cafe",
    category: "Hospitality",
    description:
      "A curated tea and coffee experience focused on quality sourcing, calm atmosphere, and community. Majority-owned by a co-founding partner, with the holding company providing strategic oversight and capital.",
    highlights: ["Quality Sourcing", "Community Space", "Family Venture"],
    accent: "border-l-emerald-500",
    dotColor: "bg-emerald-500",
    ownership: "25% Holding Co. + 50% Wife",
  },
];

export default function Ventures() {
  return (
    <section id="ventures" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-500 font-medium mb-3">
            Portfolio
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-navy-900">
            Our Ventures
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Three operating businesses spanning financial services, food, and
            hospitality — each with a distinct ownership structure and mandate.
          </p>
        </div>

        <div className="space-y-6">
          {ventures.map((v, i) => (
            <div
              key={v.name}
              className={`bg-white rounded-xl border border-slate-200 border-l-4 ${v.accent} p-8 card-lift`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                    {v.category}
                  </p>
                  <h3 className="font-serif text-xl font-medium text-navy-900">
                    {v.name}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-3 py-1 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${v.dotColor}`} />
                  {v.ownership}
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-5 max-w-3xl">
                {v.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {v.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-3 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
