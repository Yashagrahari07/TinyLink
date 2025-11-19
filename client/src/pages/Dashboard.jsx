import { useState, useEffect, useMemo } from 'react';
import { api } from '../utils/api';
import Card from '../components/Card';
import LinkTable from '../components/LinkTable';
import EmptyState from '../components/EmptyState';
import AddLinkForm from '../components/AddLinkForm';
import ConfirmationModal from '../components/ConfirmationModal';
import SearchInput from '../components/SearchInput';
import LinkFilters from '../components/LinkFilters';
import Toast from '../components/Toast';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [tableSortColumn, setTableSortColumn] = useState(null);
  const [tableSortDirection, setTableSortDirection] = useState('asc');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
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

  const handleTableSort = (column, direction) => {
    setTableSortColumn(column);
    setTableSortDirection(direction);
    setSortBy('table');
  };

  const filteredAndSortedLinks = useMemo(() => {
    let result = [...links];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(link => {
        const codeMatch = link.code.toLowerCase().includes(query);
        const urlMatch = link.url.toLowerCase().includes(query);
        return codeMatch || urlMatch;
      });
    }

    if (sortBy === 'table' && tableSortColumn) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (tableSortColumn) {
          case 'code':
            comparison = a.code.localeCompare(b.code);
            break;
          case 'clicks':
            comparison = a.clicks - b.clicks;
            break;
          case 'lastClicked':
            const aDate = a.lastClicked ? new Date(a.lastClicked) : new Date(0);
            const bDate = b.lastClicked ? new Date(b.lastClicked) : new Date(0);
            comparison = aDate - bDate;
            break;
          default:
            return 0;
        }
        return tableSortDirection === 'asc' ? comparison : -comparison;
      });
    } else {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'clicks':
            return b.clicks - a.clicks;
          case 'recent':
            const aDate = a.lastClicked ? new Date(a.lastClicked) : new Date(0);
            const bDate = b.lastClicked ? new Date(b.lastClicked) : new Date(0);
            return bDate - aDate;
          case 'code':
            return a.code.localeCompare(b.code);
          case 'created':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    return result;
  }, [links, searchQuery, sortBy, tableSortColumn, tableSortDirection]);

  const handleCopySuccess = () => {
    setToastMessage('Link copied to clipboard!');
    setShowToast(true);
  };

  const hasNoResults = !isLoading && links.length > 0 && filteredAndSortedLinks.length === 0;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--text-primary))]">Dashboard</h2>
      
      {error && (
        <ErrorMessage
          message={`Failed to load links: ${error}`}
          onRetry={fetchLinks}
          className="mb-6"
        />
      )}

      {successMessage && (
        <Card className="mb-6 border-[rgb(var(--color-success))] bg-[rgb(var(--color-success))] bg-opacity-10 animate-fade-in">
          <p className="text-[rgb(var(--text-primary))] font-medium">{successMessage}</p>
        </Card>
      )}

      <AddLinkForm onSubmit={handleCreateLink} onSuccess={handleLinkCreated} />

      <Card>
        {links.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full sm:w-auto sm:max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by code or URL..."
              />
            </div>
            <LinkFilters sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        )}

        {hasNoResults && (
          <div className="text-center py-8">
            <p className="text-[rgb(var(--text-secondary))] mb-2">No links found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[rgb(var(--color-primary))] hover:underline text-sm"
            >
              Clear search
            </button>
          </div>
        )}

        {links.length === 0 && !isLoading ? (
          <EmptyState onAddClick={() => document.querySelector('input[type="url"]')?.focus()} />
        ) : (
          <LinkTable 
            links={filteredAndSortedLinks} 
            onDelete={handleDeleteClick}
            isLoading={isLoading}
            sortColumn={tableSortColumn}
            sortDirection={tableSortDirection}
            onSort={handleTableSort}
            onCopySuccess={handleCopySuccess}
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

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

