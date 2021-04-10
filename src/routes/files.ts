/**
 * ENRUTADOR DE FICHEROS
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import filesController from '../controllers/files';
import { auth, grant } from '../middlewares/auth';

// Middleware
//  auth, grant(['ADMIN']), si no se pone gran, es porque es que esta implícito role(['user'])

// Cargamos el enrutador
const filesRouter = express.Router();

// GET Listar todos los elementos
filesRouter.get('/', auth, grant(['ADMIN']), filesController.findAll);

// GET Obtiene un elemento por por ID
filesRouter.get('/:id', auth, filesController.findById);

// POST Añadir Elemento.
filesRouter.post('/', auth, filesController.add);

// PUT Modifica un elemento por ID.
filesRouter.put('/:id', auth, filesController.update);

// DELETE Elimina un elemento por ID.
filesRouter.delete('/:id', auth, filesController.remove);

// GET Descarga un fichero dado su ID
filesRouter.get('/download/:id', filesController.download);

// Exprotamos el módulo
export default filesRouter;
