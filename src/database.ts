/**
 * CONFIGURACIÓN DE ACESO AL SERVIDOR DE BASE DE DATOS
 * Configuración MongoDB
 */

// Librerías
import { Sequelize } from 'sequelize';
import chalk from 'chalk';
import env from './env';

/**
 * configuración de conexión a la base de datos siguiendo un patrón singleton
 */

const init = (): Sequelize => new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_URL,
  port: env.DB_PORT,
  dialect: 'mariadb',
  logging: env.DB_DEBUG,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

class Database {
  private conn!: Sequelize;

  /**
   * Devuelve el objeto de conexión
   */
  connect() {
    if (!this.conn) {
      this.conn = init();
    }
    return this.conn;
  }

  /**
   * Se conecta a la conexión indicada. Se realiza por promesas, es decir, hasta que no se cumpla la promesa, espera el proceso del servidor
   */
  start() {
    // Creamos una cadena de conexión según los parámetros de .env.
    return new Promise<Sequelize>((resolve) => {
      // Configuramos el la conexión del cliente MariaDB
      this.conn = init();
      // Sincronizamos todas las tablas, ojo que nos cargamos los datos
      this.conn.sync({ force: env.DB_SYNC });

      this.conn.authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
          if (process.env.NODE_ENV !== 'test') {
            console.log(chalk.green(`🟢 Conectado al Servidor MariaDB ✅ -> http://${env.DB_URL}:${env.DB_PORT}`));
          }
          resolve(this.conn); // Resolvemos la promesa
        })
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
          if (process.env.NODE_ENV !== 'test') {
            console.error(chalk.red('❌ MariaDB Error', err));
          }
          return process.exit();
        });
    });
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Database();

// Devolvemos el módulo
export default instance;
