import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const roleOptions = [
  { key: "customer", label: "Customer" },
  { key: "lawyer", label: "Lawyer" },
];

const ForgotPasswordPage = () => {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromQuery = params.get("token");
    const roleFromQuery = params.get("role");

    if (tokenFromQuery) setToken(tokenFromQuery);
    if (roleFromQuery && ["customer", "lawyer"].includes(roleFromQuery)) {
      setRole(roleFromQuery);
    }
  }, []);

  const requestToken = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email, role });
      setMessage("Password reset link sent to your email. Open it to continue.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to generate reset token");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMessage("Password reset successful. You can login now.");
      setNewPassword("");
      setToken("");
    } catch (err) {
      setError(err?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg space-y-5">
      <div className="card p-6">
        <h1 className="text-2xl text-brand-900">Forgot Password</h1>
        <p className="mt-1 text-sm text-slate-600">Available for customer and lawyer accounts.</p>

        <form className="mt-4 space-y-3" onSubmit={requestToken}>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-brand-100 bg-brand-50 p-1">
            {roleOptions.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setRole(item.key)}
                className={
                  role === item.key
                    ? "rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white"
                    : "rounded-lg px-3 py-2 text-sm font-semibold text-brand-700"
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <input
            className="input"
            type="email"
            placeholder="Registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Generating..." : "Generate Reset Token"}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-xl text-brand-900">Reset Password</h2>
        <form className="mt-4 space-y-3" onSubmit={resetPassword}>
          <input
            className="input"
            placeholder="Reset token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>

      {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <p className="text-sm text-slate-600">
        Remembered your password? <Link to="/login" className="font-semibold text-brand-700 underline">Back to login</Link>
      </p>
    </section>
  );
};

export default ForgotPasswordPage;
