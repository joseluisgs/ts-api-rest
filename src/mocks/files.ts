/**
 * Mocks de Ficheros
 */

import File from '../interfaces/file';

const listaFiles:File[] = [
  {
    id: '1',
    nombre: 'spiderman.jpg',
    url: 'https://images-na.ssl-images-amazon.com/images/I/71dCvmuZlqL._AC_SL1500_.jpg',
    fecha: new Date(),
    usuarioId: '111',
  },
  {
    id: '2',
    nombre: 'resident.jpg',
    url: 'https://i.redd.it/vm8b57apj4dz.png',
    fecha: new Date(),
    usuarioId: '222',
  },

];

export default listaFiles;
