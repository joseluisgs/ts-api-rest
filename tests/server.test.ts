import { AddressInfo } from 'node:net';
import request from 'supertest';
import servidor from '../src';
import env from '../src/env';

process.env.NODE_ENV = 'test';

/**
 * TEST: Servidor
 */
describe('Suite Test de Servidor', () => {
  const Path = 'api';
  const Version = 'v1';

  afterAll(async () => {
    servidor.close();
  });

  test('Debería iniciarse el servidor, no es nulo', () => {
    expect(servidor).not.toBeNull();
  });

  test('Debería iniciarse el escuchar en el puerto por defecto, no es nulo', () => {
    const address = servidor.address() as AddressInfo;
    const { port } = address;
    expect(port).toBe(Number(env.PORT));
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
