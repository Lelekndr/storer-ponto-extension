import { useState } from 'react';
import { ToastNotification } from './ToastNotification';


interface BaterPontoButtonProps {
  onRegistrar: () => Promise<string | null>;
}


type ButtonState = 'idle' | 'loading' | 'success' | 'error';

// Mapeia o tipo da batida retornado pela API 
function getTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    ENTRADA: 'Entrada', INTERVALO: 'Intervalo',
    RETORNO: 'Retorno', SAIDA: 'Saída',
  };
  return labels[tipo] ?? tipo;
}

export function BaterPontoButton({ onRegistrar }: BaterPontoButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro'>('sucesso');

  const handleClick = async () => {
    // Previne cliques duplos enquanto a requisição está em andamento
    if (state === 'loading') return;

    setState('loading');
    try {
      const tipo = await onRegistrar();
      const horario = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit'
      });
      // Mensagem conforme AC-04 do PBI-04
      setToastMsg(`✅ Ponto registrado! ${horario} — ${getTipoLabel(tipo ?? 'ENTRADA')}`);
      setToastTipo('sucesso');
      setState('success');
      // Volta ao estado normal após 2 segundos
      setTimeout(() => setState('idle'), 2000);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Falha ao registrar ponto.';
      setToastMsg(`❌ ${mensagem}`);
      setToastTipo('erro');
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const buttonStyles: Record<ButtonState, { bg: string; label: string }> = {
    idle:    { bg: '#2563eb', label: '🕐 Bater Ponto' },
    loading: { bg: '#93c5fd', label: 'Registrando...' },
    success: { bg: '#22c55e', label: '✅ Registrado!' },
    error:   { bg: '#ef4444', label: '❌ Tentar novamente' },
  };

  const { bg, label } = buttonStyles[state];

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: bg,
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: 700,
          cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
          marginBottom: '16px',
        }}
      >
        {label}
      </button>

      {toastMsg && (
        <ToastNotification
          mensagem={toastMsg}
          tipo={toastTipo}
          onClose={() => setToastMsg(null)}
        />
      )}
    </>
  );
}