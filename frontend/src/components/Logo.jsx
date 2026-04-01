const Logo = ({ compact = false, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className={compact ? "h-9 w-9" : "h-10 w-10"} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="justixLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#111111" />
          </linearGradient>
        </defs>

        <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#justixLogoGrad)" />
        <path d="M20 24H44" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <path d="M32 24V42C32 47 28.5 50 23.5 50" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <path d="M20 28L15.5 36H24.5L20 28Z" fill="#ffffff" fillOpacity="0.95" />
        <path d="M44 28L39.5 36H48.5L44 28Z" fill="#ffffff" fillOpacity="0.95" />
      </svg>

      {!compact && (
        <span className="text-xl font-heading tracking-tight" style={{ color: "var(--fg)" }}>Justix</span>
      )}
    </div>
  );
};

export default Logo;
