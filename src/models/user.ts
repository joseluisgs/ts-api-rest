/**
 * MODELO EN BASE AL ESQUEMA DE NOTAS
 */

// import sequelize
import { DataTypes } from 'sequelize';
// importing connection database
import db from '../database';

const conn = db.connect();

const UserBD = conn.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER',
  },
});

conn.sync();

export default UserBD;
