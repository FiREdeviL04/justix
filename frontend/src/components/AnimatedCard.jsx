const AnimatedCard = ({ children, className = "", ...props }) => {
  return (
    <article className={className} {...props}>
      {children}
    </article>
  );
};

export default AnimatedCard;
