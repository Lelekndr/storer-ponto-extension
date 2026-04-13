import  { useAuth } from './hooks/useAuth';
import  { LoginScreen } from './components/LoginScreen';
import { MainScreen } from './components/MainScreen';

export default function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();


  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Carregando...</p>
      </div>
    );
  }

  return isAuthenticated
    ? <MainScreen onLogout={logout} />
    : <LoginScreen onLogin={login} />;
}