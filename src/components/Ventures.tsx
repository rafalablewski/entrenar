const strategies = [
  {
    label: "Core",
    name: "Growth Equity Investing",
    description:
      "Concentrated positions in high-growth companies at inflection points — revenue ramps, market expansions, and technology breakthroughs. Deep fundamental research to identify asymmetric risk/reward before the market reprices.",
    color: "bg-navy-800",
  },
  {
    label: "Tactical",
    name: "Catalyst-Driven Trading",
    description:
      "Sized around discrete, identifiable catalysts — satellite launches, FDA approvals, earnings inflections, contract awards. Enter ahead of the event, manage risk around the binary outcome.",
    color: "bg-blue-600",
  },
  {
    label: "Yield",
    name: "Carry Trade",
    description:
      "Exploiting yield differentials and funding rate dislocations across asset classes. Structured to generate steady income while maintaining exposure to underlying equity upside.",
    color: "bg-gold-500",
  },
  {
    label: "Amplification",
    name: "Leverage Amplification",
    description:
      "LEAPS, margin, and defined-risk options structures to amplify conviction in highest-confidence positions. Strict position sizing and drawdown limits to cap downside exposure.",
    color: "bg-slate-500",
  },
];

const ventures = [
  {
    name: "Proprietary Trading Firm",
    category: "Financial Services",
    description:
      "Systematic and discretionary trading across global equity, futures, and options markets. Fully owned by the holding company, this subsidiary deploys capital through four complementary strategy pillars designed to compound returns while managing risk at every layer.",
    highlights: ["Global Markets", "Multi-Strategy", "Risk Management"],
    accent: "border-l-navy-700",
    dotColor: "bg-navy-700",
    ownership: "100% Holding Co.",
    strategies: strategies,
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
    strategies: null,
  },
  {
    name: "Tea House / Cafe",
    category: "Hospitality",
    description:
      "A curated tea and coffee experience focused on quality sourcing, calm atmosphere, and community. A 50/50 partnership between the holding company and co-founder, combining strategic capital with hands-on hospitality expertise.",
    highlights: ["Quality Sourcing", "Community Space", "Family Venture"],
    accent: "border-l-emerald-500",
    dotColor: "bg-emerald-500",
    ownership: "50% Holding Co. + 50% Wife",
    strategies: null,
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
          {ventures.map((v) => (
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

              <div className="flex flex-wrap gap-2 mb-5">
                {v.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-3 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Trading strategies sub-section */}
              {v.strategies && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-slate-400 font-semibold mb-4">
                    Our Strategies
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {v.strategies.map((s) => (
                      <div
                        key={s.name}
                        className="rounded-lg bg-slate-50/80 border border-slate-100 p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-1.5 h-5 rounded-full ${s.color}`}
                          />
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                              {s.label}
                            </span>
                            <h4 className="text-sm font-semibold text-navy-900 leading-tight">
                              {s.name}
                            </h4>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed pl-3.5">
                          {s.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
