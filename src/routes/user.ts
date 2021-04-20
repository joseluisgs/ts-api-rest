/**
 * ENRUTADOR DE USURARIOS
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import userController from '../controllers/user';
import { auth } from '../middlewares/auth';
import validate from '../middlewares/validation';
import { userValidationRules, loginValidationRules } from '../validators/user';

// Middleware
//  auth, grant(['ADMIN']), si no se pone gran, es porque es que esta implícito role(['user'])

// Cargamos el enrutador
const userRouter = express.Router();

// GET Obtiene un elemento por por ID: Solo autenticado
userRouter.get('/:id', auth, userController.findById);

// POST Añadir Elemento.
userRouter.post('/register', userValidationRules(), validate, userController.add);

// PUT Modifica un elemento por ID. Solo autenticado
userRouter.put('/:id', auth, userValidationRules(), validate, userController.update);

// DELETE Elimina un elemento por ID. Solo autenticado
userRouter.delete('/:id', auth, userController.remove);

// POST Descarga un fichero dado su ID
userRouter.post('/login', loginValidationRules(), validate, userController.login);

// Exprotamos el módulo
export default userRouter;
