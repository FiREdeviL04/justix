const FilterBar = ({ filters, setFilters, onSearch }) => {
  const runSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="card grid gap-3 p-4 md:grid-cols-4">
      <input
        className="input"
        placeholder="Search by name or bio"
        value={filters.query}
        onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
        onKeyDown={(e) => {
          if (e.key === "Enter") runSearch();
        }}
      />

      <select
        className="input"
        value={filters.specialization}
        onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
      >
        <option value="">All Practice Areas</option>
        <option>Criminal Law</option>
        <option>Civil Law</option>
        <option>Family Law</option>
        <option>Corporate Law</option>
        <option>Property Law</option>
        <option>Cyber Law</option>
      </select>

      <select
        className="input"
        value={filters.experienceLevel}
        onChange={(e) => setFilters((prev) => ({ ...prev, experienceLevel: e.target.value }))}
      >
        <option value="">All Experience Levels</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Experienced</option>
      </select>

      <div className="flex gap-2">
        <select
          className="input"
          value={filters.budget}
          onChange={(e) => setFilters((prev) => ({ ...prev, budget: e.target.value }))}
        >
          <option value="">All Budgets</option>
          <option>Low Cost</option>
          <option>Medium</option>
          <option>Premium</option>
        </select>
        <button className="btn-primary" type="button" onClick={runSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
