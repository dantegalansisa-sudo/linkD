import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/*
  Vite no ejecuta las funciones de Vercel. Este complemento monta el mismo
  manejador de `api/solicitud.js` durante el desarrollo, para que el
  formulario se pruebe contra el codigo que luego corre en produccion.
*/
function apiEnDesarrollo(): Plugin {
  return {
    name: 'api-en-desarrollo',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/solicitud', async (req, res) => {
        const { default: manejador } = await server.ssrLoadModule('/api/solicitud.js');

        const trozos: Buffer[] = [];
        for await (const t of req) trozos.push(t as Buffer);
        (req as never as { body: unknown }).body = trozos.length
          ? JSON.parse(Buffer.concat(trozos).toString())
          : {};

        const respuesta = {
          statusCode: 200,
          status(codigo: number) {
            this.statusCode = codigo;
            return this;
          },
          setHeader(nombre: string, valor: string) {
            res.setHeader(nombre, valor);
            return this;
          },
          json(datos: unknown) {
            res.statusCode = this.statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(datos));
          },
        };

        await manejador(req, respuesta);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiEnDesarrollo()],
  server: { port: 5180, open: false },
});
