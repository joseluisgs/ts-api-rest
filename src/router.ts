/**
 * ENRUTADOR
 * Enrutador central
 */

import express from 'express';
import juegosRouter from './routes/juegos';
import filesRouter from './routes/files';

const Path = 'api';
const Version = 'v1';

// exportamos los módulos
export default (app: express.Express) => {
  // indicamos que para ruta quien la debe resolver
  app.get('/', (req, res) => {
    res.status(200).send('¡Hola BackEnd en TypeScript/Node.js!');
  });

  // Hola API
  app.get(`/${Path}/${Version}/hola`, (req, res) => {
    res.status(200).send(`¡Hola API!: version ${Version}`);
  });

  // Recurso notas
  app.use(`/${Path}/${Version}/juegos`, juegosRouter);

  // Recurso fichero
  app.use(`/${Path}/${Version}/files`, filesRouter);
};
