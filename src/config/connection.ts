import { Dialect, Sequelize } from "sequelize";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const DB_USER: string = process.env.DB_USER || "";
const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
const DB_HOST: string = process.env.DB_HOST || "";
const DB_PORT: number = parseInt(process.env.DB_PORT || '5432', 10);
const DB_NAME: string = process.env.DB_NAME || "";
const DB_DIALECT: Dialect = process.env.DB_DIALECT as Dialect;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT
});

// Flag to control if syncModels has already been executed
let isSyncExecuted = false;

const syncModels = async () => {
  if (!isSyncExecuted) {
    try {
      await sequelize.sync({ force: false, alter: true });
      console.log('Models synchronized successfully.');
      isSyncExecuted = true;  // Set the flag to true after successful execution
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
  } else {
    console.log('syncModels has already been executed.');
  }
};

syncModels();

export { sequelize };
