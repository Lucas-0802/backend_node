import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';

const app = Fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  reply.code(400).send({ error: error.message });
});

const start = async () => {

    await app.register(routes);
  try {
    app.register(cors);
    await app.listen({port: 3000, host: '0.0.0.0'});
  } catch (err) {
    process.exit(1);
  }
};

start();    