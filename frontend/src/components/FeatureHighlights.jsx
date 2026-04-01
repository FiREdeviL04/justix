const featureList = [
  {
    title: "Budget-First Matching",
    desc: "Prioritizes affordable and beginner-friendly lawyers for middle-class users.",
  },
  {
    title: "Verified Experience Bands",
    desc: "Lawyers are categorized into Beginner, Intermediate, and Experienced levels.",
  },
  {
    title: "Fast Contact Channels",
    desc: "Call, email, meeting requests, and WhatsApp redirection from a single profile.",
  },
  {
    title: "Admin Quality Gate",
    desc: "Each lawyer profile update passes through approval for trust and consistency.",
  },
];

const FeatureHighlights = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl text-brand-900">Why People Choose Justix</h2>
        <p className="text-sm text-slate-500">Built for clarity, trust, and speed.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {featureList.map((feature, idx) => (
          <article
            key={feature.title}
            className="card p-5"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <h3 className="text-lg text-brand-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{feature.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeatureHighlights;
