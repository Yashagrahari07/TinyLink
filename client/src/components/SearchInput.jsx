export default function SearchInput({ value, onChange, placeholder = 'Search by code or URL...' }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-[rgb(var(--text-tertiary))]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-2 rounded-lg border
          bg-[rgb(var(--bg-primary))] 
          border-[rgb(var(--border-color))] 
          text-[rgb(var(--text-primary))] 
          focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]
        "
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text-primary))] transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

