/**
 * CONFIGURACIÓN DE ACESO AL SERVIDOR DE BASE DE DATOS
 * Configuración MongoDB
 */

// Librerías
import { Sequelize } from 'sequelize';
import chalk from 'chalk';
import env from './env';
import User from './models/user';
/**
 * configuración de conexión a la base de datos siguiendo un patrón singleton
 */

class Database {
  private conn!: Sequelize;

  private models: any;

  /**
   * Crea la conexión a la BB.DD
   */
  connect() {
    this.conn = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
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

    this.initModels();
  }

  /**
   * Se conecta a la conexión indicada. Se realiza por promesas, es decir, hasta que no se cumpla la promesa, espera el proceso del servidor
   */
  start() {
    // Creamos una cadena de conexión según los parámetros de .env.
    return new Promise<Sequelize>((resolve) => {
      // Configuramos el la conexión del cliente MariaDB
      this.connect();
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

  /**
   * Devuelve la conexión a la BB.DD
   * @returns Conexion
   */
  getConnection() {
    if (!this.conn) this.connect();
    return this.conn;
  }

  /**
   * Cierra la conexión
   * @returns Promesa
   */
  async close() {
    return this.conn.close();
  }

  /**
   * Inicia los modelos, has de poner uno por los que tengas
   */
  initModels() {
    this.models = {
      User: User(this.conn),
    };
  }

  /**
   * Devuelve los modelos
   * @returns Modelos
   */
  getModels() {
    return this.models;
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Database();

// Devolvemos el módulo
export default instance;
