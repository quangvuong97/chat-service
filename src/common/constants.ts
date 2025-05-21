/**
 * @enum EEnvConfig
 * @description This is an enum for the environment variables
 */
export enum EEnvConfig {
  // API_PORT
  API_PORT = 'API_PORT',
  PROJECT_ENV = 'PROJECT_ENV',

  // Redis
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_USERNAME = 'REDIS_USERNAME',
  REDIS_PASSWORD = 'REDIS_PASSWORD',

  // MongoDB
  MONGODB_URI = 'MONGODB_URI',

  // JWT
  JWT_SECRET = 'JWT_SECRET',
}
