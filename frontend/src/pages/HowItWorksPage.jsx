import { MessageSquareDot, Search, ShieldCheck, UserCircle2 } from "lucide-react";

const steps = [
  { icon: Search, title: "Search lawyer", detail: "Use filters for experience, category, and budget." },
  { icon: UserCircle2, title: "View profile", detail: "Review bio, case studies, rating, and pricing before deciding." },
  { icon: MessageSquareDot, title: "Connect", detail: "Call, email, or schedule a meeting instantly." },
  { icon: ShieldCheck, title: "Solve case", detail: "Track responses and continue your legal process with confidence." },
];

const HowItWorksPage = () => {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl text-brand-900">How Justix Works</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <article key={step.title} className="card p-5">
            <step.icon size={22} className="text-brand-700" />
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-brand-700">Step {index + 1}</p>
            <h2 className="mt-1 text-xl text-brand-900">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{step.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksPage;
