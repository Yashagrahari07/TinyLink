import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Card from './Card';

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidCode(code) {
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

  const validateUrl = (value) => {
    if (!value) {
      setUrlError('URL is required');
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
    if (value && !isValidCode(value)) {
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
      if (error.message.includes('already exists')) {
        setCodeError('This code is already taken');
      } else if (error.message.includes('Invalid')) {
        setUrlError(error.message);
      } else {
        setUrlError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (createdLink?.shortUrl) {
      navigator.clipboard.writeText(createdLink.shortUrl);
      alert('Copied to clipboard!');
    }
  };

  return (
    <Card className="mb-6">
      <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--text-primary))]">Create Short Link</h3>
      
      {success && createdLink && (
        <div className="mb-4 p-4 rounded-lg bg-[rgb(var(--color-success))] bg-opacity-10 border border-[rgb(var(--color-success))]">
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

