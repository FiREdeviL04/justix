import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-brand-100 bg-white/70 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3 md:px-16">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-slate-600">
            Affordable legal guidance for middle-class families and small businesses.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-700">Quick Links</p>
          <div className="mt-2 flex flex-col gap-1 text-sm text-slate-700">
            <Link to="/lawyers">Find Lawyers</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/reviews">Reviews</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-700">Support</p>
          <p className="mt-2 text-sm text-slate-700">Phone: +91 90000 00000</p>
          <p className="text-sm text-slate-700">Email: support@justix.com</p>
          <Link to="/contact" className="mt-3 inline-flex text-sm font-semibold text-brand-700 underline">
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
