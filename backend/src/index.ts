import Fastify from 'fastify';
import corsPlugin from './plugins/cors';
import { authorRoutes } from './routes/authors';
import { bookRoutes } from './routes/books';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';

const app = Fastify({ logger: true });
app.register(corsPlugin);

// Set Referrer-Policy header for all responses
app.addHook('onSend', (request, reply, payload, done) => {
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  done();
});

app.register(authorRoutes, { prefix: '/authors' });
app.register(bookRoutes, { prefix: '/books' });

app.register(fastifyStatic, {
  root: path.join(__dirname, '../dist'),
  prefix: '/',
  decorateReply: false,
});

app.setNotFoundHandler((req, reply) => {
  if (
    req.raw.url &&
    !req.raw.url.startsWith('/api') &&
    !req.raw.url.startsWith('/books') &&
    !req.raw.url.startsWith('/authors') &&
    !req.raw.url.startsWith('/health')
  ) {
    return reply.type('text/html').send(
      fs.readFileSync(path.join(__dirname, '../dist/index.html'))
    );
  }
  reply.status(404).send({ error: 'Not found' });
});

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log("ENV CHECK:", process.env.DATABASE_URL ? "Loaded ✅" : "Missing ❌");
    console.log('Server running on http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();