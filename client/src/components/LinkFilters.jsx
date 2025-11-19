export default function LinkFilters({ sortBy, onSortChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-[rgb(var(--text-secondary))] whitespace-nowrap">
        Sort by:
      </label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="
          px-3 py-2.5 rounded-lg border text-base
          bg-[rgb(var(--bg-primary))] 
          border-[rgb(var(--border-color))] 
          text-[rgb(var(--text-primary))] 
          focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]
          cursor-pointer min-h-[44px] touch-manipulation
        "
      >
        <option value="created">Date Created</option>
        <option value="clicks">Most Clicks</option>
        <option value="recent">Recently Clicked</option>
        <option value="code">Code (A-Z)</option>
      </select>
    </div>
  );
}

