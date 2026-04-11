interface LoginScreenProps {
  onLogin: () => Promise<void>;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      gap: '16px',
    }}>
      <span style={{ fontSize: '48px' }}>🕐</span>
      <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111' }}>
        Storer Ponto
      </h1>
      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
        Registre seu ponto eletrônico diretamente pelo navegador.
      </p>
      <button
        onClick={onLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Entrar com conta Storer
      </button>
    </div>
  );
}