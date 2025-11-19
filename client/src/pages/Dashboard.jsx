import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Card from '../components/Card';
import LinkTable from '../components/LinkTable';
import EmptyState from '../components/EmptyState';
import AddLinkForm from '../components/AddLinkForm';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAllLinks();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      await api.deleteLink(code);
      setLinks(links.filter(link => link.code !== code));
    } catch (err) {
      alert('Failed to delete link: ' + err.message);
    }
  };

  const handleCreateLink = async (url, code) => {
    return await api.createLink(url, code);
  };

  const handleLinkCreated = () => {
    fetchLinks();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--text-primary))]">Dashboard</h2>
      
      {error && (
        <Card className="mb-6 border-[rgb(var(--color-error))]">
          <p className="text-[rgb(var(--color-error))]">Error: {error}</p>
        </Card>
      )}

      <AddLinkForm onSubmit={handleCreateLink} onSuccess={handleLinkCreated} />

      <Card>
        {links.length === 0 && !isLoading ? (
          <EmptyState onAddClick={() => document.querySelector('input[type="url"]')?.focus()} />
        ) : (
          <LinkTable 
            links={links} 
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}
      </Card>
    </div>
  );
}

