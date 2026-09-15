/*
  Contenido de partida: lo que la web muestra mientras el panel no ha
  publicado nada, y lo que el panel carga como punto de partida la primera
  vez que se instala. Sale de los datos que viven en el codigo.
*/

import { CATEGORIAS_NOTICIAS, NOTICIAS } from '../data/noticias';
import { EVENTOS_OBRA_SOCIAL } from '../data/eventos-obra-social';
import { OBRA_SOCIAL } from '../data/obra-social';
import type { Sitio } from './tipos';

export const SITIO_BASE: Sitio = {
  version: 0,
  actualizado: '',
  noticias: NOTICIAS,
  categoriasNoticias: CATEGORIAS_NOTICIAS,
  recursos: { conferencias: [], webinars: [], entrevistas: [], 'materiales-de-apoyo': [] },
  obraSocial: {
    proximas: OBRA_SOCIAL.actividades.map((a) => ({
      slug: a.slug,
      fechaISO: a.fechaISO,
      titulo: a.titulo,
      lugar: a.lugar,
      texto: a.texto,
      imagen: a.imagen,
      imagenAlt: a.imagenAlt,
      cta: a.cta,
      publicado: true,
    })),
    jornadas: EVENTOS_OBRA_SOCIAL,
    cifras: OBRA_SOCIAL.cifras.map(({ icon, valor, label }) => ({ icon, valor, label })),
  },
  imagenes: {},
};
