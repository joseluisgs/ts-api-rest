/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import ListaJuegos from '../mocks/juegos';
/**
 * CONTROLADOR DE Juegos
 */

class JuegosController {
  /**
   * Obtiene todos los elementos existentes
   * @param req Request
   * @param res Response
   * @returns 200 if OK and JSON
   */
  public async findAll(req: Request, res: Response) {
    return res.status(200).json(ListaJuegos);
  }

  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 if OK and JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      const data = ListaJuegos.find((juego) => juego.id === req.params.id);
      if (data) {
        return res.status(200).json(data);
      }
      return res.status(404).json({
        success: false,
        mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }
}

// Exportamos el módulo
export default new JuegosController();
