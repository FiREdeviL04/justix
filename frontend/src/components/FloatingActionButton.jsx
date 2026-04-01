import { useEffect, useState } from "react";

const FloatingActionButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 left-5 z-40 rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
    >
      Back to top
    </button>
  );
};

export default FloatingActionButton;
