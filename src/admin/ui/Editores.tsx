import { useState } from 'react';
import Icon, { type IconName } from '../../components/ui/Icon';
import type { Medio } from '../api';
import { tamanoLegible } from '../../contenido/formato';
import { ICONOS_CIFRAS, type ArchivoRecurso, type Bloque, type Cifra, type Participante, type PiezaGaleria } from '../../contenido/tipos';
import { Area, Boton, Campo, Entrada, Selector } from './Basicos';
import { BotonElegirMedio, CampoImagen, CampoVideo, ListaSubidas, ZonaSubida, useSubida } from './Medios';

/* ============================================================
   Editores compuestos: cuerpo por bloques, galeria, listas
   ============================================================ */

function mover<T>(lista: T[], i: number, paso: number): T[] {
  const j = i + paso;
  if (j < 0 || j >= lista.length) return lista;
  const copia = [...lista];
  [copia[i], copia[j]] = [copia[j], copia[i]];
  return copia;
}

/** Botones subir / bajar / eliminar de un elemento de una lista. */
export function Mandos({ i, total, onMover, onEliminar }: { i: number; total: number; onMover: (paso: number) => void; onEliminar: () => void }) {
  return (
    <span className="adm-mandos">
      <button type="button" onClick={() => onMover(-1)} disabled={i === 0} aria-label="Subir">
        <Icon name="chevron-up" size={15} strokeWidth={2.2} />
      </button>
      <button type="button" onClick={() => onMover(1)} disabled={i === total - 1} aria-label="Bajar">
        <Icon name="chevron-down" size={15} strokeWidth={2.2} />
      </button>
      <button type="button" className="is-peligro" onClick={onEliminar} aria-label="Eliminar">
        <Icon name="trash" size={15} strokeWidth={2} />
      </button>
    </span>
  );
}

/* ---------- cuerpo por bloques ---------- */

const TIPOS_BLOQUE: { tipo: Bloque['tipo']; label: string; icon: IconName }[] = [
  { tipo: 'p', label: 'Párrafo', icon: 'list' },
  { tipo: 'h2', label: 'Subtítulo', icon: 'edit' },
  { tipo: 'destacado', label: 'Frase destacada', icon: 'sparkles' },
  { tipo: 'lista', label: 'Lista', icon: 'check-circle' },
  { tipo: 'foto', label: 'Foto', icon: 'image' },
  { tipo: 'video', label: 'Video', icon: 'video' },
];

function bloqueNuevo(tipo: Bloque['tipo']): Bloque {
  switch (tipo) {
    case 'p':
    case 'h2':
    case 'destacado':
      return { tipo, texto: '' };
    case 'lista':
      return { tipo, items: [''] };
    case 'foto':
      return { tipo, src: '', alt: '', pie: '' };
    case 'video':
      return { tipo, src: '', poster: '', pie: '' };
  }
}

