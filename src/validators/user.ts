/**
 * validador de usuario
 */

import { body } from 'express-validator';

/**
  * Verifica los datos de user
  * @returns Errores
  */
const userValidationRules = () => [
  body('email').isEmail().withMessage('Email es obligatorio'),
  body('password').isLength({ min: 2 }).withMessage('El password debe tener al menos dos caracteres'),
  body('nombre').isLength({ min: 3 }).withMessage('El nombre debe tener al menos dos caracteres'),
];

/**
  * Verifica lo datos de Login
  * @returns Errores
  */
const loginValidationRules = () => [
  body('email').isEmail().withMessage('Email es obligatorio'),
  body('password').isLength({ min: 2 }).withMessage('El password debe tener al menos dos caracteres'),
];

// Exportamos el módulo
export { userValidationRules, loginValidationRules };
