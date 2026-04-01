const steps = [
  "Describe your legal need",
  "Filter lawyers by budget and expertise",
  "Connect instantly via call, email, or meeting",
  "Track response and booking status",
];

const JourneyStrip = () => {
  return (
    <section className="rounded-3xl border border-brand-100 bg-brand-900 p-6 text-white shadow-soft md:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">Guided Journey</p>
      <h2 className="mt-2 text-2xl font-heading">From legal confusion to confident action</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-500">Step {index + 1}</p>
            <p className="mt-2 text-sm text-brand-50">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JourneyStrip;
