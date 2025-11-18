import { useParams } from 'react-router-dom';

export default function Stats() {
  const { code } = useParams();
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-[rgb(var(--text-primary))]">Stats for {code}</h2>
    </div>
  );
}

