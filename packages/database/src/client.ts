import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/client/client.js';

function getDatabaseConfig(urlStr?: string) {
  if (!urlStr) {
    return {
      host: 'localhost',
      port: 3306,
      allowPublicKeyRetrieval: true,
      connectionLimit: 10,
    };
  }

  try {
    const parsed = new URL(urlStr);
    return {
      host: parsed.hostname || 'localhost',
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: decodeURIComponent(parsed.username || 'root'),
      password: decodeURIComponent(parsed.password || ''),
      database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : undefined,
      allowPublicKeyRetrieval: true,
      connectionLimit: 10,
    };
  } catch {
    return {
      host: 'localhost',
      port: 3306,
      allowPublicKeyRetrieval: true,
      connectionLimit: 10,
    };
  }
}

const config = getDatabaseConfig(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb(config as any);

export const prisma = new PrismaClient({ adapter });

export * from './generated/client/client.js';