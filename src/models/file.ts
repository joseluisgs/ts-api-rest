/**
 * MODELO EN BASE AL ESQUEMA DE NOTAS
 */

// import sequelize
import { DataTypes, Sequelize } from 'sequelize';

// Creación del esquema
export default (sequelize: Sequelize) => sequelize.define('file', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  usuarioId: {
    type: DataTypes.STRING,
  },
});
