/**
* CONFIGURACIÓN DE SERVIDOR
* Configuración principal de nuestro servidor
*/

// Librerías
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import env from './env';

// Creamos el módulo de configurar. Es una función que recibe Up
export default (app: express.Express) => {
  // Quitamos la cabecera que indica que esta hecho con express, por seguridad, así nod amos pistas
  app.disable('x-powered-by');

  // Middleware Le indicamos el midlleware morgan a usar logger.
  // Nos dara información de las peticiones y de todo
  if (env.NODE_ENV !== 'test') {
    // Si no estamos en test sacamos los logs
    app.use(logger('dev'));
  }

  // Parseamos todos los peticiones POST y lo que nos llege a JSON
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Indicamos los cors. Por si nos llega una peticion de una URL distintas
  // Nos permite configurar cabeceras y peticiones los que nos llegue
  app.use(cors());
  // app.use(cors({ origin: true }));
};
