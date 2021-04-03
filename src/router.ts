/**
 * ENRUTADOR
 * Enrutador central
 */

import express from 'express';

// exportamos los módulos
export default (app: express.Express) => {
  // indicamos que para ruta quien la debe resolver
  app.get('/', (req, res) => {
    res.status(200).send('¡Hola BackEnd en TypeScript/Node.js!');
  });
};
