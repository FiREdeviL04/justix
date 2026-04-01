import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const LawyerProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [form, setForm] = useState({ type: "call", message: "", scheduledAt: "" });

  const loadLawyer = async () => {
    const { data } = await api.get(`/lawyers/${id}`);
    setLawyer(data);
  };

  useEffect(() => {
    loadLawyer();
  }, [id]);

  const submitInquiry = async () => {
    if (user?.role !== "customer") {
      alert("Login as customer to contact lawyer.");
      return;
    }

    await api.post("/inquiry", {
      lawyerId: id,
      type: form.type,
      message: form.message,
      scheduledAt: form.scheduledAt || undefined,
    });

    setForm({ type: "call", message: "", scheduledAt: "" });
    alert("Inquiry sent.");
  };

  if (!lawyer) return <p>Loading...</p>;

  return (
    <section className="space-y-6">
      <div className="card p-6">
        <h1 className="text-3xl text-brand-900">{lawyer.userId?.name}</h1>
        <p className="mt-2 text-slate-700">{lawyer.bio}</p>
        <p className="mt-2 text-sm text-slate-700">
          Experience: {lawyer.experienceYears} years ({lawyer.experienceLevel})
        </p>
        <p className="text-sm text-slate-700">Pricing: {lawyer.pricing}</p>
        <p className="text-sm text-slate-700">Rating: {lawyer.rating.toFixed(1)} / 5</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {lawyer.specialization.map((item) => (
            <span key={item} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl text-brand-900">Case Studies</h2>
        <div className="mt-3 space-y-3">
          {lawyer.caseStudies.map((cs) => (
            <article key={cs.title} className="rounded-xl border border-brand-100 p-3">
              <h3 className="font-semibold text-brand-900">{cs.title}</h3>
              <p className="text-sm text-slate-700">{cs.description}</p>
              <p className="text-xs text-brand-700">Outcome: {cs.outcome}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="card space-y-3 p-6">
        <h2 className="text-xl text-brand-900">Contact Lawyer</h2>
        <p className="text-sm text-slate-600">Phone: {lawyer.userId?.phone || "Not provided"}</p>
        <div className="flex flex-wrap gap-2">
          <a className="btn-primary" href={`tel:${lawyer.userId?.phone || ""}`}>Call</a>
          <a className="btn-secondary" href={`mailto:${lawyer.userId?.email || ""}`}>Email</a>
          <Link className="btn-secondary" to={`/book/${id}`}>Book Meeting</Link>
          <a
            className="btn-secondary"
            href={`https://wa.me/${(lawyer.userId?.phone || "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
        </select>
        <textarea
          className="input"
          placeholder="Write your requirement"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <input
          className="input"
          type="datetime-local"
          value={form.scheduledAt}
          onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
        />
        <button type="button" className="btn-primary" onClick={submitInquiry}>
          Schedule / Send Inquiry
        </button>
      </div>
    </section>
  );
};

export default LawyerProfilePage;
