import 'dotenv/config';
import { PrismaClient } from './generated/client/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({ adapter });

export * from './generated/client/client.js';