export function EditorBloques({ bloques, onChange }: { bloques: Bloque[]; onChange: (b: Bloque[]) => void }) {
  const cambiar = (i: number, b: Bloque) => onChange(bloques.map((x, k) => (k === i ? b : x)));

  return (
    <div className="adm-bloques">
      {bloques.length === 0 && <p className="adm-bloques__vacio">Todavía no hay texto. Añade el primer bloque con los botones de abajo.</p>}
      {bloques.map((b, i) => (
        <div className="adm-bloque" key={i}>
          <header className="adm-bloque__cabeza">
            <span className="adm-bloque__tipo">
              <Icon name={TIPOS_BLOQUE.find((t) => t.tipo === b.tipo)?.icon ?? 'list'} size={14} strokeWidth={2} />
              {TIPOS_BLOQUE.find((t) => t.tipo === b.tipo)?.label}
            </span>
            <Mandos i={i} total={bloques.length} onMover={(p) => onChange(mover(bloques, i, p))} onEliminar={() => onChange(bloques.filter((_, k) => k !== i))} />
          </header>

          {(b.tipo === 'p' || b.tipo === 'destacado') && (
            <Area value={b.texto} rows={b.tipo === 'p' ? 4 : 2} onChange={(e) => cambiar(i, { ...b, texto: e.target.value })} placeholder={b.tipo === 'p' ? 'Escribe el párrafo…' : 'Una frase corta que se muestra en grande'} />
          )}
          {b.tipo === 'h2' && <Entrada value={b.texto} onChange={(e) => cambiar(i, { ...b, texto: e.target.value })} placeholder="Subtítulo de la sección" />}
          {b.tipo === 'lista' && (
            <ListaTexto items={b.items} onChange={(items) => cambiar(i, { ...b, items })} placeholder="Elemento de la lista" />
          )}
          {b.tipo === 'foto' && (
            <div className="adm-bloque__media">
              <CampoImagen etiqueta="Foto" valor={b.src} alt={b.alt} onChange={(src, alt) => cambiar(i, { ...b, src, alt: alt ?? b.alt })} proporcion="16 / 9" compacto />
              <Entrada value={b.pie ?? ''} onChange={(e) => cambiar(i, { ...b, pie: e.target.value })} placeholder="Pie de foto (opcional)" />
            </div>
          )}
          {b.tipo === 'video' && (
            <div className="adm-bloque__media">
              <CampoVideo
                etiqueta="Video"
                soloArchivo
                valor={b.src ? { origen: 'archivo', src: b.src, poster: b.poster } : undefined}
                onChange={(v) => cambiar(i, { ...b, src: v?.src ?? '', poster: v?.poster ?? '' })}
              />
              <Entrada value={b.pie ?? ''} onChange={(e) => cambiar(i, { ...b, pie: e.target.value })} placeholder="Pie del video (opcional)" />
            </div>
          )}
        </div>
      ))}

      <div className="adm-bloques__anadir">
        <span>Añadir:</span>
        {TIPOS_BLOQUE.map((t) => (
          <Boton key={t.tipo} pequeno variante="suave" icono={t.icon} onClick={() => onChange([...bloques, bloqueNuevo(t.tipo)])}>
            {t.label}
          </Boton>
        ))}
      </div>
    </div>
  );
}

/* ---------- lista de textos (items, parrafos) ---------- */

export function ListaTexto({ items, onChange, placeholder, multilinea, anadir = 'Añadir otro' }: { items: string[]; onChange: (i: string[]) => void; placeholder?: string; multilinea?: boolean; anadir?: string }) {
  return (
    <div className="adm-lista-texto">
      {items.map((t, i) => (
        <div className="adm-lista-texto__fila" key={i}>
          {multilinea ? (
            <Area value={t} rows={3} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} placeholder={placeholder} />
          ) : (
            <Entrada value={t} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} placeholder={placeholder} />
          )}
          <Mandos i={i} total={items.length} onMover={(p) => onChange(mover(items, i, p))} onEliminar={() => onChange(items.filter((_, k) => k !== i))} />
        </div>
      ))}
      <Boton pequeno variante="suave" icono="plus" onClick={() => onChange([...items, ''])}>
        {anadir}
      </Boton>
    </div>
  );
}

/* ---------- galeria de fotos y videos ---------- */

