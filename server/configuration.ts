export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: 3000,
  database_url: process.env.DATABASE_URL
});