import request from 'supertest';
import server from '../src';
import env from '../src/env';

process.env.NODE_ENV = 'test';

/**
 * TEST: Servidor
 */
describe('Suite Test de Servidor', () => {
  let servidor: any;
  const Path = 'api';
  const Version = 'v1';

  // instanciamos el servidor
  beforeAll(async () => {
    servidor = server.start();
  });

  afterAll(() => {
    servidor.close();
  });

  test('Debería iniciarse el servidor, no es nulo', () => {
    expect(servidor).not.toBeNull();
  });

  test('Debería iniciarse el escuchar en el puerto por defecto, no es nulo', () => {
    expect(servidor.address().port).toBe(Number(env.PORT));
  });

  test('Debería responder en el metodo GET /', async () => {
    const salida = '¡Hola BackEnd en TypeScript/Node.js!';
    const response = await request(servidor).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe(salida);
  });

  test(`Debería responder en el metodo GET /${Path}/${Version}/hola`, async () => {
    const salida = `¡Hola API!: version ${Version}`;
    const response = await request(servidor).get(`/${Path}/${Version}/hola`);
    expect(response.status).toBe(200);
    expect(response.text).toBe(salida);
  });
});
