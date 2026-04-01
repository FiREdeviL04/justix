const FilterSidebar = ({ filters, setFilters, sortBy, setSortBy, onApply, onReset }) => {
  return (
    <aside className="card space-y-4 p-4">
      <h3 className="text-lg text-brand-900">Filters</h3>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">Experience</label>
        <select
          className="input"
          value={filters.experienceLevel}
          onChange={(e) => setFilters((prev) => ({ ...prev, experienceLevel: e.target.value }))}
        >
          <option value="">All</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Experienced">Experienced</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">Category</label>
        <select
          className="input"
          value={filters.specialization}
          onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
        >
          <option value="">All</option>
          <option value="Criminal Law">Criminal</option>
          <option value="Civil Law">Civil</option>
          <option value="Family Law">Family</option>
          <option value="Corporate Law">Corporate</option>
          <option value="Property Law">Property</option>
          <option value="Cyber Law">Cyber</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">Budget</label>
        <select
          className="input"
          value={filters.budget}
          onChange={(e) => setFilters((prev) => ({ ...prev, budget: e.target.value }))}
        >
          <option value="">All</option>
          <option value="Low Cost">Low</option>
          <option value="Medium">Medium</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-700">Sort</label>
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="rating">Rating (High to Low)</option>
          <option value="experience">Experience (High to Low)</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button className="btn-primary" type="button" onClick={onApply}>
          Apply
        </button>
        <button className="btn-secondary" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
