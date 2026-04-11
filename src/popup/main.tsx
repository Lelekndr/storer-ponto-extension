import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// StrictMode faz o React renderizar os componentes duas vezes em desenvolvimento
// para detectar efeitos colaterais inesperados — boa prática manter sempre ativo
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);