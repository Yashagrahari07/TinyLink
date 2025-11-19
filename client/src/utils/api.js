const API_URL = import.meta.env.VITE_API_URL;

function isOnline() {
  return navigator.onLine;
}

function getErrorMessage(error, status) {
  if (!isOnline()) {
    return 'You are offline. Please check your internet connection and try again.';
  }

  if (error.message) {
    return error.message;
  }

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input and try again.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}

async function request(endpoint, options = {}) {
  if (!isOnline()) {
    throw new Error('You are offline. Please check your internet connection.');
  }

  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    
    let data;
    try {
      data = await response.json();
    } catch {
      data = { error: 'Invalid response from server' };
    }

    if (!response.ok) {
      const errorMessage = getErrorMessage(
        new Error(data.error || 'Request failed'),
        response.status
      );
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
}

export const api = {
  // Create link
  createLink: (url, code) => 
    request('/links', {
      method: 'POST',
      body: { url, code },
    }),

  // Get all links
  getAllLinks: () => 
    request('/links', {
      method: 'GET',
    }),

  // Get single link
  getLinkByCode: (code) => 
    request(`/links/${code}`, {
      method: 'GET',
    }),

  // Delete link
  deleteLink: (code) => 
    request(`/links/${code}`, {
      method: 'DELETE',
    }),
};

