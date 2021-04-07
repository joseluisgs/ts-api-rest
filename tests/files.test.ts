import request from 'supertest';
import server from '../src';
import File from '../src/interfaces/file';

process.env.NODE_ENV = 'test';

/**
 * TEST: FICHEROS
 */
describe('Suite Test de Ficheros', () => {
  let servidor: any;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'files';

  // instanciamos el servidor
  beforeAll(async () => {
    servidor = server.start();
  });

  afterAll(async () => {
    servidor.close();
  });

  describe('Suite Test de GET ALL', () => {
    test(`Debería obetener el metodo GET ALL /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}`);
      expect(response.status).toBe(200);
      const listaItems: File[] = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(listaItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un fichero con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(200);
      const item:File = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(ID);
    });

    test(`NO Debería obetener un fichero con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });

  describe('Suite Test de POST', () => {
    test(`Debería añadir un fichero con los datos indicados /${Path}/${Version}/${EndPoint}`, async () => {
      const data = `${__dirname}/test.jpg`;
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .attach('file', data);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });
  });

  describe('Suite Test de PUT', () => {
    test(`Debería modificar un fichero con los datos indicados /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const data: File = {
        nombre: 'zelda.png',
        url: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
      };
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`)
        .send(data);
      expect(response.status).toBe(200);
      const item:File = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.nombre).toBe(data.nombre);
      expect(item.url).toBe(data.url);
    });

    test(`NO Debería modificar un fichero pues falta el nombre /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const data: File = {
        nombre: '',
        url: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: '111',
      };
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`)
        .send(data);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('El nombre del fichero es un campo obligatorio');
    });

    test(`NO Debería modificar un juego pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`Debería eliminar un fichero dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(200);
      const item:File = response.body;
      expect(item).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería eliminar un juego pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });
});
