import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'ecommerce-database.db', // SQLite will store the database in this file
    logging: false,            // Disable SQL query logging in the console
  });
  
