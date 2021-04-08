/**
 * ENRUTADOR DE USURARIOs
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import userController from '../controllers/user';

// Cargamos el enrutador
const userRouter = express.Router();

// Esta ruta está protegida en todos los elementos:
// - Autenticados

// GET Obtiene un elemento por por ID
userRouter.get('/:id', userController.findById);

// POST Añadir Elemento.
userRouter.post('/register', userController.add);

// PUT Modifica un elemento por ID.
userRouter.put('/:id', userController.update);

// DELETE Elimina un elemento por ID.
userRouter.delete('/:id', userController.remove);

// POST Descarga un fichero dado su ID
userRouter.post('/login', userController.login);

// Exprotamos el módulo
export default userRouter;
