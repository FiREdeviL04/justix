const ReviewCard = ({ review }) => {
  return (
    <article className="card p-5">
      <div className="mb-2 flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, idx) => (
          <span key={idx}>{idx < review.rating ? "★" : "☆"}</span>
        ))}
      </div>
      <p className="text-sm text-slate-700">"{review.text}"</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-700">{review.name}</p>
    </article>
  );
};

export default ReviewCard;
