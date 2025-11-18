// Format link response
export function formatLink(link, baseUrl) {
  return {
    code: link.code,
    url: link.url,
    shortUrl: `${baseUrl}/${link.code}`,
    clicks: link.clicks,
    lastClicked: link.lastClicked,
    createdAt: link.createdAt
  };
}

// Format error response
export function formatError(message, code = null) {
  const error = { error: message };
  if (code) {
    error.code = code;
  }
  return error;
}

