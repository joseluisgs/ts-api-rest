/**
 * MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACION
 * analiza las autorización y autenticaciones entre request y response
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jwt-simple';
import env from '../env';

/**
 * Autenticación. Comprueba que el JWT es válido
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Next function
 */
const auth = (req: Request, res: Response, next: NextFunction) => {
  // Si la cabecera no tiene un token válido
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      mensaje: 'No Autenticado',
    });
  }

  // Si tiene cabecera de autenticación descodificamos los token y payload.
  const token = req.headers.authorization.split(' ')[1];
  try {
    const payload = jwt.decode(token, env.TOKEN_SECRET);
    // Recuperamos el usuario del payload, hemos añadido el tipo uso a req. con una declaración de tipos en types
    req.user = payload.user;
    // Vamos a la siguiente ruta o función
    return next();
    // Sihay error es porque no lo hemos podido recuperar o hay algo raro
  } catch (err) {
    return res.status(401).json({
      success: false,
      mensaje: 'No autenticado o sesión ha expirado',
    });
  }
};

/**
 * Autorizacion. Permitimos que pueda acceder dependiendo de una lista de roles. Por defecto tenemos el rol normal o user
 * @param {*} role. Es una rray con los permisos, por si queremos tener varios y no mirar el menor de ellos
 */
// eslint-disable-next-line consistent-return
const grant = (role = ['USER']) => (req: Request, res: Response, next: NextFunction) => {
  // Devolvemos el middleware
  // Comprobamos que el rol del usuario existe en la lista de roles permitidos de una manera elegante :)
  const valid = role.some((rol) => rol === req.user.role);
  if (valid) {
    next(); // pasamos a la siguiente...
  } else {
    // Si no tiene el rol...
    return res.status(403).json({
      success: false,
      mensaje: 'No Autorizado',
    });
  }
};

// Exportamos el módulo
export { auth, grant };
