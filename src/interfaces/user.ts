/*
 * Definición de interfaz para casar los datos de Usuario.
 */
export default interface User {
  id?: string|null;
  nombre: string;
  email: string;
  password: string;
  fecha?: Date;
  roles: string;
}
