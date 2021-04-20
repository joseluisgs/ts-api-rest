/**
 * MODELO EN BASE AL ESQUEMA DE NOTAS
 */

import { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import mongoDB from '../database';

// Creación del esquema
const FileSchema = new Schema(
  {
    nombre: {
      type: String, required: [true, 'Nombre de fichero obligatorio'], trim: true, unique: true, index: true,
    },
    url: { type: String, required: [true, 'La dirección url del fichero es obligatoria'], trim: true },
    plataforma: { type: String, trim: true },
    fecha: { type: Date, default: Date.now },
    usuarioId: { type: String, default: '' },
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
FileSchema.plugin(uniqueValidator, { mensaje: 'Error, esperaba {PATH} único.' });

// const JuegoModel = () => db.connection().model('Juego', JuegoSchema);
const FileDB = () => mongoDB.getConnection().model('File', FileSchema);
export default FileDB;
