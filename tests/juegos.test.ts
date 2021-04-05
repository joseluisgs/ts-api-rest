import request from 'supertest';
import server from '../src';
import JuegoInterface from '../src/interfaces/juego';

process.env.NODE_ENV = 'test';

/**
 * TEST: NOTAS
 */
describe('Suite Test de Juegos', () => {
  let servidor: any;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'juegos';

  // instanciamos el servidor
  beforeAll(async () => {
    servidor = server.start();
  });

  afterAll(async () => {
    servidor.close();
  });

  describe('Suite Test de GET ALL', () => {
    test(`Debería obetener el metodo GET ALL /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servidor).get(`/${Path}/${Version}/${EndPoint}`);
      expect(response.status).toBe(200);
      const listaJuegos: JuegoInterface[] = response.body;
      expect(listaJuegos.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un juego con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const response = await request(servidor).get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(ID);
    });

    test(`NO Debería obetener un juego con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor).get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });
  });
});
