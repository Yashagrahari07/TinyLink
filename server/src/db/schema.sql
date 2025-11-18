-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(8) UNIQUE NOT NULL,
  url         TEXT NOT NULL,
  clicks      INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);

