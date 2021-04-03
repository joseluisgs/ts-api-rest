/**
 * CONFIGURACIÓN DE LOS DATOS Y VARIABLES DE ENTORNO
 * Pueden llegar de un fichero .env, env.local, o desde el propio entorno de desarrollo
 */

import conf from 'dotenv';

// Cogemos el objeto que necesitamos .env
conf.config(); // Toda la configuración parseada del fichero .env

// Es importante que pongamos unos valores por defecto por si no están en el .env o defnidos en el sistema
const env = {
  // GENERAL
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV || 'development',
  DEBUG: process.env.DEBUG || true,
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 8000,
  TIMEZONE: process.env.TIMEZONE || 'Europe/Madrid',
};

export default env;
