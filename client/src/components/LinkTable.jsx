import { Link } from 'react-router-dom';
import Button from './Button';

function formatDate(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function truncateUrl(url, maxLength = 50) {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

export default function LinkTable({ links, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-[rgb(var(--bg-tertiary))] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-[rgb(var(--border-color))]">
            <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Code</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">URL</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Clicks</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))] hidden md:table-cell">Last Clicked</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.code} className="border-b border-[rgb(var(--border-color))] hover:bg-[rgb(var(--bg-secondary))] transition-colors">
              <td className="py-3 px-4">
                <Link 
                  to={`/code/${link.code}`}
                  className="text-[rgb(var(--color-primary))] hover:underline font-mono text-sm"
                >
                  {link.code}
                </Link>
              </td>
              <td className="py-3 px-4">
                <span title={link.url} className="text-[rgb(var(--text-primary))] text-sm">
                  {truncateUrl(link.url, 40)}
                </span>
              </td>
              <td className="py-3 px-4 text-[rgb(var(--text-primary))] text-sm">{link.clicks}</td>
              <td className="py-3 px-4 text-[rgb(var(--text-secondary))] text-sm hidden md:table-cell">
                {formatDate(link.lastClicked)}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(link.shortUrl)}
                    className="text-xs px-2 py-1"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(link.code)}
                    className="text-xs px-2 py-1"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

