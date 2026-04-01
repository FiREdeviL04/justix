import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-brand-900">{question}</span>
        <span className="text-brand-700">{open ? "-" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-sm text-slate-700">{answer}</p>}
    </div>
  );
};

export default FAQItem;
