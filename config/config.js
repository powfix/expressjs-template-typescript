const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

const common = {
  pool: {
    max: 10,
    min: 1,
    idle: 10000,
    acquire: 60000,
  },
};

const development = {
  ...common,
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  dialect: env.DB_DIALECT,
  port: env.DB_PORT,
  logging: true,
};

const test = {
  ...common,
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  dialect: env.DB_DIALECT,
  port: env.DB_PORT,
  logging: true,
};

const production = {
  ...common,
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  dialect: env.DB_DIALECT,
  port: env.DB_PORT,
  logging: true,
};


module.exports = { development, test, production };
