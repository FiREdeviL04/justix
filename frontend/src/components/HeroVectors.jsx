const HeroVectors = () => {
  return (
    <div className="relative isolate mx-auto w-full max-w-md">
      <svg viewBox="0 0 560 460" className="w-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#117a65" />
            <stop offset="100%" stopColor="#0b5d4d" />
          </linearGradient>
          <linearGradient id="blobGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5c98f" />
            <stop offset="100%" stopColor="#e08a1e" />
          </linearGradient>
        </defs>

        <ellipse cx="280" cy="414" rx="190" ry="24" fill="#0b5d4d" fillOpacity="0.15" />

        <path
          d="M90 115C90 78 120 48 157 48H403C440 48 470 78 470 115V315C470 352 440 382 403 382H157C120 382 90 352 90 315V115Z"
          fill="#ffffff"
          stroke="#dcefeb"
          strokeWidth="3"
        />

        <path d="M120 92C120 76 133 63 149 63H409C425 63 438 76 438 92V122H120V92Z" fill="url(#cardGrad)" />
        <circle cx="143" cy="93" r="6" fill="#fef3c7" />
        <circle cx="163" cy="93" r="6" fill="#fef3c7" fillOpacity="0.7" />
        <circle cx="183" cy="93" r="6" fill="#fef3c7" fillOpacity="0.45" />

        <rect x="132" y="143" width="126" height="14" rx="7" fill="#dcefeb" />
        <rect x="132" y="171" width="180" height="11" rx="5.5" fill="#e8f3f1" />
        <rect x="132" y="193" width="206" height="11" rx="5.5" fill="#e8f3f1" />

        <rect x="132" y="228" width="88" height="80" rx="14" fill="#f2f8f7" />
        <rect x="232" y="228" width="88" height="80" rx="14" fill="#f2f8f7" />
        <rect x="332" y="228" width="88" height="80" rx="14" fill="#f2f8f7" />

        <circle cx="176" cy="262" r="18" fill="#117a65" fillOpacity="0.2" />
        <path d="M167 262L174 269L185 255" stroke="#0b5d4d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        <rect x="252" y="252" width="48" height="20" rx="10" fill="#117a65" fillOpacity="0.25" />
        <rect x="347" y="252" width="58" height="20" rx="10" fill="#e08a1e" fillOpacity="0.3" />

        <path
          d="M390 170C418 170 441 193 441 221C441 249 418 272 390 272C373 272 357 264 347 251L328 258L335 238C331 233 328 227 328 221C328 193 351 170 379 170H390Z"
          fill="url(#blobGrad)"
          fillOpacity="0.95"
        />
        <path d="M359 221H405" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        <path d="M359 238H391" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      </svg>

      <div className="absolute -right-3 top-8 rounded-2xl bg-white/90 px-3 py-2 text-xs font-semibold text-brand-700 shadow-soft">
        850+ verified consultations
      </div>
      <div className="absolute -left-3 bottom-8 rounded-2xl bg-accent-500/90 px-3 py-2 text-xs font-bold text-white shadow-soft">
        Low-cost legal help
      </div>
    </div>
  );
};

export default HeroVectors;
