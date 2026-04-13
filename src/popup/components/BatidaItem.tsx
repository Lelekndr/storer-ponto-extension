import type { Batida, TipoBatida } from '../../types/ponto.types';

interface BatidaItemProps {
  batida: Batida;
}

// Mapeia cada tipo de batida para um emoji e um label legível.
// Essa função vive fora do componente porque não depende de estado ou props —
// é uma transformação pura de dados, mais eficiente assim.
function getTipoInfo(tipo: TipoBatida): { emoji: string; label: string } {
  const map: Record<TipoBatida, { emoji: string; label: string }> = {
    ENTRADA:   { emoji: '🟢', label: 'Entrada'  },
    INTERVALO: { emoji: '🟡', label: 'Intervalo' },
    RETORNO:   { emoji: '🔵', label: 'Retorno'  },
    SAIDA:     { emoji: '🔴', label: 'Saída'    },
  };
  return map[tipo];
}


function formatarHorario(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BatidaItem({ batida }: BatidaItemProps) {
  const { emoji, label } = getTipoInfo(batida.tipo);
  const horario = formatarHorario(batida.timestamp);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '8px',
      backgroundColor: '#f5f5f5',
      marginBottom: '6px',
    }}>
      <span style={{ fontSize: '16px' }}>{emoji}</span>
      <span style={{ fontWeight: 600, fontSize: '15px', color: '#333' }}>{horario}</span>
      <span style={{ fontSize: '13px', color: '#666', marginLeft: 'auto' }}>{label}</span>
      {!batida.sincronizado && (
        <span style={{ fontSize: '11px', color: '#f59e0b' }} title="Aguardando sincronização">
          ⏳ offline
        </span>
      )}
    </div>
  );
}