export default function EmptyState({ onAddClick }) {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg 
          className="w-16 h-16 mx-auto text-[rgb(var(--text-tertiary))]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-[rgb(var(--text-primary))] mb-2">
        No links yet
      </h3>
      <p className="text-[rgb(var(--text-secondary))] mb-6">
        Get started by creating your first shortened link
      </p>
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Create Your First Link
        </button>
      )}
    </div>
  );
}

