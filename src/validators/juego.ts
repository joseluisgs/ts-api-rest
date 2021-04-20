/**
 * validador de juego
 */

import { body } from 'express-validator';

/**
  * Verifica los datos de Juego
  * @returns Errores
  */
const juegoValidationRules = () => [
  body('titulo').isLength({ min: 3 }).withMessage('El titulo debe tener al menos dos caracteres'),
];

export default juegoValidationRules;
