const areas = [
  {
    title: "Criminal Defense",
    subtitle: "Urgent response matters",
    detail: "Get immediate guidance from lawyers experienced in bail, FIR, and trial defense.",
    tone: "from-rose-100 to-orange-100",
  },
  {
    title: "Family & Civil",
    subtitle: "Clarity with compassion",
    detail: "Navigate divorce, maintenance, custody, and property disputes with structured support.",
    tone: "from-amber-100 to-yellow-100",
  },
  {
    title: "Corporate & Cyber",
    subtitle: "Modern legal shield",
    detail: "Draft contracts, protect data, and respond to digital fraud and compliance risks.",
    tone: "from-emerald-100 to-teal-100",
  },
];

const PracticeAreaStage = () => {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl text-brand-900">Practice Areas, Reimagined</h2>
        <p className="text-sm text-slate-500">Pick the lane, then match by expertise and budget.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {areas.map((area) => (
          <article key={area.title} className={`relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br ${area.tone} p-5 shadow-soft`}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-xl" />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">{area.subtitle}</p>
            <h3 className="mt-2 text-xl font-heading text-brand-900">{area.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{area.detail}</p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-700">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
              Justix verified professionals
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PracticeAreaStage;
