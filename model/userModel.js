import { sequelize } from '../config/dbConfig.js';
import { DataTypes } from 'sequelize';


export const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false }
},{tableName:'User'});


