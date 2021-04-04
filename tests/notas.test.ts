import request from 'supertest';
import server from '../src';
import env from '../src/env';

process.env.NODE_ENV = 'test';

/**
 * TEST: NOTAS
 */
describe('Suite Test de Notas', () => {
  let servidor: any;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'notas';

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
  });
});
