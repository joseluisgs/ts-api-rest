/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
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
    return res.status(200).send('Juegos');
  }
}

// Exportamos el módulo
export default new JuegosController();
