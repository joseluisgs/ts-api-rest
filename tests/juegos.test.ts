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

  test(`Debería obetener el metodo GET ALL /${Path}/${Version}/${EndPoint}`, async () => {
    const response = await request(servidor).get(`/${Path}/${Version}/${EndPoint}`);
    expect(response.status).toBe(200);
    const listaJuegos: JuegoInterface[] = response.body;
    expect(listaJuegos.length).toBeGreaterThanOrEqual(0);
  });
});
