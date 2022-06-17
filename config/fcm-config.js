const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

export const SERVER_KEY = env.FCM_SERVER_KEY;
