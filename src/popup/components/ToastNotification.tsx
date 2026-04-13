import { useEffect } from 'react';

interface ToastProps {
  mensagem: string;
  tipo: 'sucesso' | 'erro';
  onClose: () => void;
}

export function ToastNotification({ mensagem, tipo, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const backgroundColor = tipo === 'sucesso' ? '#22c55e' : '#ef4444';

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor,
      color: 'white',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 1000,
      whiteSpace: 'nowrap',
    }}>
      {mensagem}
    </div>
  );
}