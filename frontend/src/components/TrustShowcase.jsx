const metrics = [
  { label: "Consultations Guided", value: "12K+" },
  { label: "Verified Lawyer Profiles", value: "3.2K" },
  { label: "Avg. Response Time", value: "< 30 min" },
  { label: "Affordable Matches", value: "68%" },
];

const stories = [
  {
    quote: "I filtered by budget and found a beginner property lawyer within minutes. The process felt transparent.",
    person: "Ritika, Customer",
  },
  {
    quote: "As a new lawyer, Justix helped me present case studies and receive genuine inquiries quickly.",
    person: "Arjun, Lawyer",
  },
  {
    quote: "The approval workflow builds trust. Customers see reliable profiles, and lawyers maintain quality details.",
    person: "Platform Feedback",
  },
];

const TrustShowcase = () => {
  return (
    <section className="space-y-5 rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Proof of trust</p>
          <h2 className="mt-1 text-2xl text-brand-900">Confidence built by outcomes</h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item) => (
          <div key={item.label} className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
            <p className="text-2xl font-heading text-brand-900">{item.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-700">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {stories.map((story) => (
          <blockquote key={story.person} className="rounded-2xl border border-brand-100 bg-white p-4">
            <p className="text-sm italic text-slate-700">"{story.quote}"</p>
            <footer className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-700">{story.person}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default TrustShowcase;
