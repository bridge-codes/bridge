import dotenv from 'dotenv';
import path from 'path';

if (!process.env.MONGODB_URI) dotenv.config({ path: path.join('.env.example') });

export const api = {
  env: process.env.ENV,
  projectName: process.env.PROJECT_NAME,
  port: parseInt(process.env.PORT || '') || 8080,
  jwt: {
    expirationTime: process.env.JWT_EXPIRATION_TIME || '8m',
    accessTokenKey: process.env.ACCESS_TOKEN_KEY || '',
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY || '',
  },
  mongodb: {
    url: process.env.MONGODB_URI,
  },
};
