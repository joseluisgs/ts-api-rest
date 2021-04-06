/*
 * Definición de interfaz para casar los datos de fichero.
 */
export default interface File {
  id?: string|null;
  nombre: string;
  url?: string;
  fecha?: Date;
  usuarioId?: string;
}
