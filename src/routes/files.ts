/**
 * ENRUTADOR DE FICHEROS
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import filesController from '../controllers/files';

// Cargamos el enrutador
const filesRouter = express.Router();

// Esta ruta está protegida en todos los elementos:
// - Autenticados

// GET Listar todos los elementos
filesRouter.get('/', filesController.findAll);

// GET Obtiene un elemento por por ID
filesRouter.get('/:id', filesController.findById);

// POST Añadir Elemento.
filesRouter.post('/', filesController.add);

// PUT Modifica un elemento por ID.
filesRouter.put('/:id', filesController.update);

// DELETE Elimina un elemento por ID.
filesRouter.delete('/:id', filesController.remove);

// GET Descarga un fichero dado su ID
filesRouter.get('/download/:id', filesController.download);

// Exprotamos el módulo
export default filesRouter;
