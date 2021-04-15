/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { v1 as uuidv1 } from 'uuid';
import fs from 'fs';
import MariaDB from '../database';
import env from '../env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const conn = MariaDB.getConnection();
const FileBD = MariaDB.getModels().File;

// METODOS AUXILIARES

/**
 * Comprueba que hemos recibido el fichero en la petición
 * @param req Request
 * @returns True/False
 */
const checkFile = (req: Request) => req.files && Object.keys(req.files).length !== 0 && req.files.file;

/**
 * Devueleve la URL completa de la petición
 * @param req Request
 * @returns url
 */
const getFullUrl = (req: Request) => `${req.protocol}://${req.headers.host}${req.originalUrl}`;

/**
 * CONTROLADOR DE FICHEROS
 */

class FilesController {
  /**
   * Obtiene todos los elementos existentes
   * @param req Request
   * @param res Response
   * @returns 200 si OK y lista JSON
   */
  public async findAll(req: Request, res: Response) {
    try {
      const data = await FileBD.findAll();
      // Maquillamos el JSON para quitar los campos de MongoDB no nos interesen
      return res.status(200).json(data);
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
      const data = await FileBD.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      // Tenemos permiso, sin middleware
      const file = data.dataValues;
      if (Number(req.user.id) !== Number(file.usuarioId)) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Acción
      return res.status(200).json(file);
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
      // Todos los datos
      if (!checkFile(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'No hay fichero para subir o no se ha insertado el campo file',
        });
      }
      // Accion
      const file: any = req.files?.file;
      let fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
      const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
      fileName = `${uuidv1()}.${fileExt}`; // this.getStorageName(file);
      file.mv(env.STORAGE + fileName);

      const data = await FileBD.create({
        nombre: fileName,
        url: `${getFullUrl(req)}download/${fileName}`,
        fecha: new Date(),
        usuarioId: req.body.usuarioId || req.user.id,
      });
      // Acción
      return res.status(201).json(data.dataValues);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
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
      // Todos los campos
      if (!checkFile(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'No hay fichero para subir o no se ha insertado el campo file',
        });
      }
      // Existe y tenemos permiso
      const data = await FileBD.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      const oldData = data.dataValues;
      if (Number(req.user.id) !== Number(oldData.usuarioId)) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Acción
      const file: any = req.files?.file;
      file.mv(env.STORAGE + oldData.nombre);
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
      // Existe y tenemos permiso
      let data = await FileBD.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      // Tenemos permiso, una vez que podemos acceder al objeto
      const file = data.dataValues;
      if (Number(req.user.id) !== Number(file.usuarioId)) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Acción
      fs.unlinkSync(env.STORAGE + file.nombre);
      // Realizamos la acción
      data = await FileBD.destroy({
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
        data: null,
      });
    }
  }

  /**
   * Descarga el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async download(req: Request, res: Response) {
    try {
      const data = await FileBD.findByPk(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      const file = data.dataValues;
      return res.status(200).download(env.STORAGE + file.nombre);
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }
}

// Exportamos el módulo
export default new FilesController();
