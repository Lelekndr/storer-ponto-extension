interface UserMenuProps {
  displayName: string;
  email: string;
  onLogout: () => Promise<void>;
}

export function UserMenu({ displayName, email, onLogout }: UserMenuProps) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '14px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e5e7eb',
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#111' }}>
          {displayName}
        </p>
        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{email}</p>
      </div>
      <button
        onClick={onLogout}
        style={{
          padding: '6px 12px',
          backgroundColor: 'transparent',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280',
          cursor: 'pointer',
        }}
      >
        Sair
      </button>
    </div>
  );
}