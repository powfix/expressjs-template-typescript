const dotenv = require('dotenv');
dotenv.config();

const env = process.env;

module.exports = {
  "accessKeyId": env.AWS_ACCESS_KEY_ID,
  "secretAccessKey": env.AWS_SECRET_ACCESS_KEY,
  "region": env.AWS_REGION,
};
