import { Link } from 'react-router-dom';
import Button from './Button';

function formatDate(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function truncateUrl(url, maxLength = 60) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

export default function LinkCard({ link, onDelete, onCopySuccess }) {
  return (
    <div className="bg-[rgb(var(--bg-secondary))] border border-[rgb(var(--border-color))] rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link 
          to={`/code/${link.code}`}
          className="text-[rgb(var(--color-primary))] hover:underline font-mono text-base font-semibold flex-1"
        >
          {link.code}
        </Link>
        <div className="text-sm text-[rgb(var(--text-secondary))] font-medium">
          {link.clicks} {link.clicks === 1 ? 'click' : 'clicks'}
        </div>
      </div>

      <div>
        <p className="text-xs text-[rgb(var(--text-secondary))] mb-1">URL</p>
        <p 
          title={link.url}
          className="text-sm text-[rgb(var(--text-primary))] break-words"
        >
          {truncateUrl(link.url, 60)}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-[rgb(var(--text-secondary))]">
        <span>Last clicked: {formatDate(link.lastClicked)}</span>
      </div>

      <div className="flex gap-2 pt-2 border-t border-[rgb(var(--border-color))]">
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(link.shortUrl);
            if (onCopySuccess) {
              onCopySuccess();
            }
          }}
          className="flex-1 min-h-[44px] text-sm"
          title="Copy short URL"
        >
          Copy
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(link.code, link.url)}
          className="flex-1 min-h-[44px] text-sm"
          title="Delete link"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

