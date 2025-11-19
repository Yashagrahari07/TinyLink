# Trimly - URL Shortener

A modern, full-stack URL shortener application built with React, Node.js, Express, and PostgreSQL. Create short links, track clicks, and manage your URLs with a clean, responsive interface.

## Features

- 🔗 **URL Shortening**: Create short links with optional custom codes
- 📊 **Analytics**: Track click counts and last clicked timestamps
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 🔍 **Search & Filter**: Find links quickly with real-time search and sorting
- 📱 **Mobile Optimized**: Fully responsive with mobile card view
- ⚡ **Fast**: Optimized performance with efficient database queries
- 🛡️ **Secure**: Input sanitization and parameterized SQL queries

## Tech Stack

### Frontend
- **React 19** with Vite
- **TailwindCSS 4** for styling
- **React Router** for navigation
- **Context API** for theme management

### Backend
- **Node.js** with Express.js
- **PostgreSQL** (Neon DB) with raw SQL queries
- **pg** library for database connection

## Project Structure

```
Trimly/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── index.css      # Global styles and theme
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Backend Express application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── db/            # Database setup and migrations
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Server entry point
│   └── package.json
│
└── readme.md              # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database (Neon DB recommended)
- **npm** or **yarn**

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Trimly
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
BASE_URL=http://localhost:3000
```

Run database migration:

```bash
npm run migrate
```

Start the development server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (`.env` in `server/`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | `3000` |
| `BASE_URL` | Base URL for short links | `http://localhost:3000` |

### Frontend (`.env` in `client/`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## API Endpoints

### Health Check
- **GET** `/healthz`
  - Returns: `{ "ok": true, "version": "1.0" }`

### Links

- **POST** `/api/links`
  - Body: `{ "url": "https://example.com", "code": "optional" }`
  - Returns: Link object with short URL
  - Status: `201` Created, `400` Invalid, `409` Duplicate code

- **GET** `/api/links`
  - Returns: Array of all links
  - Status: `200` OK

- **GET** `/api/links/:code`
  - Returns: Single link object
  - Status: `200` OK, `404` Not Found

- **DELETE** `/api/links/:code`
  - Returns: Success message
  - Status: `200` OK, `404` Not Found

### Redirect

- **GET** `/:code`
  - Redirects to original URL (HTTP 302)
  - Increments click count
  - Status: `302` Redirect, `404` Not Found

## Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Set root directory to `client`
   - Configure build settings:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

3. **Environment Variables**:
   - Add `VITE_API_URL` with your backend API URL
   - Example: `https://your-backend.onrender.com/api`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

### Backend Deployment (Render)

1. **Create a New Web Service**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Service**:
   - **Name**: `trimly-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `PORT`: `10000` (Render default, or leave empty)
   - `BASE_URL`: Your Render service URL (e.g., `https://trimly-backend.onrender.com`)
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs (e.g., `https://your-app.vercel.app`)

4. **Database Setup**:
   - Run migration after first deployment:
     - Use Render's Shell or SSH
     - Run: `npm run migrate`

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy automatically

### Post-Deployment

1. **Update Frontend Environment**:
   - Update `VITE_API_URL` in Vercel to point to your Render backend URL

2. **Test Deployment**:
   - Visit your Vercel frontend URL
   - Test creating a link
   - Test redirect functionality

## Database Schema

```sql
CREATE TABLE links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(8) UNIQUE NOT NULL,
  url         TEXT NOT NULL,
  clicks      INTEGER DEFAULT 0,
  last_clicked TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Code Structure

### Frontend Components

- **Layout**: Main app layout with header and theme toggle
- **Dashboard**: Main page with link list and search
- **Stats**: Individual link statistics page
- **AddLinkForm**: Form for creating new links
- **LinkTable**: Table view for desktop
- **LinkCard**: Card view for mobile
- **ErrorBoundary**: Catches React errors
- **Toast**: Success/error notifications

### Backend Structure

- **Controllers**: Business logic for API endpoints
- **Routes**: API route definitions
- **Utils**: Database helpers, validation, sanitization
- **DB**: Database connection and migrations

## Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run test-db` - Test database connection

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

[ISC](LICENSE)