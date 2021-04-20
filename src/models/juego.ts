/**
 * MODELO EN BASE AL ESQUEMA DE NOTAS
 */

import { Schema } from 'mongoose';
import mongoDB from '../database';

// Creación del esquema
const JuegoSchema = new Schema(
  {
    titulo: { type: String, required: [true, 'Título del Juego obligatorio'], trim: true },
    descripcion: { type: String, trim: true },
    plataforma: { type: String, trim: true },
    fecha: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    imagen: { type: Object, default: '' },
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

// Métodos estaticos que nos servirán para métodos rápidos

// Devuelve el ID
// JuegoSchema.statics.getById = function getById(id) {
//   return this.findOne({ _id: id })
//     .lean() // Con Lean le estamos diciendo que aprenda y la memorice porque la usaremos mucho
//     .exec(); // Que lo ejecute
// };

// JuegoSchema.statics.getAll = function getAll() {
//   // Si no quieres buscar por nada, deja la función fin vacía, sin where ni equals
//   return this.find()
//     .exec();
// };

// // Devuelve una lista de todos con opciones
// JuegoSchema.statics.getAllOptions = function getAllOptiones(pageOptions, searchOptions) {
//   // Si no quieres buscar por nada, deja la función fin vacía, sin where ni equals
//   return this.find()
//     .where(searchOptions.search_field)
//     .equals({ $regex: searchOptions.search_content, $options: 'i' })
//     .skip(pageOptions.page * pageOptions.limit) // si no quieres filtrar o paginar no pongas skip o limit
//     .limit(pageOptions.limit)
//     .sort({ title: searchOptions.search_order })
//     .exec();
// };

// Sobreescribimos el método JSON, y lo podemos cambiar como queramo, por ejemplo quitar _id y poner id
// JuegoSchema.method('toJSON', function toJSON() {
//   // eslint-disable-next-line @typescript-eslint/naming-convention
//   const { __v, _id, ...object } = this.toObject();
//   // eslint-disable-next-line no-underscore-dangle
//   object._id = _id; // Para cambiar _id por id
//   // eslint-disable-next-line no-underscore-dangle
//   delete object.__v; // Para borrar __v
//   return object;
// });

// const JuegoModel = () => db.connection().model('Juego', JuegoSchema);
const JuegoDB = () => mongoDB.getConnection().model('Juego', JuegoSchema);
export default JuegoDB;
