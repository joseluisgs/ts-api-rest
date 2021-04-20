/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import env from '../env';
import MariaDB from '../database';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const conn = MariaDB.getConnection();
const UserBD = MariaDB.getModels().User;

// METODOS AUXILIARES
// Algunos de estos métodos auxiliares es otra forma de hacerlo si no usaramos Express Validator

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
 * Tranforma la salida del objeto a un formato JSON que nos interesa
 * @param item Itema a tranformar
 * @returns salida JSON que nos interesa
 */
const toJSON = (item: any) => {
  // quito password
  const { password, ...rest } = item;
  // construto un nuevo objeto
  return { ...rest };
};

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
      const data = await UserBD.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      // Acción
      return res.status(200).json(toJSON(data.dataValues));
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
      return res.status(201).json(toJSON(data.dataValues));
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }

  /**
   * Actualiza un elemento dado su ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async update(req: Request, res: Response) {
    try {
      // Todos los datos
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
        });
      }
      // Tenemos permiso o no existe
      if (Number(req.user.id) !== Number(req.params.id)) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Existe, tomamos sus datos antiguos
      let data = await UserBD.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      // Acción
      const oldData = data.dataValues;
      const newData = {
        nombre: req.body.nombre || oldData.nombre,
        email: req.body.email || oldData.email,
        password: (req.body.password ? bcrypt.hashSync(req.body.password, env.BC_SALT) : oldData.password),
        fecha: req.body.fecha || oldData.fecha,
        role: req.body.role.toUpperCase() || oldData.role,
      };
      data = await UserBD.update(newData, {
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }

  /**
   * Elimina un elemento dado su ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async remove(req: Request, res: Response) {
    try {
      // Tenemos permiso
      if (Number(req.user.id) !== Number(req.params.id)) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Realizamos la acción
      const data = await UserBD.destroy({
        where: {
          id: req.params.id,
        },
      });
      // Si es correcto y existe
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }

  /**
   * Realiza el login y devuleve el token
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async login(req: Request, res: Response) {
    try {
      // Todos los campos
      if (!checkLogin(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
        });
      }
      // Existe
      const data = await UserBD.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!data || !bcrypt.compareSync(req.body.password, data.dataValues.password)) {
        return res.status(403).json({
          success: false,
          mensaje: 'Usuario/a o contraseña incorrectos',
        });
      }
      const user = toJSON(data.dataValues);
      const payload = {
        user,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * env.TOKEN_LIFE), // 60 segundos * Minutos definidos
      };
      const token = jwt.encode(payload, env.TOKEN_SECRET);
      return res.status(200).json({
        user,
        token,
      });
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }
}

// Exportamos el módulo
export default new UserController();
