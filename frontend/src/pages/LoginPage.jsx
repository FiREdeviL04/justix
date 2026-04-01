import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const roleOptions = [
  { key: "customer", label: "Customer" },
  { key: "lawyer", label: "Lawyer" },
  { key: "admin", label: "Admin" },
];

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [selectedRole, setSelectedRole] = useState("customer");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      login(data.token, data.user);

      if (data.user.role === "lawyer") navigate("/lawyer/dashboard");
      else if (data.user.role === "customer") navigate("/customer/dashboard");
      else navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="card mx-auto max-w-md space-y-4 p-6" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-brand-900">Login</h1>
      <div className="grid grid-cols-3 rounded-xl border border-brand-100 bg-brand-50 p-1">
        {roleOptions.map((role) => (
          <button
            key={role.key}
            type="button"
            onClick={() => setSelectedRole(role.key)}
            className={
              selectedRole === role.key
                ? "rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white"
                : "rounded-lg px-3 py-2 text-sm font-semibold text-brand-700"
            }
          >
            {role.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-600">
        {selectedRole === "admin" && "Admin access: use your authorized admin credentials."}
        {selectedRole === "lawyer" && "Lawyer access: login to manage profile, cases, and inquiries."}
        {selectedRole === "customer" && "Customer access: login to search, connect, and book lawyers."}
      </p>

      <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input
        className="input"
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full" type="submit">
        Continue
      </button>

      {selectedRole !== "admin" && (
        <p className="text-center text-sm text-slate-600">
          <Link to="/forgot-password" className="font-semibold text-brand-700 underline">
            Forgot password?
          </Link>
        </p>
      )}

      {selectedRole !== "admin" && (
        <p className="text-center text-sm text-slate-600">
          New {selectedRole}?{" "}
          <Link to={`/register/${selectedRole}`} className="font-semibold text-brand-700 underline">
            Create account
          </Link>
        </p>
      )}
    </form>
  );
};

export default LoginPage;
