import { useParams } from 'react-router-dom';
import EmpresarialPage from './EmpresarialPage';
import ProductoPage from './ProductoPage';
import { EMPRESARIALES } from '../data/empresariales';

/*
  Las fichas de salud y las empresariales comparten la ruta /producto/:slug
  porque las migas de ambas dicen "Inicio > Productos", pero cada familia tiene
  su propia plantilla. Aqui se decide cual toca.
*/
export default function ProductoRouter() {
  const { slug } = useParams();
  const empresarial = EMPRESARIALES.find((e) => e.slug === slug);

  if (empresarial) return <EmpresarialPage producto={empresarial} />;
  return <ProductoPage />;
}
