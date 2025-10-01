import Fastify from 'fastify';
import { authorRoutes } from './routes/authors';
import { bookRoutes } from './routes/books';

const app = Fastify({ logger: true });

app.register(authorRoutes, { prefix: '/authors' });
app.register(bookRoutes, { prefix: '/books' });

app.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();