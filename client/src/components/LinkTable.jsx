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

function SortIcon({ direction }) {
  if (!direction) {
    return (
      <svg className="w-4 h-4 text-[rgb(var(--text-tertiary))] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  
  if (direction === 'asc') {
    return (
      <svg className="w-4 h-4 text-[rgb(var(--color-primary))] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  }
  
  return (
    <svg className="w-4 h-4 text-[rgb(var(--color-primary))] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function LinkTable({ links, onDelete, isLoading, sortColumn, sortDirection, onSort, onCopySuccess }) {
  if (isLoading) {
    return (
      <div className="space-y-3 animate-fade-in">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-[rgb(var(--bg-tertiary))] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return null;
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      onSort(column, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, 'asc');
    }
  };

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-[rgb(var(--border-color))]">
            <th 
              className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))] cursor-pointer hover:bg-[rgb(var(--bg-secondary))] transition-colors select-none"
              onClick={() => handleSort('code')}
            >
              <div className="flex items-center">
                Code
                <SortIcon direction={sortColumn === 'code' ? sortDirection : null} />
              </div>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">URL</th>
            <th 
              className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))] cursor-pointer hover:bg-[rgb(var(--bg-secondary))] transition-colors select-none"
              onClick={() => handleSort('clicks')}
            >
              <div className="flex items-center">
                Clicks
                <SortIcon direction={sortColumn === 'clicks' ? sortDirection : null} />
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))] hidden md:table-cell cursor-pointer hover:bg-[rgb(var(--bg-secondary))] transition-colors select-none"
              onClick={() => handleSort('lastClicked')}
            >
              <div className="flex items-center">
                Last Clicked
                <SortIcon direction={sortColumn === 'lastClicked' ? sortDirection : null} />
              </div>
            </th>
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
                <span 
                  title={link.url} 
                  className="text-[rgb(var(--text-primary))] text-sm cursor-help"
                >
                  {truncateUrl(link.url, 40)}
                </span>
              </td>
              <td className="py-3 px-4 text-[rgb(var(--text-primary))] text-sm">{link.clicks}</td>
              <td className="py-3 px-4 text-[rgb(var(--text-secondary))] text-sm hidden md:table-cell">
                {formatDate(link.lastClicked)}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(link.shortUrl);
                      if (onCopySuccess) {
                        onCopySuccess();
                      }
                    }}
                    className="text-xs px-2 py-1 whitespace-nowrap"
                    title="Copy short URL"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(link.code, link.url)}
                    className="text-xs px-2 py-1 whitespace-nowrap"
                    title="Delete link"
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

