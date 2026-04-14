const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAILID',
  'PASSWORDFORMAIL',
  'ACCESS_TOKEN_SECRET_FOR_PASSWORD_RESET',
  'SMTP_HOST',
  'SMTP_PORT',
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  port: process.env.PORT || 5000,
};