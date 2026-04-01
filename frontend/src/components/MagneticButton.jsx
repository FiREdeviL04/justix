const MagneticButton = ({ className = "", children, ...props }) => {
  return (
    <button className={`${className} shine-btn`} {...props}>
      <span className="relative z-10">{children}</span>
      <span className="ripple" aria-hidden="true" />
    </button>
  );
};

export default MagneticButton;
