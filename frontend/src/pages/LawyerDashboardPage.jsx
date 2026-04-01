import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import { createBlog, fetchMyBlogStatus } from "../services/blogService";

const specializationOptions = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Property Law",
  "Cyber Law",
];

const LawyerDashboardPage = () => {
  const [profile, setProfile] = useState({
    experienceYears: 0,
    specialization: [],
    bio: "",
    pricing: "Low Cost",
    availability: true,
  });
  const [inquiries, setInquiries] = useState([]);
  const [caseStudy, setCaseStudy] = useState({ title: "", description: "", outcome: "" });
  const [blog, setBlog] = useState({ title: "", content: "", category: "General Legal Advice" });
  const [blogStatus, setBlogStatus] = useState({ canPost: true, message: "You can post 1 blog today" });
  const [blogSaving, setBlogSaving] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const fetchMyData = useCallback(async () => {
    const [profileRes, inquiriesRes] = await Promise.all([api.get("/lawyers/me"), api.get("/lawyers/inquiries/all")]);

    const mine = profileRes.data;
    if (mine) {
      setProfile({
        experienceYears: mine.experienceYears || 0,
        specialization: mine.specialization || [],
        bio: mine.bio || "",
        pricing: mine.pricing || "Low Cost",
        availability: Boolean(mine.availability),
      });
    }

    setInquiries(inquiriesRes.data);
  }, []);

  const loadBlogStatus = useCallback(async () => {
    try {
      const status = await fetchMyBlogStatus();
      setBlogStatus(status);
    } catch {
      setBlogStatus({ canPost: true, message: "You can post 1 blog today" });
    }
  }, []);

  useEffect(() => {
    fetchMyData();
    loadBlogStatus();
  }, [fetchMyData, loadBlogStatus]);

  const updateProfile = async () => {
    await api.put("/lawyers/profile", {
      ...profile,
      specialization: profile.specialization,
    });
    alert("Profile updated and submitted for approval.");
  };

  const addCaseStudy = async () => {
    await api.post("/lawyers/case-study", caseStudy);
    setCaseStudy({ title: "", description: "", outcome: "" });
    alert("Case study added.");
  };

  const respond = async (id, status) => {
    await api.put(`/lawyers/inquiries/${id}/respond`, { status });
    fetchMyData();
  };

  const publishBlog = async () => {
    if (!blog.title.trim() || !blog.content.trim() || !blog.category.trim()) {
      alert("Please fill title, content, and category.");
      return;
    }

    if (!blogStatus.canPost) {
      alert("You can only post 1 blog per day");
      return;
    }

    try {
      setBlogSaving(true);
      await createBlog(blog);
      setBlog({ title: "", content: "", category: "General Legal Advice" });
      await loadBlogStatus();
      alert("Blog published successfully.");
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to publish blog");
    } finally {
      setBlogSaving(false);
    }
  };

  const addSpecialization = () => {
    if (!selectedSpecialization) return;
    if (profile.specialization.includes(selectedSpecialization)) return;

    setProfile((prev) => ({
      ...prev,
      specialization: [...prev.specialization, selectedSpecialization],
    }));
    setSelectedSpecialization("");
  };

  const removeSpecialization = (item) => {
    setProfile((prev) => ({
      ...prev,
      specialization: prev.specialization.filter((sp) => sp !== item),
    }));
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl text-brand-900">Lawyer Dashboard</h1>

      <div className="card grid gap-3 p-5">
        <h2 className="text-xl text-brand-900">Manage Profile</h2>
        <input
          className="input"
          type="number"
          placeholder="Experience (years)"
          value={profile.experienceYears}
          onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
        />
        <textarea
          className="input"
          placeholder="Bio"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-700">Specialization</label>
          <div className="flex gap-2">
            <select
              className="input"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">Select specialization</option>
              {specializationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" className="btn-secondary" onClick={addSpecialization}>
              Add
            </button>
          </div>

          {profile.specialization.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.specialization.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-700">
                  {item}
                  <button type="button" className="font-bold" onClick={() => removeSpecialization(item)}>
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <select
          className="input"
          value={profile.pricing}
          onChange={(e) => setProfile({ ...profile, pricing: e.target.value })}
        >
          <option>Low Cost</option>
          <option>Medium</option>
          <option>Premium</option>
        </select>
        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={profile.availability}
            onChange={(e) => setProfile({ ...profile, availability: e.target.checked })}
          />
          Available for new clients
        </label>
        <button className="btn-primary" type="button" onClick={updateProfile}>
          Save profile
        </button>
      </div>

      <div className="card grid gap-3 p-5">
        <h2 className="text-xl text-brand-900">Add Case Study</h2>
        <input
          className="input"
          placeholder="Title"
          value={caseStudy.title}
          onChange={(e) => setCaseStudy({ ...caseStudy, title: e.target.value })}
        />
        <textarea
          className="input"
          placeholder="Description"
          value={caseStudy.description}
          onChange={(e) => setCaseStudy({ ...caseStudy, description: e.target.value })}
        />
        <input
          className="input"
          placeholder="Outcome"
          value={caseStudy.outcome}
          onChange={(e) => setCaseStudy({ ...caseStudy, outcome: e.target.value })}
        />
        <button className="btn-primary" type="button" onClick={addCaseStudy}>
          Add case study
        </button>
      </div>

      <div className="card p-5">
        <h2 className="mb-3 text-xl text-brand-900">Customer Inquiries</h2>
        <div className="space-y-3">
          {inquiries.map((item) => (
            <div key={item._id} className="rounded-xl border border-brand-100 p-3">
              <p className="text-sm">
                <strong>{item.customerId?.name}</strong> requested <strong>{item.type}</strong>
              </p>
              <p className="text-sm text-slate-700">{item.message}</p>
              <p className="text-xs text-slate-500">Status: {item.status}</p>
              {item.status === "accepted" && (item.customerId?.email || item.customerId?.phone) && (
                <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-900">
                  <p className="font-semibold">Customer contact details</p>
                  {item.customerId?.email ? <p>Email: {item.customerId.email}</p> : null}
                  {item.customerId?.phone ? <p>Phone: {item.customerId.phone}</p> : null}
                </div>
              )}
              {item.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button className="btn-primary" onClick={() => respond(item._id, "accepted")}>Accept</button>
                  <button className="btn-secondary" onClick={() => respond(item._id, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card grid gap-3 p-5">
        <h2 className="text-xl text-brand-900">Publish Legal Blog</h2>
        <p className={`text-sm font-semibold ${blogStatus.canPost ? "text-emerald-700" : "text-red-600"}`}>
          {blogStatus.canPost ? "You can post 1 blog today" : "Limit reached"}
        </p>
        <input
          className="input"
          placeholder="Blog title"
          value={blog.title}
          onChange={(e) => setBlog((prev) => ({ ...prev, title: e.target.value }))}
          disabled={!blogStatus.canPost || blogSaving}
        />
        <input
          className="input"
          placeholder="Category (e.g. Property Law)"
          value={blog.category}
          onChange={(e) => setBlog((prev) => ({ ...prev, category: e.target.value }))}
          disabled={!blogStatus.canPost || blogSaving}
        />
        <textarea
          className="input min-h-32"
          placeholder="Write a clear legal insight article for clients..."
          value={blog.content}
          onChange={(e) => setBlog((prev) => ({ ...prev, content: e.target.value }))}
          disabled={!blogStatus.canPost || blogSaving}
        />
        <button
          className="btn-primary"
          type="button"
          onClick={publishBlog}
          disabled={!blogStatus.canPost || blogSaving}
        >
          {blogSaving ? "Publishing..." : "Publish blog"}
        </button>
      </div>
    </section>
  );
};

export default LawyerDashboardPage;
