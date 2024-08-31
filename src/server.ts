import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';
import StaticFiles from '@fastify/static'
import path from 'node:path'

const app = Fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  reply.code(400).send({ error: error.message });
});

const start = async () => {

    app.register(StaticFiles, {
      root: path.join(__dirname, '..', 'images'),
      prefix: '/images/'
    })
    await app.register(routes);
  try {
    app.register(cors);
    await app.listen({port: 3000, host: '0.0.0.0'});
  } catch (err) {
    process.exit(1);
  }
};

start();    