const subsidiaries = [
  {
    name: "Proprietary Trading",
    tag: "100% Owned",
    tagColor: "bg-navy-800 text-navy-100",
    owners: [{ name: "Holding Co.", pct: 100 }],
    color: "navy",
  },
  {
    name: "Food Truck Co.",
    tag: "25% Owned",
    tagColor: "bg-amber-100 text-amber-800",
    owners: [
      { name: "Holding Co.", pct: 25 },
      { name: "Partner A", pct: 25 },
      { name: "Partner B", pct: 25 },
      { name: "Partner C", pct: 25 },
    ],
    color: "amber",
  },
  {
    name: "Tea House / Cafe",
    tag: "25% Owned",
    tagColor: "bg-emerald-100 text-emerald-800",
    owners: [
      { name: "Holding Co.", pct: 25 },
      { name: "Wife", pct: 50 },
      { name: "Remaining", pct: 25 },
    ],
    color: "emerald",
  },
];

const barColors: Record<string, string> = {
  "Holding Co.": "bg-navy-800",
  "Partner A": "bg-amber-500",
  "Partner B": "bg-amber-400",
  "Partner C": "bg-amber-300",
  Wife: "bg-emerald-500",
  Remaining: "bg-emerald-300",
};

export default function Structure() {
  return (
    <section id="structure" className="py-24 px-6 bg-white border-y border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-500 font-medium mb-3">
            Organization
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-navy-900">
            Corporate Structure
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            A single holding entity with full or partial ownership across three
            operating subsidiaries.
          </p>
        </div>

        {/* Org chart */}
        <div className="flex flex-col items-center mb-20">
          {/* Owner node */}
          <div className="flex items-center gap-3 px-6 py-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-900">Individual Owner</p>
              <p className="text-xs text-slate-400">Sole Proprietor</p>
            </div>
          </div>

          {/* Vertical connector */}
          <div className="connector-v h-10" />
          <span className="text-[10px] tracking-widest uppercase text-slate-400 -my-1">
            100% Ownership
          </span>
          <div className="connector-v h-10" />

          {/* Holding company node */}
          <div className="relative px-10 py-5 rounded-xl bg-navy-900 text-white text-center shadow-xl shadow-navy-900/20">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gold-500 rounded text-[10px] font-semibold text-navy-950 tracking-wide uppercase">
              Holding
            </div>
            <p className="font-serif text-lg font-medium mt-1">
              Prosperity Group LLC
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Parent Entity
            </p>
          </div>

          {/* Vertical connector */}
          <div className="connector-v h-10" />

          {/* Horizontal connector bar — hidden on mobile */}
          <div className="hidden md:block connector-h w-full max-w-[680px]" />

          {/* Three vertical drops + cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[750px]">
            {subsidiaries.map((sub) => (
              <div key={sub.name} className="flex flex-col items-center">
                <div className="hidden md:block connector-v h-10" />
                <div className="w-full rounded-xl bg-slate-50 border border-slate-200 p-5 card-lift">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-navy-900">
                      {sub.name}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${sub.tagColor}`}
                    >
                      {sub.tag}
                    </span>
                  </div>

                  {/* Stacked bar */}
                  <div className="flex h-2 rounded-full overflow-hidden mb-3">
                    {sub.owners.map((o) => (
                      <div
                        key={o.name}
                        className={`bar-fill ${barColors[o.name] ?? "bg-slate-300"}`}
                        style={{ width: `${o.pct}%` }}
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5">
                    {sub.owners.map((o) => (
                      <div
                        key={o.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${barColors[o.name] ?? "bg-slate-300"}`}
                          />
                          <span className="text-slate-600">{o.name}</span>
                        </div>
                        <span className="font-semibold text-navy-900">
                          {o.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
