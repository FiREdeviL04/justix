import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileText, Home, Scale, ShieldCheck, Users } from "lucide-react";
import LawyerCard from "../components/LawyerCard";
import BlogCard from "../components/BlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import useBlogs from "../hooks/useBlogs";
import { fetchLawyers as fetchLawyersService } from "../services/legalService";

const HomePage = () => {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const { blogs, loading: blogsLoading } = useBlogs({ page: 1, limit: 5 });
  const heroHeadline = "Connect with Trusted Lawyers in Minutes";

  const fetchLawyers = async () => {
    const data = await fetchLawyersService();
    setLawyers(data);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const affordable = useMemo(() => lawyers.filter((l) => l.pricing === "Low Cost"), [lawyers]);
  const beginner = useMemo(() => lawyers.filter((l) => l.experienceLevel === "Beginner"), [lawyers]);
  const latestBlogs = useMemo(() => blogs.slice(0, 5), [blogs]);

  const categories = [
    { icon: Scale, title: "Criminal", query: "Criminal Law" },
    { icon: FileText, title: "Civil", query: "Civil Law" },
    { icon: Users, title: "Family", query: "Family Law" },
    { icon: Building2, title: "Corporate", query: "Corporate Law" },
    { icon: Home, title: "Property", query: "Property Law" },
    { icon: ShieldCheck, title: "Cyber", query: "Cyber Law" },
  ];

  const goToCategory = useCallback(
    (query) => navigate(`/lawyers?specialization=${encodeURIComponent(query)}`),
    [navigate]
  );



  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <section className="px-6 pb-16 pt-8 md:px-16 md:pt-16">
        <div className="grid items-center gap-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Online Legal Consultation Platform</p>
            <div className="relative mt-3 min-h-[8rem] md:min-h-[11rem]">
              <h1 className="absolute inset-0 text-4xl font-bold leading-tight text-brand-900 md:text-6xl">
                {heroHeadline}
              </h1>
            </div>
            <p className="mt-4 max-w-xl text-lg text-slate-700">
              Justix helps you find trusted criminal, civil, family, corporate, property, and cyber lawyers with transparent fees and easy online booking.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-left">
              <div className="rounded-2xl border border-brand-100 bg-white/60 p-3">
                <p className="text-2xl font-heading text-brand-900">3K+</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Verified Lawyers</p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-white/60 p-3">
                <p className="text-2xl font-heading text-brand-900">12K+</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Consultations</p>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-white/60 p-3">
                <p className="text-2xl font-heading text-brand-900">30m</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Avg Response</p>
              </div>
            </div>
          </div>


        </div>

      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-brand-900">Legal Practice Areas</h2>
          <p className="mt-1 text-slate-600">Choose your case type and connect with a verified lawyer online.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <button
              type="button"
              key={item.title}
              onClick={() => goToCategory(item.query)}
              className="rounded-2xl border border-brand-100 bg-white/70 p-5 text-left transition hover:-translate-y-1 hover:shadow-soft"
            >
              <item.icon size={24} className="text-brand-700" />
              <p className="mt-3 text-xl font-semibold text-brand-900">{item.title}</p>
              <p className="text-sm text-slate-600">Find verified {item.title.toLowerCase()} lawyers for online legal advice.</p>
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-brand-900">Top Rated Lawyers</h2>
            <p className="mt-1 text-slate-600">Browse top rated lawyers for fast, reliable legal consultation.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lawyers.slice(0, 6).map((lawyer) => (
            <LawyerCard key={lawyer._id} lawyer={lawyer} />
          ))}
        </div>
      </section>

      <section className="bg-white/50 px-6 py-16 md:px-16">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-brand-900">Affordable Lawyer Consultation</h2>
          <p className="mt-1 text-slate-600">Compare affordable lawyers and book legal advice within your budget.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...affordable, ...beginner].slice(0, 6).map((lawyer) => (
            <LawyerCard key={`${lawyer._id}-aff`} lawyer={lawyer} />
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-brand-900">How Our Legal Service Works</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            "Search lawyer",
            "View profile",
            "Connect instantly",
            "Solve your case",
          ].map((step, idx) => (
            <div key={step} className="rounded-2xl border border-brand-100 bg-white/70 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Step {idx + 1}</p>
              <p className="mt-2 text-lg font-semibold text-brand-900">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-brand-900">Latest Legal Blogs</h2>
            <p className="mt-1 text-slate-600">Recent legal insights from verified lawyers.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => navigate("/blog")}>
            View all
          </button>
        </div>
        {blogsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <BlogCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      <section className="px-6 pb-16 md:px-16">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-brand-900">Client Reviews</h2>
          <p className="mt-1 text-slate-600">Real stories from clients who booked lawyers on Justix.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "I found a family lawyer within my budget in under an hour.",
            "The booking flow is simple and non-technical users can use it easily.",
            "Verified profiles gave me confidence before spending money.",
          ].map((quote) => (
            <article key={quote} className="rounded-2xl border border-brand-100 bg-white/70 p-5">
              <p className="text-sm text-slate-700">"{quote}"</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-700">Justix User</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
