const team = [
  { name: "Anita Sharma", role: "Founder" },
  { name: "Rahul Mehta", role: "Legal Operations" },
  { name: "Sana Khan", role: "Customer Success" },
];

const AboutPage = () => {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl text-brand-900">About Justix</h1>

      <div className="card p-6">
        <h2 className="text-xl text-brand-900">Mission</h2>
        <p className="mt-2 text-sm text-slate-700">Affordable legal help for everyone, especially middle-class families.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-xl text-brand-900">Problem</h2>
          <p className="mt-2 text-sm text-slate-700">
            Legal services are often expensive, confusing, and hard to access for non-technical users.
          </p>
        </article>

        <article className="card p-6">
          <h2 className="text-xl text-brand-900">Solution</h2>
          <p className="mt-2 text-sm text-slate-700">
            Justix connects users with verified lawyers using transparent pricing, easy filters, and quick contact options.
          </p>
        </article>
      </div>

      <div className="card p-6">
        <h2 className="text-xl text-brand-900">Team</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-xl border border-brand-100 bg-brand-50 p-4">
              <p className="font-semibold text-brand-900">{member.name}</p>
              <p className="text-sm text-slate-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
