import 'dotenv/config';

const port = Number(
  process.env.PORT ?? 4001,
);

if (!Number.isInteger(port)) {
  throw new Error(
    'Invalid PORT configuration',
  );
}


const jwtAccessSecret =
  process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret) {
  throw new Error(
    'JWT_ACCESS_SECRET is not configured',
  );
}


export const env = {
  port,
  jwtAccessSecret,
  nodeEnv:
    process.env.NODE_ENV ??
    'development',
  webOrigin:
    process.env.WEB_ORIGIN ??
    'http://localhost:5173',
};