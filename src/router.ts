/**
 * ENRUTADOR
 * Enrutador central
 */

import express from 'express';
import notas from './routes/notas';

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
  app.use(`/${Path}/${Version}/notas`, notas);
};
