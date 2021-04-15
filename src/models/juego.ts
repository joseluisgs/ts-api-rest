/**
 * MODELO EN BASE AL ESQUEMA DE Juegos
 */

// import sequelize
import { DataTypes, Sequelize } from 'sequelize';

// Creación del esquema
export default (sequelize: Sequelize) => sequelize.define('juego', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  plataforma: {
    type: DataTypes.STRING,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imagen: {
    type: DataTypes.STRING,
  },
  usuarioId: {
    type: DataTypes.STRING,
  },
});
