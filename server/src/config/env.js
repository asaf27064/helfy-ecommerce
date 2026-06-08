// All environment variable access goes through this module.
// Safe defaults are provided so the app runs inside docker compose
// without a .env file (Prime Directive: zero-touch runnability).

const env = {
  nodeEnv:      process.env.NODE_ENV      ?? 'development',
  port:         parseInt(process.env.SERVER_PORT ?? '3000', 10),

  db: {
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     parseInt(process.env.DB_PORT ?? '3306', 10),
    name:     process.env.DB_NAME     ?? 'helfy',
    user:     process.env.DB_USER     ?? 'helfy',
    password: process.env.DB_PASSWORD ?? 'helfypassword',
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev_jwt_secret_replace_in_production',
    expiry:  process.env.JWT_EXPIRY  ?? '7d',
  },

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10),
  corsOrigin:   process.env.CORS_ORIGIN ?? 'http://localhost:8080',
};

export default env;
