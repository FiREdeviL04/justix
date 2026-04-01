const motifs = [
  {
    title: "Courtroom-Ready Profiles",
    desc: "Structured lawyer information with experience bands, practice areas, and outcomes.",
    svg: (
      <svg viewBox="0 0 220 120" className="h-28 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="16" width="196" height="92" rx="14" fill="#f2f8f7" />
        <rect x="28" y="32" width="58" height="62" rx="10" fill="#117a65" fillOpacity="0.15" />
        <rect x="98" y="34" width="92" height="12" rx="6" fill="#c8e2dc" />
        <rect x="98" y="54" width="78" height="10" rx="5" fill="#dcefeb" />
        <rect x="98" y="72" width="64" height="10" rx="5" fill="#dcefeb" />
        <path d="M51 52L62 63L73 52" stroke="#0b5d4d" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Scales of Trust",
    desc: "Approval workflow and transparent pricing create confidence for every booking.",
    svg: (
      <svg viewBox="0 0 220 120" className="h-28 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="16" width="196" height="92" rx="14" fill="#fff6ea" />
        <path d="M110 30V84" stroke="#b56c13" strokeWidth="5" strokeLinecap="round" />
        <path d="M74 46H146" stroke="#b56c13" strokeWidth="5" strokeLinecap="round" />
        <path d="M63 50L46 74H80L63 50Z" fill="#e08a1e" fillOpacity="0.35" />
        <path d="M157 50L140 74H174L157 50Z" fill="#e08a1e" fillOpacity="0.6" />
        <rect x="84" y="84" width="52" height="12" rx="6" fill="#b56c13" fillOpacity="0.35" />
      </svg>
    ),
  },
  {
    title: "Fast Legal Connection",
    desc: "Call, email, meeting scheduling, and inquiry tracking in one clean workflow.",
    svg: (
      <svg viewBox="0 0 220 120" className="h-28 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="16" width="196" height="92" rx="14" fill="#f2f8f7" />
        <rect x="32" y="30" width="58" height="78" rx="12" fill="#117a65" fillOpacity="0.2" />
        <circle cx="61" cy="96" r="4" fill="#0b5d4d" />
        <rect x="45" y="40" width="32" height="6" rx="3" fill="#0b5d4d" fillOpacity="0.45" />
        <path d="M112 46C112 33 123 22 136 22H164C177 22 188 33 188 46V60C188 73 177 84 164 84H144L128 94L132 84H136C123 84 112 73 112 60V46Z" fill="#117a65" />
        <rect x="125" y="42" width="48" height="5" rx="2.5" fill="#ffffff" />
        <rect x="125" y="54" width="37" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.9" />
      </svg>
    ),
  },
];

const LegalThemeGallery = () => {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl text-brand-900">Law-Themed Experience</h2>
        <p className="text-sm text-slate-500">Visual language inspired by legal trust and clarity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {motifs.map((item) => (
          <article key={item.title} className="card p-4">
            {item.svg}
            <h3 className="mt-3 text-lg text-brand-900">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-700">{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LegalThemeGallery;
