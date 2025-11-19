import Button from './Button';
import Card from './Card';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  error = null
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-2 text-[rgb(var(--text-primary))]">
          {title}
        </h3>
        <p className="text-[rgb(var(--text-secondary))] mb-6">
          {message}
        </p>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[rgb(var(--color-error))] bg-opacity-10 border border-[rgb(var(--color-error))]">
            <p className="text-sm text-[rgb(var(--color-error))]">{error}</p>
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}

