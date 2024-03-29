/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */

import { Request, Response } from 'express';
import JuegoBD from '../models/juego';

// METODOS AUXILIARES

/**
 * Comprueba que se nos pasa todos los datos que neesitamos
 * @param req Request
 * @returns True/False si los datos son correctos
 */
const checkBody = (req: Request) => req.body.titulo && req.body.titulo.trim().length > 0;

/**
 * Tranforma la salida del objeto a un formato JSON que nos interesa
 * @param item Itema a tranformar
 * @returns salida JSON que nos interesa
 */
const toJSON = (item: any) => {
  // Del objeto MongoDB, renombro la propiedad, quito la v y me quedo con el resto
  const { _id: id, __v, ...rest } = item.toObject();
  // construto un nuevo objeto
  return { id, ...rest };
};

/**
 * CONTROLADOR DE JUEGOS
 */
class JuegosController {
  /**
   * Obtiene todos los elementos existentes
   * @param req Request
   * @param res Response
   * @returns 200 si OK y lista JSON
   */
  public async findAll(req: Request, res: Response) {
    try {
      const data = await JuegoBD().find();
      // Maquillamos el JSON para quitar los campos de MongoDB no nos interesen
      return res.status(200).json(data.map(toJSON));
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }

  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      // Existe
      const data = await JuegoBD().findById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
        });
      }
      // Acción
      return res.status(200).json(toJSON(data));
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
          mensaje: 'El título del juego es un campo obligatorio',
        });
      }
      const newData = new (JuegoBD())({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion || undefined,
        plataforma: req.body.plataforma || undefined,
        fecha: req.body.fecha || new Date(),
        activo: Boolean(req.body.activo) || false,
        imagen: req.body.imagen || undefined,
        usuarioId: req.body.usuarioId || req.user.id,
      });
      // Acción
      const data = await newData.save();
      return res.status(201).json(toJSON(data));
    } catch (err) {
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
      // Están todos los datos
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'El título del juego es un campo obligatorio',
        });
      }
      // Implementado en el Middleware. Pero si no nos pasara en ID del usuario deberíamos buscarlo así
      // Tenemos permiso
      // Lo de existe no los podíamos ahorrar ya que findOneAndUpdate te puede dar dicho error
      // Pero lo hacemos porque hemos dicho que no podemos modificarlo si no es nuestro, por eso necesitamos este valor
      // Si no este if podría ir abajo de dicha función para analizar su resultado
      let data = await JuegoBD().findById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
        });
      }
      const oldData: any = data;
      // if (req.user.id !== oldData!.usuarioId) {
      //   return res.status(403).json({
      //     success: false,
      //     mensaje: 'No tienes permisos para realizar esta acción',
      //   });
      // }
      // Realizamos la acción
      const newData = {
        titulo: req.body.titulo || oldData.titulo,
        descripcion: req.body.descripcion || oldData.descripcion,
        plataforma: req.body.plataforma || oldData.plataforma,
        fecha: req.body.fecha || oldData.fecha,
        activo: Boolean(req.body.activo) || oldData.activo,
        imagen: req.body.imagen || oldData.imagen,
        usuarioId: req.body.usuarioId || oldData.usuarioId,
      };
      data = await JuegoBD().findByIdAndUpdate(req.params.id, newData, { new: true }); // con finOneAndUpdate debo poner la proyeccion
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
        });
      }
      return res.status(200).json(toJSON(data));
    } catch (err) {
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
      // Lo de existe no los podíamos ahorrar ya que findOneAndUpdate te puede dar dicho error
      // Pero lo hacemos porque hemos dicho que no podemos modificarlo si no es nuestro, por eso necesitamos este valor
      // Si no este if podría ir abajo de dicha función para analizar su resultado
      let data = await JuegoBD().findById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
        });
      }
      // Tenemos permiso, una vez que podemos acceder al objeto
      const juego: any = data;
      if (req.user.id !== juego!.usuarioId) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Realizamos la acción
      data = await JuegoBD().findByIdAndDelete(req.params.id);
      return res.status(200).json(toJSON(data));
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }
}

// Exportamos el módulo
export default new JuegosController();
