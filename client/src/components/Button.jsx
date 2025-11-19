import Spinner from './Spinner';

export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  type = 'button',
  className = '',
  isLoading = false
}) {
  const baseClasses = 'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px] touch-manipulation';
  
  const variants = {
    primary: 'bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white shadow-sm hover:shadow',
    secondary: 'bg-[rgb(var(--color-secondary))] hover:opacity-80 text-[rgb(var(--text-primary))] shadow-sm hover:shadow',
    danger: 'bg-[rgb(var(--color-error))] hover:opacity-80 text-white shadow-sm hover:shadow',
    success: 'bg-[rgb(var(--color-success))] hover:opacity-80 text-white shadow-sm hover:shadow',
    outline: 'border-2 border-[rgb(var(--border-color))] bg-transparent hover:bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))] hover:border-[rgb(var(--color-primary))]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${className} flex items-center justify-center gap-2`}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}

