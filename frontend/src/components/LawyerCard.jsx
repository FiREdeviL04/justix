import { Link } from "react-router-dom";
import AnimatedCard from "./AnimatedCard";

const LawyerCard = ({ lawyer, onSave }) => {
  const name = lawyer?.userId?.name || "Lawyer";
  const topRated = (lawyer?.rating || 0) >= 4.5;

  return (
    <AnimatedCard className="card group relative flex h-full flex-col overflow-hidden p-5 animate-rise">
      <div className="pointer-events-none absolute right-3 top-3 opacity-20">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8V24" stroke="#0b5d4d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M9 13H27" stroke="#0b5d4d" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M6.5 14L3.5 20H9.5L6.5 14Z" fill="#117a65" />
          <path d="M29.5 14L26.5 20H32.5L29.5 14Z" fill="#117a65" />
          <rect x="13" y="24" width="10" height="3" rx="1.5" fill="#0b5d4d" />
        </svg>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-heading text-brand-900">{name}</h3>
          <p className="text-sm font-medium text-slate-600">{lawyer.experienceYears} years | {lawyer.experienceLevel}</p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Verified
            </span>
            {topRated && (
              <span className="rounded-full bg-fuchsia-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-fuchsia-700">
                Top Rated
              </span>
            )}
          </div>
        </div>
        <span className="rounded-full bg-accent-500/10 px-3 py-1 text-xs font-bold text-accent-700">
          {lawyer.pricing}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-700 line-clamp-3">{lawyer.bio || "No bio added yet."}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(lawyer.specialization || []).map((item) => (
          <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link className="btn-primary" to={`/lawyer/${lawyer.userId?._id}`}>
          View Profile
        </Link>
        <div className="flex items-center gap-2">
          <Link className="btn-secondary" to={`/book/${lawyer.userId?._id}`}>
            Book
          </Link>
          {onSave && (
            <button type="button" className="btn-secondary" onClick={() => onSave(lawyer.userId?._id)}>
              Save
            </button>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
        <p className="text-xs uppercase tracking-wider text-brand-700">Quick Insight</p>
        <p className="text-sm text-slate-600">Rating: {(lawyer.rating || 0).toFixed(1)} • Availability: {lawyer.availability ? "Open" : "Busy"}</p>
      </div>
    </AnimatedCard>
  );
};

export default LawyerCard;
