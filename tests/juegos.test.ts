import request from 'supertest';
import http from 'http';
import { v1 as uuidv1 } from 'uuid';
import server from '../src';
import Juego from '../src/interfaces/juego';
import User from '../src/interfaces/user';

process.env.NODE_ENV = 'test';

/**
 * TEST: JUEGOS
 */
describe('Suite Test de Juegos', () => {
  let servicio: http.Server;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'juegos';
  let juegoID: string;
  const userTest: User = {
    nombre: 'Test Test',
    email: `${uuidv1()}@test.com`,
    password: 'test123',
    role: 'USER',
  };
  let tokenTest: string;
  const juegoIDFalso = '999999999999999999999999';

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
    test(`Debería añadir un juego con los datos indicados /${Path}/${Version}/${EndPoint}`, async () => {
      const data: Juego = {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: userTest.id || undefined,
      };
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(201);
      const item:Juego = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.titulo).toBe(data.titulo);
      expect(item.descripcion).toBe(data.descripcion);
      expect(item.plataforma).toBe(data.plataforma);
      expect(item.imagen).toBe(data.imagen);
      expect(item.usuarioId).toBe(userTest.id);
      juegoID = response.body.id;
    });

    test(`NO Debería añadir un juego pues falta el título /${Path}/${Version}/${EndPoint}`, async () => {
      const data: Juego = {
        titulo: '',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: '111',
      };
      const response = await request(servicio)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(422);
      // expect(response.body.mensaje).toContain('El título del juego es un campo obligatorio');
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
        .get(`/${Path}/${Version}/${EndPoint}`);
      expect(response.status).toBe(200);
      const listaItems: Juego[] = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(listaItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un juego con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${juegoID}`);
      expect(response.status).toBe(200);
      const item:Juego = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(juegoID);
    });

    test(`NO Debería obetener un juego con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .get(`/${Path}/${Version}/${EndPoint}/${juegoIDFalso}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });
  });

  describe('Suite Test de PUT', () => {
    test(`Debería modificar un juego con los datos indicados /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const data: Juego = {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: userTest.id || undefined,
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${juegoID}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(200);
      const item:Juego = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.titulo).toBe(data.titulo);
      expect(item.descripcion).toBe(data.descripcion);
      expect(item.plataforma).toBe(data.plataforma);
      expect(item.imagen).toBe(data.imagen);
      expect(item.id).toBe(juegoID);
      expect(item.usuarioId).toBe(userTest.id);
    });

    test(`NO Debería modificar un juego pues falta el título /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const data: Juego = {
        titulo: '',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: userTest.id || undefined,
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${juegoID}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(422);
      // expect(response.body.mensaje).toContain('El título del juego es un campo obligatorio');
    });

    test(`NO Debería modificar un juego pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const data: Juego = {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: userTest.id || undefined,
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${juegoIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });

    test(`NO Debería modificar un juego pues NO me pertenece /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const data: Juego = {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: 'aaa',
      };
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${juegoIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` })
        .send(data);
      expect(response.status).toBe(403);
      expect(response.body.mensaje).toContain('No tienes permisos para realizar esta acción');
    });

    test(`NO Debería modificar un juego token invalido /${Path}/${Version}/${EndPoint}`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .put(`/${Path}/${Version}/${EndPoint}/${juegoID}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({});
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`NO Debería eliminar un juego token invalido /${Path}/${Version}/${EndPoint}`, async () => {
      const token = `${tokenTest}123`;
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${juegoID}`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
      expect(response.body.mensaje).toContain('No autenticado o sesión ha expirado');
    });

    test(`Debería eliminar un juego dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${juegoID}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(200);
      const item:Juego = response.body;
      expect(item).toHaveProperty('titulo');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(juegoID);
    });

    test(`NO Debería eliminar un juego pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const response = await request(servicio)
        .delete(`/${Path}/${Version}/${EndPoint}/${juegoIDFalso}`)
        .set({ Authorization: `Bearer ${tokenTest}` });
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });
  });
});
