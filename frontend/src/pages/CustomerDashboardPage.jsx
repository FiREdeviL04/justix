import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import FilterBar from "../components/FilterBar";
import LawyerCard from "../components/LawyerCard";

const CustomerDashboardPage = () => {
  const [filters, setFilters] = useState({ query: "", specialization: "", experienceLevel: "", budget: "" });
  const [lawyers, setLawyers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const fetchSearch = useCallback(async (activeFilters = filters) => {
    const searchRes = await api.get("/search", { params: activeFilters });
    setLawyers(searchRes.data);
  }, [filters]);

  const fetchCustomerData = useCallback(async () => {
    const [favRes, bookingRes] = await Promise.all([
      api.get("/customer/favorites"),
      api.get("/customer/bookings"),
    ]);

    setFavorites(favRes.data);
    setBookings(bookingRes.data);
  }, []);

  const load = useCallback(async () => {
    setError("");
    const [searchResult, customerResult] = await Promise.allSettled([fetchSearch(), fetchCustomerData()]);

    if (searchResult.status === "rejected") {
      setError("Search failed. Please try again.");
    } else if (customerResult.status === "rejected") {
      setError("Some dashboard data could not be loaded, but search is available.");
    }
  }, [fetchSearch, fetchCustomerData]);

  useEffect(() => {
    load();
  }, [load]);

  const saveFavorite = useCallback(async (lawyerId) => {
    await api.post("/customer/favorites", { lawyerId });
    load();
  }, [load]);

  const removeFavorite = useCallback(async (lawyerId) => {
    await api.delete(`/customer/favorites/${lawyerId}`);
    setFavorites((prev) => prev.filter((fav) => fav.userId?._id !== lawyerId));
  }, []);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl text-brand-900">Customer Dashboard</h1>
      <FilterBar filters={filters} setFilters={setFilters} onSearch={fetchSearch} />
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lawyers.map((lawyer) => (
          <LawyerCard key={lawyer._id} lawyer={lawyer} onSave={saveFavorite} />
        ))}
      </div>

      <div className="card p-5">
        <h2 className="text-xl text-brand-900">Saved Lawyers</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {favorites.map((fav) => (
            <li key={fav._id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-100 p-3">
              <span>{fav.userId?.name} | {fav.pricing} | {fav.experienceLevel}</span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => removeFavorite(fav.userId?._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <h2 className="text-xl text-brand-900">Booking History</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {bookings.map((booking) => (
            <li key={booking._id}>
              {booking.lawyerId?.name} | {booking.type} | {booking.status}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CustomerDashboardPage;
