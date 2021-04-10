import request from 'supertest';
import server from '../src';
import User from '../src/interfaces/user';

process.env.NODE_ENV = 'test';

/**
 * TEST: USER
 */
describe('Suite Test de Usuarios', () => {
  let servidor: any;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'user';
  let userID: string;

  // instanciamos el servidor
  beforeAll(async () => {
    servidor = server.start();
  });

  afterAll(async () => {
    servidor.close();
  });

  describe('Suite Test de POST', () => {
    test(`Debería añadir un usuario con los datos indicados /${Path}/${Version}/${EndPoint}/register`, async () => {
      const data: User = {
        nombre: 'Test Test',
        email: 'test@test.com',
        password: 'test123',
        role: 'USER',
      };
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}/register`)
        .send(data);
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
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}/register`)
        .send(data);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('Faltan campos obligatorios como nombre, email o passowrd');
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un usuario con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${userID}`);
      expect(response.status).toBe(200);
      const item:User = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(userID);
    });

    test(`NO Debería obetener un usuario con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún/a usuario/a con ID');
    });
  });

  describe('Suite Test de Login', () => {
    test(`Debería loguearse un usuario con los datos indicados /${Path}/${Version}/${EndPoint}/login`, async () => {
      const data = {
        email: 'test@test.com',
        password: 'test123',
      };
      const response = await request(servidor)
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
    });

    test(`NO Debería loguear un usuario, pues el campo es incorrecto /${Path}/${Version}/${EndPoint}/login`, async () => {
      const data = {
        email: 'test1@test1.com',
        password: 'test1234',
      };
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}/login`)
        .send(data);
      expect(response.status).toBe(403);
      expect(response.body.mensaje).toContain('Usuario/a o contraseña incorrectos');
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
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .send(data);
      expect(response.status).toBe(200);
      const item:User = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(userID);
    });

    test(`NO Debería modificar un usuario pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const data: User = {
        nombre: 'TestMod TestMod',
        email: 'testMod@testMod.com',
        password: 'test123',
        role: 'USER',
      };
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`)
        .send(data);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún/a usuario/a con ID');
    });

    test(`NO Debería modificar un usuario, pues faltan campos o el campo es incorrecto /${Path}/${Version}/${EndPoint}`, async () => {
      const data: User = {
        nombre: 'TestMod TestMod',
        email: '',
        password: '',
        role: 'USER',
      };
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${userID}`)
        .send(data);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('Faltan campos obligatorios como nombre, email o passowrd');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`Debería eliminar un fichero dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${userID}`);
      expect(response.status).toBe(200);
      const item:File = response.body;
      expect(item).toHaveProperty('nombre');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería eliminar un usuario pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún/a usuario/a con ID');
    });
  });
});
