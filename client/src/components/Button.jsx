export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  type = 'button',
  className = ''
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white',
    secondary: 'bg-[rgb(var(--color-secondary))] hover:opacity-80 text-[rgb(var(--text-primary))]',
    danger: 'bg-[rgb(var(--color-error))] hover:opacity-80 text-white',
    success: 'bg-[rgb(var(--color-success))] hover:opacity-80 text-white',
    outline: 'border-2 border-[rgb(var(--border-color))] bg-transparent hover:bg-[rgb(var(--bg-secondary))] text-[rgb(var(--text-primary))]'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

