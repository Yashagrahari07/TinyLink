import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold mb-4 text-[rgb(var(--color-primary))]">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--text-primary))]">
          Page Not Found
        </h2>
        <p className="text-[rgb(var(--text-secondary))] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">
            Go to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
}

