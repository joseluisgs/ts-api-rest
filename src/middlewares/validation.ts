/**
 * MIDDLEWARE DE VALIDACION
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
  * Middleware que procesa las funciones de validación
  * @param req Request
  * @param res Response
  * @param next Next
  * @returns Vector de errores o Next
  */
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: { [x: string]: any; }[] = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

// Exportamos el módulo
export default validate;
