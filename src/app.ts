import 'reflect-metadata';
import { Server } from './presentation/server';
import { AppRoutes } from './presentation/routes';
import { envs } from './config/env';
import { PostgresDatabase } from './data/postgres/postgres-database';

async function main() {
  const postgres = new PostgresDatabase({
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    host: envs.DB_HOST,
    database: envs.DB_DATABASE,
    port: envs.DB_PORT,
  });

  await postgres.connect();

  const server = new Server({
    port: 3251,
    routes: AppRoutes.routes,
  });

  await server.start();
}

main();
