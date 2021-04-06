/**
 * Definición de interfaz para casar los datos de juegos.
 * Juego un poco con campos obligatorios o no
 */
export default interface Juego {
  id?: string|null;
  titulo: string;
  descripcion?: string;
  plataforma?: string;
  fecha?: Date;
  activo?: Boolean;
  imagen?: string;
  usuarioId?: string;
}
