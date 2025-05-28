
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  secretKey: process.env.SECRET_KEY,
};
