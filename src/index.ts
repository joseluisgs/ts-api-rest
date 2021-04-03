import express from 'express';
import env from './env';
import config from './config';
import router from './router';

/**
 * Clase servidor de la API REST
 */
class Server {
  private app: express.Express;

  private instancia: any;

  /**
   * Constructor
   */
  constructor() {
    // Cargamos express como servidor
    this.app = express();
    this.instancia = undefined;
  }

  /**
   * Inicia el Servidor
   * @returns instancia del servidor http Server
   */
  start() {
    // Le apliacamos la configuracion a nuestro Servidor
    config(this.app);

    // Le aplicamos el enrutamiento
    router(this.app);

    // Nos ponemos a escuchar a un puerto definido en la configuracion
    this.instancia = this.app.listen(env.PORT, () => {
      const address = this.instancia.address(); // obtenemos la dirección
      const host = address.address === '::' ? 'localhost' : address; // dependiendo de la dirección asi configuramos
      const port = env.PORT; // el puerto
      this.instancia.url = `http://${host}:${port}`;
      if (process.env.NODE_ENV !== 'test') {
        console.log(`⚑ Servidor API REST escuchando ✓ -> ${this.instancia.url}`);
      }
    });
    return this.instancia; // Devolvemos la instancia del servidor
  }

  /**
   * Cierra el Servidor
   */
  close() {
    // Desconectamos el socket server
    this.instancia.close();
    if (process.env.NODE_ENV !== 'test') {
      console.log('▣  Servidor parado');
    }
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const server = new Server();

// Exportamos la variable
export default server;

// Si ningun fichero está haciendo un import y ejecutando ya el servidor, lo lanzamos nosotros
if (!module.parent) {
  server.start();
}

process.on('unhandledRejection', (err) => {
  console.log('✕ Custom Error: An unhandledRejection occurred');
  console.log(`✕ Custom Error: Rejection: ${err}`);
});
