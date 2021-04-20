/**
 * CONFIGURACIÓN DE ACESO AL SERVIDOR DE BASE DE DATOS
 * Configuración MongoDB
 */

// Librerías
import mongoose from 'mongoose';
import chalk from 'chalk';
import env from './env';
import e from 'express';
// Modelos

/**
 * configuración de conexión a la base de datos siguiendo un patrón singleton
 */
class Database {
  private conn!: mongoose.Connection;

  /**
   * Crea la conexión a la BB.DD
   */
  connect() {
    // Creamos una cadena de conexión según los parámetros de .env. Ojo que esta partida la línea, poner ?authSource=admin para autenticarse en Mogo Docker local
    const host = `${env.DB_PROTOCOL}://${env.DB_USER}:${env.DB_PASS}@${env.DB_URL}:${env.DB_PORT}/${env.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;

    const options = {
      poolSize: env.DB_POOLSIZE,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false, // si no salta las funciones deprecated
    };
    // activamos  el modo depurador si así lo tenemos en nuestro fichero, solo si no estamos en test
    if (env.NODE_ENV !== 'test') {
      mongoose.set('debug', env.DB_DEBUG);
    }
    this.conn = mongoose.createConnection(host, options);
  }

  /**
   * Se conecta a la conexión indicada. Se realiza por promesas, es decir, hasta que no se cumpla la promesa, espera el proceso del servidor
   */
  start() {
    // Definimos una promesa que se resollverá si nos conecatmos correctamente
    return new Promise<mongoose.Connection>((resolve) => {
      // Configuramos el la conexión del cliente Mongo
      mongoose.Promise = global.Promise;
      this.connect();
      // Si hay un error, salimos de la apliación
      this.conn.on('error', (err) => {
        if (process.env.NODE_ENV !== 'test') {
          console.error(chalk.red('❌ MongoDB Error', err));
        }
        return process.exit();
      });

      // Si recibimos el evento conectamos
      this.conn.on('connected', () => {
        if (process.env.NODE_ENV !== 'test') {
          console.log(chalk.green(`🟢 Conectado al Servidor MogoDB ✅ -> http://${env.DB_URL}:${env.DB_PORT}`));
        }
        resolve(this.conn); // Resolvemos la promesa
      });
    });
  }

  /**
   * Devuelve el objeto de conexión
   */
  getConnection() {
    if (!this.conn) this.connect();
    return this.conn;
  }

  /**
   * Cierra la conexión
   * @returns
   */
  async close() {
    return this.conn.close();
  }

  /**
   * Elimina las todas las colecciones
   */
  async removeCollections() {
    const collections = await this.conn.db.collections();
    collections.forEach(async (collection) => collection.deleteMany({}));
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const instance = new Database();

// Devolvemos el módulo
export default instance;
