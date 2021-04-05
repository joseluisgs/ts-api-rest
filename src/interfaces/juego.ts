/**
 * Definición de interfaz para casar los datos de juegos.
 */
export default interface Juego {
  titulo: string;
  descripcion?: string;
  plataforma?: string;
  fecha: Date;
  activo?: Boolean;
  imagen?: string;
  usuarioId?: string;
}
