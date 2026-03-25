export default function Contact() {
  return (
    <section
      id="contact"
      className="py-24 px-6 bg-navy-950 text-white relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,98,0.06)_0%,transparent_60%)]" />

      <div className="relative max-w-2xl mx-auto text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-gold-500 font-medium mb-3">
          Get in Touch
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-4">
          Let&apos;s start a conversation
        </h2>
        <p className="text-slate-400 leading-relaxed mb-10">
          Whether you&apos;re interested in partnership opportunities, joint
          ventures, or simply want to learn more about our portfolio — we&apos;d
          like to hear from you.
        </p>

        <a
          href="mailto:hello@prosperitygroup.com"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gold-500 text-navy-950 rounded text-sm font-semibold hover:bg-gold-400 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          hello@prosperitygroup.com
        </a>
      </div>
    </section>
  );
}
