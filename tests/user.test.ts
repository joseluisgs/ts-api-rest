import request from 'supertest';
import http from 'http';
import { v1 as uuidv1 } from 'uuid';
import server from '../src';
import User from '../src/interfaces/user';

process.env.NODE_ENV = 'test';

/**
 * TEST: USER
 */
describe('Suite Test de Usuarios', () => {
  let servicio: http.Server;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'user';
  const userTest = {
    nombre: 'Test Test',
    email: `${uuidv1()}@test.com`,
    password: 'test123',
    role: 'USER',
  };
  let userID: string;
  let tokenTest: string;
  const userIDFalso = '999999999999999999999999';

  beforeAll(async () => {
    servicio = await server.start();
  });
  afterAll(async (done) => {
    // Cerramos el servicio
    await server.close();
    done();
  });

  describe('Suite Test de POST', () => {
    test(`Debería añadir un usuario con los datos indicados /${Path}/${Version}/${EndPoint}/register`, async () => {
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}/register`)
        .send(userTest);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      // Para el resto de test
      userID = response.body.id;
    });

    test(`NO Debería añadir un usuario, pues faltan campos o son incorrectos /${Path}/${Version}/${EndPoint}/register`, async () => {
      const data: User = {
        nombre: 'Test Test',
        email: '',
        password: '',
        role: 'USER',
      };
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}/register`)
        .send(data);
      expect(response.status).toBe(422);
      // expect(response.body.errors).toContain('Faltan campos obligatorios como nombre, email o passowrd');
    });
  });

  describe('Suite Test de Login', () => {
    test(`Debería loguearse un usuario con los datos indicados /${Path}/${Version}/${EndPoint}/login`, async () => {
      const data = {
        email: userTest.email,
        password: userTest.password,
      };
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}/login`)
        .send(data);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.token).not.toHaveLength(0);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('role');
      // Para el resto de test
      userID = response.body.user.id;
      tokenTest = response.body.token;
    });

    test(`NO Debería loguear un usuario, pues el campo es incorrecto /${Path}/${Version}/${EndPoint}/login`, async () => {
      const data = {
        email: 'test1@test1.com',
        password: 'test1234',
      };
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}/login`)
        .send(data);
      expect(response.status).toBe(403);
      expect(response.body.mensaje).toContain('Usuario/a o contraseña incorrectos');
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un usuario con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(200);
      const item:User = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(userID);
    });

    test(`NO Debería obetener un usuario con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${userIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún/a usuario/a con ID');
    });

    test(`NO Debería obetener un usuario token invalido /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de PUT', () => {
    test(`Debería modificar un fichero con los datos indicados /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const data: User = {
        nombre: 'TestMod TestMod',
        email: 'testMod@testMod.com',
        password: 'test123',
        role: 'USER',
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(200);
    });

    test(`NO Debería modificar un usuario pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const data: User = {
        nombre: 'TestMod TestMod',
        email: 'testMod@testMod.com',
        password: 'test123',
        role: 'USER',
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${userIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(403);
      expect(response.body.mensaje).toContain('No tienes permisos para realizar esta acción');
    });

    test(`NO Debería modificar un usuario, pues faltan campos o el campo es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const data: User = {
        nombre: 'TestMod TestMod',
        email: '',
        password: '',
        role: 'USER',
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(422);
      // expect(response.body.mensaje).toContain('Faltan campos obligatorios como nombre, email o passowrd');
    });

    test(`NO Debería actualizar un usuario token invalido /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`NO Debería eliminar un usuario token invalido /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });

    test(`Debería eliminar un usuario dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(200);
    });

    test(`NO Debería eliminar un usuario pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${userIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(403);
      expect(response.body.mensaje).toContain('No tienes permisos para realizar esta acción');
    });
  });
});
