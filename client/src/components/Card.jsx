export default function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-[rgb(var(--bg-secondary))] 
      border border-[rgb(var(--border-color))] 
      rounded-lg p-6 
      shadow-sm
      ${className}
    `}>
      {children}
    </div>
  );
}

