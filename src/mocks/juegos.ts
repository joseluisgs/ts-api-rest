/**
 * Mocks de juegos
 */

import Juego from '../interfaces/juego';

const listaJuegos:Juego[] = [
  {
    titulo: 'Spider-Man',
    descripcion: 'Spider-Man. Juego del Año',
    plataforma: 'Play Station',
    fecha: new Date(),
    activo: true,
    imagen: 'https://images-na.ssl-images-amazon.com/images/I/71dCvmuZlqL._AC_SL1500_.jpg',
    usuarioId: '111',
  },
  {
    titulo: 'Resident Evil Revelations 2',
    descripcion: 'Otra aventura de Resident Evil',
    plataforma: 'Nintendo Switch',
    fecha: new Date(),
    activo: false,
    imagen: 'https://i.redd.it/vm8b57apj4dz.png',
    usuarioId: '222',
  },

];

export default listaJuegos;
