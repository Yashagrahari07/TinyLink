import { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Button from './Button';
import Card from './Card';

const RESERVED_CODES = ['api', 'healthz', 'code', 'dashboard', 'stats'];

function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  if (url.length > 2048) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }

  if (RESERVED_CODES.includes(code.toLowerCase())) {
    return false;
  }

  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export default function AddLinkForm({ onSubmit, onSuccess }) {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [urlError, setUrlError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [createdLink, setCreatedLink] = useState(null);
  const urlInputRef = useRef(null);

  const validateUrl = (value) => {
    if (!value) {
      setUrlError('URL is required');
      return false;
    }

    if (value.length > 2048) {
      setUrlError('URL is too long. Maximum length is 2048 characters.');
      return false;
    }

    if (!isValidUrl(value)) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)');
      return false;
    }

    setUrlError('');
    return true;
  };

  const validateCode = (value) => {
    if (!value) {
      setCodeError('');
      return true;
    }

    if (RESERVED_CODES.includes(value.toLowerCase())) {
      setCodeError('This code is reserved and cannot be used');
      return false;
    }

    if (!isValidCode(value)) {
      setCodeError('Code must be 6-8 alphanumeric characters');
      return false;
    }

    setCodeError('');
    return true;
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    if (value) {
      validateUrl(value);
    } else {
      setUrlError('');
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    if (value) {
      validateCode(value);
    } else {
      setCodeError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isUrlValid = validateUrl(url);
    const isCodeValid = validateCode(code);
    
    if (!isUrlValid || !isCodeValid) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(null);
    setCreatedLink(null);

    try {
      const result = await onSubmit(url, code || undefined);
      setCreatedLink(result);
      setSuccess(true);
      setUrl('');
      setCode('');
      setUrlError('');
      setCodeError('');
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      setSuccess(false);
      const errorMessage = error.message || 'Failed to create link. Please try again.';
      
      if (error.status === 409 || errorMessage.toLowerCase().includes('already exists')) {
        setCodeError('This code is already taken. Please choose a different one.');
      } else if (error.status === 400 || errorMessage.toLowerCase().includes('invalid')) {
        if (errorMessage.toLowerCase().includes('url')) {
          setUrlError(errorMessage);
        } else if (errorMessage.toLowerCase().includes('code')) {
          setCodeError(errorMessage);
        } else {
          setUrlError(errorMessage);
        }
      } else if (errorMessage.includes('offline') || errorMessage.includes('network')) {
        setUrlError(errorMessage);
      } else {
        setUrlError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, []);

  const handleCopy = () => {
    if (createdLink?.shortUrl) {
      navigator.clipboard.writeText(createdLink.shortUrl);
    }
  };

  return (
    <Card className="mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-[rgb(var(--text-primary))]">Create Short Link</h3>
      
      {success && createdLink && (
        <div className="mb-4 p-4 rounded-lg bg-[rgb(var(--color-success))] bg-opacity-10 border border-[rgb(var(--color-success))] animate-fade-in">
          <p className="text-[rgb(var(--text-primary))] mb-2 font-medium">Link created successfully!</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={createdLink.shortUrl}
              className="flex-1 px-3 py-2 rounded bg-[rgb(var(--bg-primary))] border border-[rgb(var(--border-color))] text-[rgb(var(--text-primary))] text-sm"
            />
            <Button onClick={handleCopy} variant="outline" className="text-xs px-3 py-2">
              Copy
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1 md:flex-1">
            <Input
              ref={urlInputRef}
              label="URL"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/very/long/url"
              error={urlError}
              required
            />
          </div>

          <div className="flex-1 md:flex-1">
            <Input
              label="Custom Code (optional)"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Leave empty for auto-generated"
              error={codeError}
            />
          </div>

          <div className="md:mb-0">
            <Button
              type="submit"
              disabled={isSubmitting || !!urlError || !!codeError}
              isLoading={isSubmitting}
              className="w-full md:w-auto md:min-w-[140px]"
            >
              {isSubmitting ? 'Creating...' : 'Create Link'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

