import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

function formatDate(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getLinkByCode(code);
        setLink(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      fetchLink();
    }
  }, [code]);

  const handleCopy = () => {
    if (link?.shortUrl) {
      navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--text-primary))]">Stats for {code}</h2>
        </div>
        <Card>
          <div className="space-y-4 animate-fade-in">
            <div className="h-6 bg-[rgb(var(--bg-tertiary))] rounded animate-pulse" />
            <div className="h-6 bg-[rgb(var(--bg-tertiary))] rounded animate-pulse w-3/4" />
            <div className="h-6 bg-[rgb(var(--bg-tertiary))] rounded animate-pulse w-1/2" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--text-primary))]">Stats for {code}</h2>
        </div>
        <ErrorMessage
          message={`Link with code "${code}" not found. It may have been deleted or never existed.`}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <h2 className="text-3xl font-bold text-[rgb(var(--text-primary))]">Stats for {code}</h2>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Short Code
            </label>
            <div className="flex items-center gap-3">
              <code className="px-4 py-2 bg-[rgb(var(--bg-primary))] rounded-lg border border-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] font-mono text-lg flex-1">
                {link.code}
              </code>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Short URL
            </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              readOnly
              value={link.shortUrl}
              className="flex-1 px-4 py-2.5 bg-[rgb(var(--bg-primary))] rounded-lg border border-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] text-sm min-h-[44px]"
            />
            <Button
              variant={copied ? 'success' : 'primary'}
              onClick={handleCopy}
              className="whitespace-nowrap w-full sm:w-auto"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Original URL
            </label>
            <div className="px-4 py-2 bg-[rgb(var(--bg-primary))] rounded-lg border border-[rgb(var(--border-color))]">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(var(--color-primary))] hover:underline break-all text-sm"
              >
                {link.url}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Total Clicks
              </label>
              <div className="text-3xl font-bold text-[rgb(var(--text-primary))]">
                {link.clicks}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Last Clicked
              </label>
              <div className="text-lg text-[rgb(var(--text-primary))]">
                {formatDate(link.lastClicked)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Created At
            </label>
            <div className="text-lg text-[rgb(var(--text-primary))]">
              {formatDate(link.createdAt)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

