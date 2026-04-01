import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("jx_theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("jx_theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
    >
      {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;
