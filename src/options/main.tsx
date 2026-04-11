import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { OptionsPage } from './components/OptionsPage';

// Ponto de entrada da Options Page — apenas monta o React na div#root.
// Toda a lógica e UI ficam no componente OptionsPage.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OptionsPage />
  </StrictMode>
);