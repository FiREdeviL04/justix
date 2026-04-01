import { useEffect, useState } from "react";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";
import { fetchLawyers } from "../services/legalService";

const ReportPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ lawyerId: "", issue: "" });
  const { toasts, pushToast, removeToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchLawyers();
        setLawyers(data);
      } catch (_error) {
        pushToast("Unable to load lawyers list.", "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [pushToast]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.lawyerId || form.issue.trim().length < 10) {
      pushToast("Please select lawyer and provide a detailed issue.", "error");
      return;
    }

    pushToast("Complaint submitted successfully. We will review it.");
    setForm({ lawyerId: "", issue: "" });
  };

  return (
    <section className="space-y-5">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <h1 className="text-3xl text-brand-900">Report / Complaint</h1>

      <form className="card space-y-4 p-6 max-w-2xl" onSubmit={submit}>
        <label className="text-sm font-semibold text-brand-700">Select Lawyer</label>
        <select
          className="input"
          value={form.lawyerId}
          onChange={(e) => setForm((prev) => ({ ...prev, lawyerId: e.target.value }))}
          disabled={loading}
        >
          <option value="">Choose lawyer</option>
          {lawyers.map((lawyer) => (
            <option key={lawyer.userId?._id} value={lawyer.userId?._id}>
              {lawyer.userId?.name}
            </option>
          ))}
        </select>

        <label className="text-sm font-semibold text-brand-700">Issue Description</label>
        <textarea
          className="input min-h-32"
          placeholder="Describe the issue in detail"
          value={form.issue}
          onChange={(e) => setForm((prev) => ({ ...prev, issue: e.target.value }))}
        />

        <button className="btn-primary" type="submit">Submit Complaint</button>
      </form>
    </section>
  );
};

export default ReportPage;
