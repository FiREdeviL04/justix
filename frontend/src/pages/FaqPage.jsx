import FAQItem from "../components/FAQItem";

const items = [
  {
    question: "How to hire a lawyer?",
    answer: "Use the Find Lawyers page, apply filters, open a profile, and click Book to schedule a call or meeting.",
  },
  {
    question: "Is it affordable?",
    answer: "Yes. Justix highlights low-cost and beginner-friendly lawyers for middle-class users.",
  },
  {
    question: "How to contact?",
    answer: "You can contact through call, email, WhatsApp, or booking inquiry from profile and booking page.",
  },
  {
    question: "Are lawyers verified?",
    answer: "Yes. Lawyer profiles are moderated by admin before appearing publicly in search.",
  },
];

const FaqPage = () => {
  return (
    <section className="space-y-5">
      <h1 className="text-3xl text-brand-900">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <FAQItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
};

export default FaqPage;
