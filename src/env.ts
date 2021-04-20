/**
 * CONFIGURACIÓN DE LOS DATOS Y VARIABLES DE ENTORNO
 * Pueden llegar de un fichero .env, env.local, o desde el propio entorno de desarrollo
 */

import conf from 'dotenv';
import chalk from 'chalk';

// Cogemos el objeto que necesitamos .env
conf.config(); // Toda la configuración parseada del fichero .env

// Filtramos que estos parámetros importantes para la ejecución estén para MongoDB
const paramsMongoBD = process.env.DB_USER && process.env.DB_PASS && process.env.DB_URL && process.env.DB_PORT && process.env.DB_NAME;
if (!paramsMongoBD) {
  console.error(chalk.red('❌ Error: Faltán variables de entorno para la ejecución en MongoDB. Por favor revise su fichero .env'));
  process.exit();
}

// Es importante que pongamos unos valores por defecto por si no están en el .env o defnidos en el sistema
const env = {
  // GENERAL
  NODE_ENV: process.env.NODE_ENV,
  ENV: process.env.ENV || 'development',
  DEBUG: Boolean(process.env.DEBUG) || true,
  HOST: process.env.HOST || 'localhost',
  PORT: Number(process.env.PORT) || 8000,
  TIMEZONE: process.env.TIMEZONE || 'Europe/Madrid',

  // FICHEROS
  FILE_SIZE: Number(process.env.FILE_SIZE) || 2,
  FILES_PATH: process.env.FILES_PATH || 'files',
  FILES_URL: process.env.FILES_URL || 'files',
  STORAGE: `${__dirname}/public/${process.env.FILES_PATH}/`,

  // TOKEN
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Este_Caballo_Viene_de_Boanzarrrrr_/_Lorem_Fistrum_Pecador_Te_Va_A_Haser_Pupitaa_Diodenaaalll_2021',
  TOKEN_LIFE: Number(process.env.TOKEN_LIFE || 20),
  TOKEN_REFRESH: process.env.TOKEN_REFRESH || 40,

  // CIFRADO
  BC_SALT: Number(process.env.BC_SALT) || 10,

  // MONGODB
  DB_DEBUG: process.env.DB_DEBUG === 'true',
  DB_POOLSIZE: Number(process.env.DB_POOLSIZE) || 200,
  DB_PROTOCOL: process.env.DB_PROTOCOL || 'mongodb',
  DB_USER: process.env.DB_USER || '',
  DB_PASS: process.env.DB_PASS || '',
  DB_URL: process.env.DB_URL || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 27017,
  DB_NAME: process.env.DB_NAME,
  DB_SYNC: process.env.DB_SYNC === 'true',
};

export default env;
