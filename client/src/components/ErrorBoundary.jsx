import { Component } from 'react';
import Card from './Card';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-[rgb(var(--text-primary))]">
              Something went wrong
            </h2>
            <p className="text-[rgb(var(--text-secondary))] mb-6">
              An unexpected error occurred. Please try refreshing the page or return to the dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Go to Dashboard
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Refresh Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

