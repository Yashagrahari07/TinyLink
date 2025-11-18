import { query, queryOne, queryMany } from '../utils/db.js';
import { isValidUrl, isValidCode, generateCode } from '../utils/validation.js';
import { formatLink, formatError } from '../utils/response.js';
import { sanitizeUrl, sanitizeCode } from '../utils/sanitize.js';

export async function createLink(req, res, next) {
  try {
    let { url, code } = req.body;
    
    // Sanitize inputs
    url = sanitizeUrl(url);
    if (code) {
      code = sanitizeCode(code);
    }

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json(formatError('Invalid URL'));
    }

    // Generate or validate code
    let linkCode = code;
    if (!linkCode) {
      linkCode = generateCode();
    } else if (!isValidCode(linkCode)) {
      return res.status(400).json(formatError('Code must be 6-8 alphanumeric characters'));
    }

    // Check for duplicate code
    const existing = await queryOne(
      'SELECT code FROM links WHERE code = $1',
      [linkCode]
    );
    if (existing) {
      return res.status(409).json(formatError('Code already exists'));
    }

    // Insert link
    const result = await queryOne(
      `INSERT INTO links (code, url) 
       VALUES ($1, $2) 
       RETURNING id, code, url, clicks, created_at as "createdAt"`,
      [linkCode, url]
    );

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    res.status(201).json(formatLink({
      code: result.code,
      url: result.url,
      clicks: result.clicks,
      lastClicked: null,
      createdAt: result.createdAt
    }, baseUrl));
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
    const formattedLinks = links.map(link => formatLink(link, baseUrl));
    res.json(formattedLinks);
  } catch (error) {
    next(error);
  }
}

export async function getLinkByCode(req, res, next) {
  try {
    const { code } = req.params;
    const link = await queryOne(
      `SELECT 
        code, 
        url, 
        clicks, 
        last_clicked as "lastClicked", 
        created_at as "createdAt"
       FROM links 
       WHERE code = $1`,
      [code]
    );

    if (!link) {
      return res.status(404).json(formatError('Link not found'));
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    res.json(formatLink(link, baseUrl));
  } catch (error) {
    next(error);
  }
}

export async function deleteLink(req, res, next) {
  try {
    const { code } = req.params;
    const result = await query(
      'DELETE FROM links WHERE code = $1',
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json(formatError('Link not found'));
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function redirectLink(req, res, next) {
  try {
    const { code } = req.params;
    const link = await queryOne(
      'SELECT url FROM links WHERE code = $1',
      [code]
    );

    if (!link) {
      return res.status(404).json(formatError('Link not found'));
    }

    // Increment click count and update last_clicked
    await query(
      `UPDATE links 
       SET clicks = clicks + 1, 
           last_clicked = CURRENT_TIMESTAMP 
       WHERE code = $1`,
      [code]
    );

    res.redirect(302, link.url);
  } catch (error) {
    next(error);
  }
}

