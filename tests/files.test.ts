import request from 'supertest';
import http from 'http';
import { v1 as uuidv1 } from 'uuid';
import server from '../src';
import File from '../src/interfaces/file';
import User from '../src/interfaces/user';

process.env.NODE_ENV = 'test';

/**
 * TEST: FICHEROS
 */
describe('Suite Test de Ficheros', () => {
  let servicio: http.Server;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'files';
  const file = `${__dirname}/test.jpg`;
  let fileID: string;
  const userTest: User = {
    nombre: 'Test Test',
    email: `${uuidv1()}@test.com`,
    password: 'test123',
    role: 'ADMIN',
  };
  let tokenTest: string;
  const fileIDFalso = '999999999999999999999999';

  beforeAll(async () => {
    servicio = await server.start();
    // insertamos al usuario de prueba
    let response = await request(servicio)
      .post(`/${Path}/${Version}/user/register`)
      .send(userTest);
    expect(response.status).toBe(201);

    // hacemos el login
    const data = {
      email: userTest.email,
      password: userTest.password,
    };
    response = await request(servicio)
      .post(`/${Path}/${Version}/user/login`)
      .send(data);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    // Para el resto de test
    tokenTest = response.body.token;
    userTest.id = response.body.user.id;
  });

  afterAll(async (done) => {
    // Borramos al usuario
    const response = await request(servicio)
      .delete(`/${Path}/${Version}/user/${userTest.id}`)
      .set({ Authorization: `Bearer ${tokenTest}` });
    expect(response.status).toBe(200);
    // Cerramos el servicio
    await server.close();
    done();
  });

  describe('Suite Test de POST', () => {
    test(`Debería añadir un fichero con los datos indicados /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .attach('file', file);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      // Para el resto de test
      fileID = response.body.id;
    });

    test(`NO Debería añadir un fichero, pues falta file o el campo es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .attach('kk', file);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('No hay fichero para subir o no se ha insertado el campo file');
    });

    test(`NO Debería añadir un juego token invalido /${Path}/${Version}/${EndPoint}`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({});
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de GET ALL', () => {
    test(`Debería obetener el metodo GET ALL /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(200);
      const listaItems: File[] = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(listaItems.length).toBeGreaterThanOrEqual(0);
    });

    test(`No Debería obetener el metodo GET ALL token inválido /${Path}/${Version}/${EndPoint}`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un fichero con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(200);
      const item:File = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(fileID);
    });

    test(`NO Debería obetener un fichero con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${fileIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });

    test(`NO Debería obetener un fichero con ID indicado token inválido en /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de DWONLOAD BY ID', () => {
    test(`Debería descargar un fichero con ID indicado /${Path}/${Version}/${EndPoint}/download/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/download/${fileID}`);
      expect(response.status).toBe(200);
    });

    test(`NO Debería descacargar un fichero con ID indicado /${Path}/${Version}/${EndPoint}/download/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/download/${fileIDFalso}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });
  });

  describe('Suite Test de PUT', () => {
    test(`Debería modificar un fichero con los datos indicados /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .attach('file', file);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería modificar un fichero pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${fileIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .attach('file', file);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });

    test(`NO Debería modificar un fichero, pues falta file o el campo es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .attach('kk', file);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('No hay fichero para subir o no se ha insertado el campo file');
    });

    test(`NO Debería modificar un fichero, token es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${token}` })
        .attach('file', file);
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`Debería eliminar un fichero dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(200);
      const item:File = response.body;
      expect(item).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería eliminar un fichero pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${fileIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún fichero con ID');
    });

    test(`NO Debería eliminar un fichero, token es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${fileID}`)
        .set({ Authorization: `Bearer ${token}` })
        .attach('file', file);
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });
});
