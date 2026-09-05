import { Navigate, useParams } from 'react-router-dom';
import { CabeceraEmpresaBloque, CierreEmpresaBloque } from '../components/empresa/Marco';
import { ACERCA, CONTACTO_PAGINA, VALORES } from '../data/empresa';
import { OBRA_SOCIAL } from '../data/obra-social';
import { POLITICAS } from '../data/politicas';
import { TRABAJA } from '../data/trabaja';
import Acerca from './empresa/Acerca';
import Contacto from './empresa/Contacto';
import ObraSocial from './empresa/ObraSocial';
import Politicas from './empresa/Politicas';
import Trabaja from './empresa/Trabaja';
import Valores from './empresa/Valores';

/*
  Las seis paginas de Empresa comparten cabecera y cierre; el cuerpo lo pone
  cada una. Aqui se decide cual toca segun la ruta.
*/
const PAGINAS = {
  'acerca-de-nosotros': { datos: ACERCA, Cuerpo: Acerca },
  'obra-social': { datos: OBRA_SOCIAL, Cuerpo: ObraSocial },
  'nuestros-valores': { datos: VALORES, Cuerpo: Valores },
  'trabaja-con-nosotros': { datos: TRABAJA, Cuerpo: Trabaja },
  'politicas-y-terminos': { datos: POLITICAS, Cuerpo: Politicas },
  contacto: { datos: CONTACTO_PAGINA, Cuerpo: Contacto },
} as const;

export default function EmpresaPage() {
  const { slug } = useParams();
  const pagina = PAGINAS[slug as keyof typeof PAGINAS];

  if (!pagina) return <Navigate to="/" replace />;

  const { datos, Cuerpo } = pagina;

  return (
    <main className="ei" id="contenido">
      <CabeceraEmpresaBloque c={datos.cabecera} />
      <Cuerpo />
      <CierreEmpresaBloque c={datos.cierre} />
    </main>
  );
}
