import { useSaldo } from '../hooks/useSaldo';

// Converte minutos para o formato "+HH:MM" ou "-HH:MM"
function formatarSaldo(minutos: number): string {
  const sinal = minutos >= 0 ? '+' : '-';
  const absoluto = Math.abs(minutos);
  const horas = Math.floor(absoluto / 60).toString().padStart(2, '0');
  const mins = (absoluto % 60).toString().padStart(2, '0');
  return `${sinal}${horas}:${mins}`;
}

export function SaldoWidget() {
  const { saldo, isLoading } = useSaldo();

  if (isLoading) {
    return <div style={{ height: '40px', backgroundColor: '#e5e7eb', borderRadius: '8px' }} />;
  }

  // Conforme AC-06 do PBI-07: erro no saldo não trava o popup
  if (!saldo) {
    return (
      <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
        Saldo indisponível
      </p>
    );
  }

  const cor = saldo.saldoMinutos >= 0 ? '#22c55e' : '#ef4444';
  const mesFormatado = new Date(saldo.mesAno + '-01').toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '10px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    }}>
      <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
        {mesFormatado}
      </span>
      {/* Cor dinâmica conforme AC-02 e AC-03 do PBI-07 */}
      <span style={{ fontSize: '18px', fontWeight: 700, color: cor }}>
        {formatarSaldo(saldo.saldoMinutos)}
      </span>
    </div>
  );
}