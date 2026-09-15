import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { cargarSitio } from './contenido/store';
import './styles/index.css';

// el contenido publicado desde el panel se lee una vez, antes de pintar
cargarSitio().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
