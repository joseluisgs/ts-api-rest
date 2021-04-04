/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
/**
 * CONTROLADOR DE NOTAS
 */

class NotasController {
  /**
   * GET ALL: Obtiene todos los elementos
   * @param req Request
   * @param res Response
   * @returns 200 if OK and JSON
   */
  public async getAll(req: Request, res: Response) {
    return res.status(200).send('Notas');
  }
}

// Exportamos el módulo
export default new NotasController();
