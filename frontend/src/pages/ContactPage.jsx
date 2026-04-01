import { useState } from "react";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const { toasts, pushToast, removeToast } = useToast();

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Valid email is required";
    if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      pushToast("Please fix the form errors.", "error");
      return;
    }

    pushToast("Message submitted. Our team will contact you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="space-y-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <h1 className="text-3xl text-brand-900">Contact Us</h1>

      <div className="grid gap-5 md:grid-cols-2">
        <form className="card space-y-4 p-6" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}

          <input
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}

          <textarea
            className="input min-h-32"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          />
          {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}

          <button type="submit" className="btn-primary w-full">Send message</button>
        </form>

        <div className="card p-6">
          <h2 className="text-xl text-brand-900">Support Details</h2>
          <p className="mt-3 text-sm text-slate-700">Phone: +91 90000 00000</p>
          <p className="text-sm text-slate-700">Email: support@justix.com</p>
          <p className="mt-2 text-sm text-slate-600">Mon-Sat, 9:00 AM to 7:00 PM</p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