export function EditorGaleria({ piezas, onChange, uso = '' }: { piezas: PiezaGaleria[]; onChange: (p: PiezaGaleria[]) => void; uso?: string }) {
  const { subidas, subir, quitar } = useSubida(uso);
  const [editando, setEditando] = useState<number | null>(null);

  const anadirMedios = (medios: Medio[]) => {
    const nuevas: PiezaGaleria[] = medios.map((m) =>
      m.tipo === 'video' ? { tipo: 'video', src: m.url, poster: '', alt: m.nombre.replace(/\.[a-z0-9]+$/i, '') } : { tipo: 'foto', src: m.url, alt: m.nombre.replace(/\.[a-z0-9]+$/i, '') },
    );
    onChange([...piezas, ...nuevas]);
  };

  const alSoltar = async (archivos: File[]) => {
    const subidos: Medio[] = [];
    for (const a of archivos) {
      const m = await subir(a);
      if (m) subidos.push(m);
    }
    if (subidos.length) anadirMedios(subidos);
  };

  const cambiar = (i: number, p: PiezaGaleria) => onChange(piezas.map((x, k) => (k === i ? p : x)));

  return (
    <div className="adm-galeria">
      {piezas.length > 0 && (
        <ul className="adm-galeria__lista">
          {piezas.map((p, i) => (
            <li key={p.src + i} className={`adm-galeria__pieza${editando === i ? ' is-editando' : ''}`}>
              <button type="button" className="adm-galeria__miniatura" onClick={() => setEditando(editando === i ? null : i)} title="Editar descripción">
                {p.tipo === 'video' ? (
                  p.poster ? (
                    <img src={p.poster} alt="" />
                  ) : (
                    <span className="adm-galeria__video">
                      <Icon name="video" size={22} strokeWidth={1.6} />
                    </span>
                  )
                ) : (
                  <img src={p.src} alt="" loading="lazy" />
                )}
                {p.tipo === 'video' && (
                  <span className="adm-galeria__play">
                    <Icon name="play" size={12} />
                  </span>
                )}
              </button>
              <span className="adm-galeria__numero">{i + 1}</span>
              <Mandos i={i} total={piezas.length} onMover={(paso) => onChange(mover(piezas, i, paso))} onEliminar={() => onChange(piezas.filter((_, k) => k !== i))} />
              {editando === i && (
                <div className="adm-galeria__editar">
                  <Entrada value={p.alt} onChange={(e) => cambiar(i, { ...p, alt: e.target.value })} placeholder="Descripción" />
                  {p.tipo === 'video' && (
                    <CampoImagen etiqueta="Portada del video" valor={p.poster ?? ''} onChange={(u) => cambiar(i, { ...p, poster: u })} conAlt={false} compacto />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <ZonaSubida tipo="imagen" multiple onArchivos={alSoltar} texto="Arrastra varias fotos o videos aquí, o haz clic para elegirlos" />
      <ListaSubidas subidas={subidas} onQuitar={quitar} />
      <div className="adm-galeria__acciones">
        <BotonElegirMedio tipo="imagen" multiple onElegir={anadirMedios}>
          Fotos de la biblioteca
        </BotonElegirMedio>
        <BotonElegirMedio tipo="video" multiple onElegir={anadirMedios} icono="video">
          Videos de la biblioteca
        </BotonElegirMedio>
      </div>
    </div>
  );
}

/* ---------- participantes (ponentes, entrevistados) ---------- */

export function EditorParticipantes({ lista, onChange }: { lista: Participante[]; onChange: (l: Participante[]) => void }) {
  const cambiar = (i: number, p: Participante) => onChange(lista.map((x, k) => (k === i ? p : x)));
  return (
    <div className="adm-participantes">
      {lista.map((p, i) => (
        <div className="adm-participante" key={i}>
          <CampoImagen etiqueta="Foto" valor={p.foto ?? ''} onChange={(u) => cambiar(i, { ...p, foto: u })} conAlt={false} compacto proporcion="1 / 1" />
          <div className="adm-participante__campos">
            <Entrada value={p.nombre} onChange={(e) => cambiar(i, { ...p, nombre: e.target.value })} placeholder="Nombre" />
            <Entrada value={p.cargo ?? ''} onChange={(e) => cambiar(i, { ...p, cargo: e.target.value })} placeholder="Cargo o institución" />
          </div>
          <Mandos i={i} total={lista.length} onMover={(paso) => onChange(mover(lista, i, paso))} onEliminar={() => onChange(lista.filter((_, k) => k !== i))} />
        </div>
      ))}
      <Boton pequeno variante="suave" icono="plus" onClick={() => onChange([...lista, { nombre: '', cargo: '', foto: '' }])}>
        Añadir participante
      </Boton>
    </div>
  );
}

/* ---------- archivos descargables ---------- */

export function EditorArchivos({ lista, onChange }: { lista: ArchivoRecurso[]; onChange: (l: ArchivoRecurso[]) => void }) {
  const { subidas, subir, quitar } = useSubida('documento');

  const anadir = (medios: Medio[]) =>
    onChange([
      ...lista,
      ...medios.map((m) => ({
        nombre: m.nombre.replace(/\.[a-z0-9]+$/i, ''),
        url: m.url,
        tamano: tamanoLegible(m.tamano),
        formato: (m.extension || '').toUpperCase(),
      })),
    ]);

  const alSoltar = async (archivos: File[]) => {
    const subidos: Medio[] = [];
    for (const a of archivos) {
      const m = await subir(a);
      if (m) subidos.push(m);
    }
    if (subidos.length) anadir(subidos);
  };

  return (
    <div className="adm-archivos">
      {lista.map((a, i) => (
        <div className="adm-archivo" key={a.url + i}>
          <span className="adm-archivo__formato">{a.formato || 'DOC'}</span>
          <Entrada value={a.nombre} onChange={(e) => onChange(lista.map((x, k) => (k === i ? { ...x, nombre: e.target.value } : x)))} placeholder="Nombre visible del archivo" />
          <small>{a.tamano}</small>
          <Mandos i={i} total={lista.length} onMover={(paso) => onChange(mover(lista, i, paso))} onEliminar={() => onChange(lista.filter((_, k) => k !== i))} />
        </div>
      ))}
      <ZonaSubida tipo="documento" multiple onArchivos={alSoltar} compacta texto="Arrastra PDF u otros documentos, o haz clic para elegirlos" />
      <ListaSubidas subidas={subidas} onQuitar={quitar} />
      <BotonElegirMedio tipo="documento" multiple onElegir={anadir}>
        Elegir de la biblioteca
      </BotonElegirMedio>
    </div>
  );
}

/* ---------- cifras (icono + valor + etiqueta) ---------- */

export function EditorCifras({ cifras, onChange, maximo = 4 }: { cifras: Cifra[]; onChange: (c: Cifra[]) => void; maximo?: number }) {
  const cambiar = (i: number, c: Cifra) => onChange(cifras.map((x, k) => (k === i ? c : x)));
  return (
    <div className="adm-cifras">
      {cifras.map((c, i) => (
        <div className="adm-cifra" key={i}>
          <span className="adm-cifra__icono">
            <Icon name={c.icon} size={22} strokeWidth={1.6} />
          </span>
          <Selector value={c.icon} onChange={(e) => cambiar(i, { ...c, icon: e.target.value as IconName })} aria-label="Icono">
            {ICONOS_CIFRAS.map((o) => (
              <option key={o.icon} value={o.icon}>
                {o.label}
              </option>
            ))}
          </Selector>
          <Entrada value={c.valor} onChange={(e) => cambiar(i, { ...c, valor: e.target.value })} placeholder="+50" className="adm-cifra__valor" />
          <Entrada value={c.label} onChange={(e) => cambiar(i, { ...c, label: e.target.value })} placeholder="Familias beneficiadas" />
          <Mandos i={i} total={cifras.length} onMover={(paso) => onChange(mover(cifras, i, paso))} onEliminar={() => onChange(cifras.filter((_, k) => k !== i))} />
        </div>
      ))}
      {cifras.length < maximo && (
        <Boton pequeno variante="suave" icono="plus" onClick={() => onChange([...cifras, { icon: 'users', valor: '', label: '' }])}>
          Añadir cifra
        </Boton>
      )}
    </div>
  );
}

/** Dos campos en una fila. */
export function Fila({ children }: { children: React.ReactNode }) {
  return <div className="adm-fila">{children}</div>;
}

export { Campo };
