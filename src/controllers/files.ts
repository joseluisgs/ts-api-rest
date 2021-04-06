/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import ListaFiles from '../mocks/files';
import File from '../interfaces/file';

// Comprueba que la entrada es correcta de datos. Es auxiliar
const checkBody = (req: Request) => req.body.nombre && req.body.nombre.trim().length > 0;

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
    return res.status(200).json(ListaFiles);
  }

  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      const data = ListaFiles.find((file) => file.id === req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
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
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'El nombre del fichero es un campo obligatorio',
        });
      }
      const data: File = {
        id: Date.now().toString(),
        nombre: req.body.nombre,
        url: req.body.url || undefined,
        fecha: req.body.fecha || new Date(),
        usuarioId: req.body.usuarioId || undefined,
      };
      ListaFiles.push(data);
      return res.status(201).json(data);
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
      const index = ListaFiles.findIndex((file) => file.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'El nombre del fichero es un campo obligatorio',
        });
      }
      let data = ListaFiles[index];
      data = {
        id: data.id,
        nombre: req.body.nombre || data.nombre,
        url: req.body.url || data.url,
        fecha: req.body.fecha || data.fecha,
        usuarioId: data.usuarioId,
      };
      ListaFiles[index] = data;
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
   * Elimina un elemento dado su ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async remove(req: Request, res: Response) {
    try {
      const index = ListaFiles.findIndex((file) => file.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      const data = ListaFiles[index];
      ListaFiles.splice(index, 1);
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
}

// Exportamos el módulo
export default new FilesController();
