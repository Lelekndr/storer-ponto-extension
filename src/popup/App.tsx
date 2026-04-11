import  { useAuth } from './hooks/useAuth';
import  { LoginScreen } from './components/LoginScreen';
import { MainScreen } from './components/MainScreen';

// App.tsx é o orquestrador do popup — ele decide qual tela mostrar
// com base no estado de autenticação, sem se preocupar com os detalhes de cada tela.
export default function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  // Enquanto verifica o chrome.storage, não renderiza nada para evitar
  // o "flash" de mostrar a tela de login por um instante antes de mostrar a principal
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Carregando...</p>
      </div>
    );
  }

  // A lógica aqui é simples: ou você está logado e vê o conteúdo principal,
  // ou não está e vê a tela de login. Sem exceções.
  return isAuthenticated
    ? <MainScreen onLogout={logout} />
    : <LoginScreen onLogin={login} />;
}