import { useState, useEffect } from 'react';
import { UserMenu } from './UserMenu';
import { SaldoWidget } from './SaldoWidget';
import { BaterPontoButton } from './BaterPontoButton';
import { BatidasList } from './BatidasList';
import { useBatidas } from '../hooks/useBatidas';
import { AuthService } from '../../services/AuthService';

interface MainScreenProps {
  onLogout: () => Promise<void>;
}

export function MainScreen({ onLogout }: MainScreenProps) {
  const { batidas, isLoading, error, fetchBatidas, registrarBatida } = useBatidas();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Carrega os dados do usuário do storage para exibir no UserMenu
  useEffect(() => {
    AuthService.getCurrentUser().then((user) => {
      if (user) {
        setUserName(user.userDisplayName);
        setUserEmail(user.userEmail);
      }
    });
  }, []);

  return (
    <div style={{ padding: '16px', fontFamily: 'system-ui, sans-serif' }}>
      <UserMenu
        displayName={userName}
        email={userEmail}
        onLogout={onLogout}
      />
      <SaldoWidget />
      {/* BaterPontoButton recebe registrarBatida do hook —
          quando o ponto é registrado, o hook já atualiza a lista automaticamente */}
      <BaterPontoButton onRegistrar={registrarBatida} />
      <BatidasList
        batidas={batidas}
        isLoading={isLoading}
        error={error}
        onRefresh={fetchBatidas}
      />
    </div>
  );
}