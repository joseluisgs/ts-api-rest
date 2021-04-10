/**
 * ENRUTADOR DE NOTAS
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import juegosController from '../controllers/juegos';
import { auth } from '../middlewares/auth';

// Middleware
//  auth, grant(['ADMIN']), si no se pone gran, es porque es que esta implícito role(['user'])

// Cargamos el enrutador
const juegosRouter = express.Router();

// GET Listar todos los elementos: Cualquiera
juegosRouter.get('/', juegosController.findAll);

// GET Obtiene un elemento por por ID: Cualquiera
juegosRouter.get('/:id', juegosController.findById);

// POST Añadir Elemento. Solo autenticados
juegosRouter.post('/', auth, juegosController.add);

// PUT Modifica un elemento por ID. Solo autenticados
juegosRouter.put('/:id', auth, juegosController.update);

// DELETE Elimina un elemento por ID. Solo autenticados
juegosRouter.delete('/:id', auth, juegosController.remove);

// Exprotamos el módulo
export default juegosRouter;
