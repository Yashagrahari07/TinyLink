const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
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

