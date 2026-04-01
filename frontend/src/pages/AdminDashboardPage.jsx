import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import ToastContainer from "../components/ToastContainer";
import useToast from "../hooks/useToast";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState({});
  const { toasts, pushToast, removeToast } = useToast();

  const load = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([api.get("/admin/stats"), api.get("/admin/users")]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (_error) {
      pushToast("Something went wrong", "error");
    }
  }, [pushToast]);

  useEffect(() => {
    load();
  }, [load]);

  const moderateLawyer = async (lawyerId, status) => {
    const key = `${lawyerId}-${status}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));

    try {
      await api.put("/admin/approve-lawyer", { lawyerId, approvalStatus: status });

      setUsers((prev) =>
        prev.map((user) =>
          user._id === lawyerId
            ? {
                ...user,
                approvalStatus: status,
                approved: status === "approved",
              }
            : user
        )
      );

      setStats((prev) =>
        prev
          ? {
              ...prev,
              pendingLawyers: status === "approved" && prev.pendingLawyers > 0 ? prev.pendingLawyers - 1 : prev.pendingLawyers,
            }
          : prev
      );

      if (status === "approved") pushToast("Lawyer Approved");
      else pushToast("Lawyer Rejected");
    } catch (_error) {
      pushToast("Something went wrong", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <section className="space-y-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <h1 className="text-3xl text-brand-900">Admin Dashboard</h1>

      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <div className="card p-4">Users: {stats.totalUsers}</div>
          <div className="card p-4">Lawyers: {stats.lawyers}</div>
          <div className="card p-4">Customers: {stats.customers}</div>
          <div className="card p-4">Pending Lawyers: {stats.pendingLawyers}</div>
          <div className="card p-4">Inquiries: {stats.totalInquiries}</div>
        </div>
      )}

      <div className="card p-5">
        <h2 className="mb-3 text-xl text-brand-900">Manage Users</h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-100 p-3 text-sm">
              <p>
                {u.name} | {u.email} | {u.role}
              </p>
              {u.role === "lawyer" && (
                <div className="flex gap-2">
                  <button
                    className="btn-primary"
                    onClick={() => moderateLawyer(u._id, "approved")}
                    disabled={Boolean(u.approved) || u.approvalStatus === "approved" || actionLoading[`${u._id}-approved`]}
                  >
                    {actionLoading[`${u._id}-approved`] ? "Approving..." : (Boolean(u.approved) || u.approvalStatus === "approved") ? "Approved" : "Approve"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => moderateLawyer(u._id, "rejected")}
                    disabled={actionLoading[`${u._id}-rejected`]}
                  >
                    {actionLoading[`${u._id}-rejected`] ? "Rejecting..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
