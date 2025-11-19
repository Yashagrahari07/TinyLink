import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))]">
      <header className="border-b border-[rgb(var(--border-color))] bg-[rgb(var(--bg-secondary))] sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[rgb(var(--color-primary))]">
            Trimly
          </h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

