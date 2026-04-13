import type { Batida } from '../../types/ponto.types';
import { BatidaItem } from './BatidaItem';

interface BatidasListProps {
  batidas: Batida[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
}

export function BatidasList({ batidas, isLoading, error, onRefresh }: BatidasListProps) {
  if (isLoading) {
    return (
      <div style={{ padding: '8px 0' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            height: '44px',
            backgroundColor: '#e5e7eb',
            borderRadius: '8px',
            marginBottom: '6px',
          }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '16px', color: '#ef4444', fontSize: '13px' }}>
        <p>{error}</p>
        <button onClick={onRefresh} style={{ marginTop: '8px', cursor: 'pointer' }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (batidas.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', padding: '16px 0' }}>
        Nenhuma batida registrada hoje
      </p>
    );
  }

  return (
    <div>
      {[...batidas]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((batida) => (
          <BatidaItem key={batida.id} batida={batida} />
        ))}
    </div>
  );
}