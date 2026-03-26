export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-950/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded border border-gold-500/40 flex items-center justify-center">
            <span className="text-gold-500 font-serif text-sm font-semibold">
              P
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-semibold tracking-wide leading-none">
              Prosperity Group
            </span>
            <span className="text-slate-500 text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5">
              Holdings
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {["About", "Structure", "Ventures", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-slate-400 text-sm hover:text-white transition-colors duration-200"
            >
              {item}
            </a>
          ))}
          <a
            href="/notes"
            className="text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors duration-200"
          >
            Notes
          </a>
        </nav>
      </div>
    </header>
  );
}
