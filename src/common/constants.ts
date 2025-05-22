/**
 * @enum EEnvConfig
 * @description Enum defines the keys for environment variables used in the application.
 * Used with ConfigService to access configuration values in a type-safe manner.
 */
export enum EEnvConfig {
  // API_PORT
  /** The port that the API server will listen on */
  API_PORT = 'API_PORT',

  // Redis
  /** The host of the Redis server */
  REDIS_HOST = 'REDIS_HOST',
  /** The port of the Redis server */
  REDIS_PORT = 'REDIS_PORT',
  /** The username for authenticating with the Redis server (if any) */
  REDIS_USERNAME = 'REDIS_USERNAME',
  /** The password for authenticating with the Redis server (if any) */
  REDIS_PASSWORD = 'REDIS_PASSWORD',

  // MongoDB
  /** The URI for connecting to the MongoDB database */
  MONGODB_URI = 'MONGODB_URI',

  // JWT
  /** The secret key used for signing and verifying JWT tokens */
  JWT_SECRET = 'JWT_SECRET',
}
