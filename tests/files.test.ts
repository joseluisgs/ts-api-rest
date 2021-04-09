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
  const file = `${__dirname}/test.jpg`;
  let fileID: string;

  // instanciamos el servidor
  beforeAll(async () => {
    servidor = server.start();
  });

  afterAll(async () => {
    servidor.close();
  });

  describe('Suite Test de POST', () => {
    test(`Debería añadir un fichero con los datos indicados /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .attach('file', file);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      // Para el resto de test
      fileID = response.body.id;
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

    test(`NO Debería añadir un fichero, pues falta file o el campo es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .attach('kk', file);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('No hay fichero para subir o no se ha insertado el campo file');
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un fichero con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${fileID}`);
      expect(response.status).toBe(200);
      const item:File = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(fileID);
    });

    test(`NO Debería obetener un fichero con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });

  describe('Suite Test de DWONLOAD BY ID', () => {
    test(`Debería descargar un fichero con ID indicado /${Path}/${Version}/${EndPoint}/download/ID`, async () => {
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/download/${fileID}`);
      expect(response.status).toBe(200);
    });

    test(`NO Debería descacargar un fichero con ID indicado /${Path}/${Version}/${EndPoint}/download/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/download/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });

  describe('Suite Test de PUT', () => {
    test(`Debería modificar un fichero con los datos indicados /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .attach('file', file);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería modificar un fichero pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`)
        .attach('file', file);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });

    test(`NO Debería añadir un fichero, pues falta file o el campo es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .attach('kk', file);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('No hay fichero para subir o no se ha insertado el campo file');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`Debería eliminar un fichero dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${fileID}`);
      expect(response.status).toBe(200);
      const item:File = response.body;
      expect(item).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería eliminar un fichero pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });
});
