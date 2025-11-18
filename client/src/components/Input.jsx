export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = ''
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-[rgb(var(--text-primary))]">
          {label}
          {required && <span className="text-[rgb(var(--color-error))] ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-2 rounded-lg border
          bg-[rgb(var(--bg-primary))] 
          border-[rgb(var(--border-color))] 
          text-[rgb(var(--text-primary))] 
          focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]
          ${error ? 'border-[rgb(var(--color-error))]' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-[rgb(var(--color-error))]">{error}</p>
      )}
    </div>
  );
}

