// Validate URL
export function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Reserved words that cannot be used as codes
const RESERVED_WORDS = ['api', 'healthz', 'code'];

// Validate code format (6-8 alphanumeric)
export function isValidCode(code) {
  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return false;
  }
  // Check if code is a reserved word
  if (RESERVED_WORDS.includes(code.toLowerCase())) {
    return false;
  }
  return true;
}

// Generate random code (6-8 characters)
export function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

