import { useEffect } from 'react';

export default function Toast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in slide-in-from-bottom-5">
      <div className="bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--color-success))] rounded-lg shadow-lg p-4 min-w-[200px] transform transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-[rgb(var(--color-success))]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-[rgb(var(--text-primary))] text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

