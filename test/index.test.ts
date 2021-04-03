import server from '../src';
import env from '../src/env';


process.env.NODE_ENV = 'test';

/**
 * TEST: Servidor
 */
describe('Suite Test de Servidor', () => {
  let servidor: any;

  // instanciamos el servidor
  beforeAll(() => {
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
});
