/**
 * Mocks de Usuarios
 */

import User from '../interfaces/user';

const listaUsers:User[] = [
  {
    id: '1',
    nombre: 'Pepe Perez',
    email: 'pepe@pepe.com',
    password: 'pepe123',
    fecha: new Date(),
    role: 'ADMIN',
  },
  {
    id: '2',
    nombre: 'Ana Anaya',
    email: 'ana@ana.com',
    password: 'pepe123',
    fecha: new Date(),
    role: 'USER',
  },

];

export default listaUsers;
