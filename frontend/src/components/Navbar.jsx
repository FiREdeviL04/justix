import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import MagneticButton from "./MagneticButton";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseLink = ({ isActive }) =>
    isActive
      ? "nav-pill nav-pill-active"
      : "nav-pill";

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 md:px-6">
      <nav className="fx-nav fx-nav-animated mx-auto flex max-w-7xl items-center justify-between gap-3 p-3 md:p-4">
        <div className="fx-brand-wrap">
          <Link to="/" className="inline-flex items-center">
            <Logo />
          </Link>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">Trusted Legal Connect</p>
        </div>

        <button
          type="button"
          className="fx-menu-btn md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          Menu
        </button>

        <div className="hidden items-center gap-2 text-sm font-semibold md:flex">
          <NavLink
            to="/"
            className={baseLink}
          >
            Home
          </NavLink>
          <NavLink to="/lawyers" className={baseLink}>Find Lawyers</NavLink>
          <NavLink to="/how-it-works" className={baseLink}>How It Works</NavLink>
          <NavLink to="/blog" className={baseLink}>Blog</NavLink>
          <NavLink to="/about" className={baseLink}>About</NavLink>
          <NavLink to="/contact" className={baseLink}>Contact</NavLink>

          {!user && (
            <>
              <NavLink to="/login">
                <MagneticButton className="btn-primary">Login</MagneticButton>
              </NavLink>
            </>
          )}

          <ThemeToggle />

          {user?.role === "lawyer" && (
            <NavLink to="/lawyer/dashboard" className={baseLink}>
              Dashboard
            </NavLink>
          )}
          {user?.role === "customer" && (
            <NavLink to="/customer/dashboard" className={baseLink}>
              Dashboard
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin/dashboard" className={baseLink}>
              Dashboard
            </NavLink>
          )}

          {user && (
            <button type="button" onClick={logout} className="fx-ghost-btn">
              Logout
            </button>
          )}
        </div>
      </nav>

      {mobileOpen && (
          <div className="fx-mobile-panel md:hidden">
            <div className="flex flex-col gap-2 text-sm font-semibold">
              <NavLink to="/" className={baseLink} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/lawyers" className={baseLink} onClick={closeMenu}>Find Lawyers</NavLink>
              <NavLink to="/how-it-works" className={baseLink} onClick={closeMenu}>How It Works</NavLink>
              <NavLink to="/about" className={baseLink} onClick={closeMenu}>About</NavLink>
              <NavLink to="/contact" className={baseLink} onClick={closeMenu}>Contact</NavLink>
              <NavLink to="/faq" className={baseLink} onClick={closeMenu}>FAQ</NavLink>
              <NavLink to="/blog" className={baseLink} onClick={closeMenu}>Blog</NavLink>
              <NavLink to="/reviews" className={baseLink} onClick={closeMenu}>Reviews</NavLink>
              <NavLink to="/report" className={baseLink} onClick={closeMenu}>Report</NavLink>

              {!user && <NavLink to="/login" className="btn-primary" onClick={closeMenu}>Login</NavLink>}
              <ThemeToggle />
              {user?.role === "lawyer" && <NavLink to="/lawyer/dashboard" className={baseLink} onClick={closeMenu}>Profile</NavLink>}
              {user?.role === "customer" && <NavLink to="/customer/dashboard" className={baseLink} onClick={closeMenu}>Profile</NavLink>}
              {user?.role === "admin" && <NavLink to="/admin/dashboard" className={baseLink} onClick={closeMenu}>Profile</NavLink>}

              {user && (
                <button type="button" onClick={logout} className="fx-ghost-btn">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
    </header>
  );
};

export default Navbar;
