import { DataTypes } from 'sequelize';
import {sequelize} from '../config/dbConfig.js'


export const Product = sequelize.define('Product', {
  campaignName: DataTypes.STRING,
  adGroupId: DataTypes.STRING,
  fsnId: DataTypes.STRING,
  productName: DataTypes.STRING,
  adSpend: DataTypes.FLOAT,
  views: DataTypes.INTEGER,
  clicks: DataTypes.INTEGER,
  directRevenue: DataTypes.FLOAT,
  indirectRevenue: DataTypes.FLOAT,
  directUnits: DataTypes.INTEGER,
  indirectUnits: DataTypes.INTEGER
},{
    tableName:'Product'
});


