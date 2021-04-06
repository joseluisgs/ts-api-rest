import request from 'supertest';
import server from '../src';
import Juego from '../src/interfaces/juego';

process.env.NODE_ENV = 'test';

/**
 * TEST: NOTAS
 */
describe('Suite Test de Juegos', () => {
  let servidor: any;
  const Path = 'api';
  const Version = 'v1';
  const EndPoint = 'juegos';

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
      const listaItems: Juego[] = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(listaItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Suite Test de GET BY ID', () => {
    test(`Debería obetener un juego con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(200);
      const item:Juego = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.id).toBe(ID);
    });

    test(`NO Debería obetener un juego con ID indicado /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .get(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });
  });

  describe('Suite Test de POST', () => {
    test(`Debería añadir un juego con los datos indicados /${Path}/${Version}/${EndPoint}`, async () => {
      const data: Juego = {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: '111',
      };
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .send(data);
      expect(response.status).toBe(201);
      const item:Juego = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.titulo).toBe(data.titulo);
      expect(item.descripcion).toBe(data.descripcion);
      expect(item.plataforma).toBe(data.plataforma);
      expect(item.imagen).toBe(data.imagen);
    });

    test(`NO Debería añadir un juego pues falta el título /${Path}/${Version}/${EndPoint}`, async () => {
      const data: Juego = {
        titulo: '',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: '111',
      };
      const response = await request(servidor)
        .post(`/${Path}/${Version}/${EndPoint}`)
        .send(data);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('El título del juego es un campo obligatorio');
    });
  });

  describe('Suite Test de PUT', () => {
    test(`Debería modificar un juego con los datos indicados /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const data: Juego = {
        titulo: 'The Legend of Zelda: Breath of the Wild',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
      };
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`)
        .send(data);
      expect(response.status).toBe(200);
      const item:Juego = response.body; // Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
      expect(item.titulo).toBe(data.titulo);
      expect(item.descripcion).toBe(data.descripcion);
      expect(item.plataforma).toBe(data.plataforma);
      expect(item.imagen).toBe(data.imagen);
    });

    test(`NO Debería modificar un juego pues falta el título /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const data: Juego = {
        titulo: '',
        descripcion: 'La nueva Aventura de Zelda',
        plataforma: 'Nintendo Switch',
        imagen: 'https://images-na.ssl-images-amazon.com/images/I/91jvZUxquKL._AC_SL1500_.jpg',
        usuarioId: '111',
      };
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`)
        .send(data);
      expect(response.status).toBe(422);
      expect(response.body.mensaje).toContain('El título del juego es un campo obligatorio');
    });

    test(`NO Debería modificar un juego pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .put(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });
  });

  describe('Suite Test de DELETE', () => {
    test(`Debería eliminar un juego dado su ID /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = '1';
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(200);
      const item:Juego = response.body;
      expect(item).toHaveProperty('titulo');// Caso que se cumplan los tipos, es decir, el JSON cumple la estructura indicada
    });

    test(`NO Debería eliminar un juego pues el ID no existe /${Path}/${Version}/${EndPoint}/ID`, async () => {
      const ID = 'aaa';
      const response = await request(servidor)
        .delete(`/${Path}/${Version}/${EndPoint}/${ID}`);
      expect(response.status).toBe(404);
      expect(response.body.mensaje).toContain('No se ha encontrado ningún juego con ID');
    });
  });
});
