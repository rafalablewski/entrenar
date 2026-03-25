export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-white/5 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded border border-gold-500/30 flex items-center justify-center">
                <span className="text-gold-500 font-serif text-sm font-semibold">
                  P
                </span>
              </div>
              <span className="text-white text-sm font-semibold tracking-wide">
                Prosperity Group
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              A privately held holding company building durable businesses
              across multiple industries.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-semibold mb-4">
                Company
              </p>
              <ul className="space-y-2.5">
                {["About", "Structure", "Ventures", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-slate-400 text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-semibold mb-4">
                Ventures
              </p>
              <ul className="space-y-2.5">
                {[
                  "Proprietary Trading",
                  "Food Truck Co.",
                  "Tea House / Cafe",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-slate-500 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            &copy; {year} Prosperity Group LLC. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            This site is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
