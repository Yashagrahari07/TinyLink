import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Card from '../components/Card';
import LinkTable from '../components/LinkTable';
import EmptyState from '../components/EmptyState';
import AddLinkForm from '../components/AddLinkForm';
import ConfirmationModal from '../components/ConfirmationModal';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, code: null, url: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleDeleteClick = (code, url) => {
    setDeleteModal({ isOpen: true, code, url });
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.code) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await api.deleteLink(deleteModal.code);
      setLinks(links.filter(link => link.code !== deleteModal.code));
      setSuccessMessage('Link deleted successfully');
      setDeleteModal({ isOpen: false, code: null, url: '' });
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, code: null, url: '' });
    setDeleteError(null);
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

      {successMessage && (
        <Card className="mb-6 border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))] bg-opacity-10">
          <p className="text-[rgb(var(--text-primary))] font-medium">{successMessage}</p>
        </Card>
      )}

      <AddLinkForm onSubmit={handleCreateLink} onSuccess={handleLinkCreated} />

      <Card>
        {links.length === 0 && !isLoading ? (
          <EmptyState onAddClick={() => document.querySelector('input[type="url"]')?.focus()} />
        ) : (
          <LinkTable 
            links={links} 
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        )}
      </Card>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        message={`Are you sure you want to delete the link for "${deleteModal.url}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  );
}

