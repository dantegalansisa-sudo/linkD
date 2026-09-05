/*
  Envio de los formularios de la web.

  Todo va al mismo punto de recepcion, `/api/solicitud`, que lo hace llegar
  por correo a LINKDICOM. Si el servidor todavia no tiene configurada la clave
  de envio, la respuesta lo dice y el formulario avisa al visitante en lugar
  de dar por buena una solicitud que nunca llego.
*/

export type TipoSolicitud = 'demo' | 'contacto' | 'empleo';

export type EstadoEnvio = 'listo' | 'enviando' | 'enviado' | 'error';

export interface Resultado {
  ok: boolean;
  error?: string;
}

const GENERICO = 'No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a info@linkdicom.com.';

export async function enviarSolicitud(
  tipo: TipoSolicitud,
  datos: Record<string, string>,
  origen?: string,
): Promise<Resultado> {
  try {
    const respuesta = await fetch('/api/solicitud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, origen, ...datos }),
    });

    // si el endpoint no existe todavia, el servidor devuelve el index.html
    const contenido = respuesta.headers.get('content-type') ?? '';
    if (!contenido.includes('application/json')) {
      return { ok: false, error: GENERICO };
    }

    const cuerpo = (await respuesta.json()) as Resultado;
    if (respuesta.ok && cuerpo.ok) return { ok: true };
    return { ok: false, error: cuerpo.error || GENERICO };
  } catch {
    return { ok: false, error: GENERICO };
  }
}

/** Recoge un formulario como objeto plano de texto. */
export function leerFormulario(form: HTMLFormElement): Record<string, string> {
  const datos: Record<string, string> = {};
  new FormData(form).forEach((valor, clave) => {
    if (typeof valor === 'string') datos[clave] = valor.trim();
  });
  return datos;
}
