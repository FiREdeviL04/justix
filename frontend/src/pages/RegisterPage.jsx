import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const normalizedRole = useMemo(() => (role === "lawyer" ? "lawyer" : "customer"), [role]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/register", { ...form, role: normalizedRole });
      login(data.token, data.user);
      navigate(normalizedRole === "lawyer" ? "/lawyer/dashboard" : "/customer/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form className="card mx-auto max-w-lg space-y-4 p-6" onSubmit={handleSubmit}>
      <h1 className="text-2xl text-brand-900">
        {normalizedRole === "lawyer" ? "Lawyer Registration" : "Customer Registration"}
      </h1>
      <input className="input" placeholder="Full name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input
        className="input"
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full" type="submit">
        Create account
      </button>
    </form>
  );
};

export default RegisterPage;
