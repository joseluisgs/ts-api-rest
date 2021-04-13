/**
 * MODELO EN BASE AL ESQUEMA DE NOTAS
 */

import { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoDB from '../database';

// Roles
const roles = {
  values: ['ADMIN', 'USER'],
  mensaje: '{VALUE} no es un rol válido',
};

// Creación del esquema
const UserSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'Nombre de usuario/a obligatorio'], trim: true },
    email: {
      type: String, required: [true, 'E-Mail de usuario/a obligatorio'], trim: true, unique: true, index: true,
    },
    password: { type: String, required: [true, 'Password de usuario/a obligatorio'], trim: true },
    fecha: { type: Date, default: Date.now },
    role: { type: String, default: 'USER', enum: roles },
  },
  // Opciones
  {
  // El método estriccto nos dice si aceptamos o no un documento con algo
  // que no cumpla esta especificacion. Lo ponemos así porque no vamos a meter el id y da un poco de flexibilidad
    strict: false,
    // Le añadimos una huella de tiempo
    timestamps: true,
  },
);

// Validadores de propiedades.
UserSchema.plugin(uniqueValidator, { mensaje: 'Error, esperaba {PATH} único.' });

const UserDB = () => mongoDB.getConnection().model('User', UserSchema);

export default UserDB;
