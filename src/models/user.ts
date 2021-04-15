/**
 * MODELO EN BASE AL ESQUEMA DE USUARIO
 * Como implementar relaciones: https://rosolutions.com.mx/blog/index.php/2018/08/06/como-usar-un-orm-en-node-js/
 * Yo lo voy a hacer de manera controlada en algunos casos
 */

// import sequelize
import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => sequelize.define('user', {
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
