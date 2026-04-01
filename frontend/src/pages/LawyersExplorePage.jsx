import { useEffect, useMemo, useState, useCallback } from "react";
import FilterSidebar from "../components/FilterSidebar";
import LawyerCard from "../components/LawyerCard";
import { fetchLawyers } from "../services/legalService";

const initialFilters = {
  experienceLevel: "",
  specialization: "",
  budget: "",
};

const LawyersExplorePage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("rating");
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLawyers = useCallback(async (activeFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLawyers(activeFilters);
      setLawyers(data);
    } catch (_err) {
      setError("Unable to load lawyers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLawyers();
  }, [loadLawyers]);

  const sortedLawyers = useMemo(() => {
    const list = [...lawyers];
    if (sortBy === "experience") {
      return list.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    }
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [lawyers, sortBy]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    loadLawyers(initialFilters);
  }, [loadLawyers]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl text-brand-900">Find / Explore Lawyers</h1>
        <p className="mt-1 text-sm text-slate-600">Discover verified lawyers by experience, category, and budget.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onApply={() => loadLawyers(filters)}
          onReset={resetFilters}
        />

        <div>
          {loading && (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="card h-52 animate-pulse bg-brand-50" />
              ))}
            </div>
          )}

          {!loading && error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && sortedLawyers.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-brand-900">No lawyers found for selected filters.</p>
              <p className="mt-1 text-sm text-slate-600">Try adjusting experience, category, or budget.</p>
            </div>
          )}

          {!loading && !error && sortedLawyers.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {sortedLawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LawyersExplorePage;
