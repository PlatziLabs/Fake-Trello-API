import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecretKey: process.env.TOKEN_SECRET_KEY,
  env: process.env.NODE_ENV || 'dev',
}));
