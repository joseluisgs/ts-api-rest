/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import env from '../env';
import UserBD from '../models/user';

// METODOS AUXILIARES

/**
 * Comprueba que recibe los datos mínimos para lígin
 * @param req Request
 * @returns True/False si los datos son correctos
 */
const checkLogin = (req: Request) => req.body.email && req.body.email.trim().length > 0
  && req.body.password && req.body.email.trim().length > 0;

/**
 * Comprueba que se nos pasa todos los datos que neesitamos
 * @param req Request
 * @returns True/False si los datos son correctos
 */
const checkBody = (req: Request) => checkLogin(req) && req.body.nombre && req.body.nombre.trim().length > 0;

/**
 * CONTROLADOR DE USUARIOS
 */

class UserController {
  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      // Existe
      const data = await UserBD.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      // Acción
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }

  /**
   * Añade un elemento
   * @param req Request
   * @param res Response
   * @returns 201 si OK y elemento nuevo JSON
   */
  public async add(req: Request, res: Response) {
    try {
      // Están los datos
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
        });
      }
      // Accion
      const data = await UserBD.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: (req.body.password ? bcrypt.hashSync(req.body.password, env.BC_SALT) : ''),
        fecha: new Date(),
        role: req.body.role.toUpperCase() || 'USER',
      });
      return res.status(201).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }

  // /**
  //  * Actualiza un elemento dado su ID
  //  * @param req Request
  //  * @param res Response
  //  * @returns 200 si OK y elemento nuevo JSON
  //  */
  // public async update(req: Request, res: Response) {
  //   try {
  //     // Todos los datos
  //     if (!checkBody(req)) {
  //       return res.status(422).json({
  //         success: false,
  //         mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
  //       });
  //     }
  //     // Tenemos permiso o no existe
  //     if (req.user.id !== req.params.id) {
  //       return res.status(403).json({
  //         success: false,
  //         mensaje: 'No tienes permisos para realizar esta acción',
  //       });
  //     }
  //     // Existe, tomamos sus datos antiguos
  //     let data = await UserBD().findById(req.params.id);
  //     if (!data) {
  //       return res.status(404).json({
  //         success: false,
  //         mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
  //       });
  //     }
  //     // Acción
  //     const oldData: any = data;
  //     const newData = {
  //       nombre: req.body.nombre || oldData.nombre,
  //       email: req.body.email || oldData.email,
  //       password: (req.body.password ? bcrypt.hashSync(req.body.password, env.BC_SALT) : oldData.password),
  //       fecha: req.body.fecha || oldData.fecha,
  //       role: req.body.role.toUpperCase() || oldData.role,
  //     };
  //     data = await UserBD().findByIdAndUpdate(req.params.id, newData, { new: true }); // con finOneAndUpdate debo poner la proyeccion
  //     // Ya no hace falta comprobar que no es nulo, pues lo hemos hecho antes
  //     return res.status(200).json(toJSON(data));
  //   } catch (err) {
  //     console.log(err.toString());
  //     return res.status(500).json({
  //       success: false,
  //       mensaje: err.toString(),
  //     });
  //   }
  // }

  // /**
  //  * Elimina un elemento dado su ID
  //  * @param req Request
  //  * @param res Response
  //  * @returns 200 si OK y elemento nuevo JSON
  //  */
  // public async remove(req: Request, res: Response) {
  //   try {
  //     // Tenemos permiso
  //     if (req.user.id !== req.params.id) {
  //       return res.status(403).json({
  //         success: false,
  //         mensaje: 'No tienes permisos para realizar esta acción',
  //       });
  //     }
  //     // Realizamos la acción
  //     const data = await UserBD().findByIdAndDelete(req.params.id);
  //     // Si es correcto y existe
  //     if (!data) {
  //       return res.status(404).json({
  //         success: false,
  //         mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
  //       });
  //     }
  //     return res.status(200).json(toJSON(data));
  //   } catch (err) {
  //     console.log(err.toString());
  //     return res.status(500).json({
  //       success: false,
  //       mensaje: err.toString(),
  //     });
  //   }
  // }

  // /**
  //  * Realiza el login y devuleve el token
  //  * @param req Request
  //  * @param res Response
  //  * @returns 200 si OK y elemento nuevo JSON
  //  */
  // public async login(req: Request, res: Response) {
  //   try {
  //     // Todos los campos
  //     if (!checkLogin(req)) {
  //       return res.status(422).json({
  //         success: false,
  //         mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
  //       });
  //     }
  //     // Existe
  //     const data = await UserBD().findOne({ email: req.body.email }).exec();
  //     let user: any = data?.toObject(); // Limpiamos los datos antes
  //     if (!data || !bcrypt.compareSync(req.body.password, user.password)) {
  //       return res.status(403).json({
  //         success: false,
  //         mensaje: 'Usuario/a o contraseña incorrectos',
  //       });
  //     }
  //     user = toJSON(data);
  //     const payload = {
  //       user,
  //       iat: Math.floor(Date.now() / 1000),
  //       exp: Math.floor(Date.now() / 1000) + (60 * env.TOKEN_LIFE), // 60 segundos * Minutos definidos
  //     };
  //     const token = jwt.encode(payload, env.TOKEN_SECRET);
  //     return res.status(200).json({
  //       user,
  //       token,
  //     });
  //   } catch (err) {
  //     console.log(err.toString());
  //     return res.status(500).json({
  //       success: false,
  //       mensaje: err.toString(),
  //     });
  //   }
  // }
}

// Exportamos el módulo
export default new UserController();
