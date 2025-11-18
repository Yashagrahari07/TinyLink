import { query, queryOne, queryMany } from '../utils/db.js';

// Generate random code (6-8 characters)
function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Validate URL
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Validate code format (6-8 alphanumeric)
function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export async function createLink(req, res, next) {
  try {
    const { url, code } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate or validate code
    let linkCode = code;
    if (!linkCode) {
      linkCode = generateCode();
    } else if (!isValidCode(linkCode)) {
      return res.status(400).json({ error: 'Code must be 6-8 alphanumeric characters' });
    }

    // Check for duplicate code
    const existing = await queryOne(
      'SELECT code FROM links WHERE code = $1',
      [linkCode]
    );
    if (existing) {
      return res.status(409).json({ error: 'Code already exists' });
    }

    // Insert link
    const result = await queryOne(
      `INSERT INTO links (code, url) 
       VALUES ($1, $2) 
       RETURNING id, code, url, clicks, created_at as "createdAt"`,
      [linkCode, url]
    );

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    res.status(201).json({
      code: result.code,
      url: result.url,
      shortUrl: `${baseUrl}/${result.code}`,
      clicks: result.clicks,
      createdAt: result.createdAt
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllLinks(req, res, next) {
  try {
    const links = await queryMany(
      `SELECT 
        code, 
        url, 
        clicks, 
        last_clicked as "lastClicked", 
        created_at as "createdAt"
       FROM links 
       ORDER BY created_at DESC`
    );

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const formattedLinks = links.map(link => ({
      code: link.code,
      url: link.url,
      shortUrl: `${baseUrl}/${link.code}`,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt
    }));

    res.json(formattedLinks);
  } catch (error) {
    next(error);
  }
}

