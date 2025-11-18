// Sanitize string input (remove extra whitespace)
export function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.trim();
}

// Sanitize URL (trim and validate)
export function sanitizeUrl(url) {
  if (typeof url !== 'string') {
    return url;
  }
  return url.trim();
}

// Sanitize code (trim and convert to string)
export function sanitizeCode(code) {
  if (typeof code !== 'string') {
    return code;
  }
  return code.trim();
}

