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
};

export default env;
