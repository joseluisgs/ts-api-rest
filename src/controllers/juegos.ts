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
}

// Exportamos el módulo
export default new JuegosController();
