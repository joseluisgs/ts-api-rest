import express from 'express';
import http from 'http';
import chalk from 'chalk';
import { AddressInfo } from 'node:net';
import { Sequelize } from 'sequelize';
import env from './env';
import config from './config';
import router from './router';
import mariaDB from './database';

/**
 * Clase servidor de la API REST
 */
class Server {
  private app: express.Express;

  private servicio!: http.Server;

  private database!: Sequelize;

  /**
   * Constructor
   */
  constructor() {
    // Cargamos express como servidor
    this.app = express();
  }

  /**
   * Inicia el Servidor
   * @returns instancia del servidor http Server
   */
  async start() {
    // No arrancamos hasta qye MariaDB esté lista
    await mariaDB.start();
    // Si queremos tirar la base de datos y comenzar desde cero, si no solo poner sync(), sin force
    if (process.env.NODE_ENV !== 'test') {
      await mariaDB.getConnection().sync({ force: true });
      console.log(chalk.yellow('🗃  Tablas borradas y re-sincronizadas'));
    }

    // Le apliacamos la configuracion a nuestro Servidor
    config(this.app);

    // Le aplicamos el enrutamiento
    router(this.app);

    // Nos ponemos a escuchar a un puerto definido en la configuracion
    this.servicio = this.app.listen(env.PORT, () => {
      const address = this.servicio.address() as AddressInfo;
      const host = address.address === '::' ? 'localhost' : address.address; // dependiendo de la dirección asi configuramos
      const { port } = address; // el puerto
      if (process.env.NODE_ENV !== 'test') {
        console.log(chalk.green.bold(`🟢 Servidor API REST escuchando ✅ -> http://${host}:${port}`));
      }
    });
    return this.servicio; // Devolvemos la instancia del servidor
  }

  /**
   * Cierra el Servidor y con ello también nos desconectamos de los servicios que tengamos como MongoDB
   */
  async close() {
    // Desconectamos MariaDB
    await mariaDB.close();
    // Desconectamos el socket server
    this.servicio.close();
    if (process.env.NODE_ENV !== 'test') {
      console.log(chalk.grey.bold('⚪️ Servidor parado ❎'));
    }
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const server = new Server();
// Exportamos el servidor inicializado
export default server;

// La siguiente sección de código sólo se ejecutará si este fichero es el punto de entrada del programa principal
// Lo hacemos porque también lo llamamos en test.
// https://nodejs.org/api/deprecations.html#DEP0144
if (require.main === module) {
  server.start();
}

process.on('unhandledRejection', (err) => {
  console.log(chalk.red('❌ Custom Error: An unhandledRejection occurred'));
  console.log(chalk.red(`❌ Custom Error: Rejection: ${err}`));
});
