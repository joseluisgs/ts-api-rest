/**
 * ENRUTADOR DE NOTAS
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import juegosController from '../controllers/juegos';

// Cargamos el enrutador
const juegosRouter = express.Router();

// Esta ruta está protegida en todos los elementos:
// - Autenticados

// GET Listar todos los elementos
juegosRouter.get('/', juegosController.findAll);

// GET Obtiene un elemento por por ID
juegosRouter.get('/:id', juegosController.findById);

// POST Añadir Elemento.
// router.post('/', notasController.addNota);

// PUT Modifica un elemento por ID.
// router.put('/:id', notasController.editNotaById);

// DELETE Elimina un elemento por ID.
// router.delete('/:id', notasController.deleteNotaById);

// Exprotamos el módulo
export default juegosRouter;
