import Button from './Button';
import Card from './Card';

export default function ErrorMessage({ message, onRetry, className = '' }) {
  return (
    <Card className={`border-[rgb(var(--color-error))] bg-[rgb(var(--color-error))] bg-opacity-10 ${className}`}>
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[rgb(var(--color-error))] flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-[rgb(var(--text-primary))] font-medium mb-2">
            {message || 'Something went wrong. Please try again.'}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="text-sm"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

