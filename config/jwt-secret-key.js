const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

module.exports = env.JWT_SECRET_KEY;
