import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authorService } from '../service/authorService';

const authorSchema = z.object({
  name: z.string().min(1),
  bio: z.string().optional(),
});

export async function authorRoutes(app: FastifyInstance) {
  app.get('/', async (req) => {
    const search = (req.query as any).search?.toString().trim();
    return authorService.findAll(search);
  });

  app.get('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const author = await authorService.findById(id);
    if (!author) return res.status(404).send({ error: 'Author not found' });
    return author;
  });

  app.post('/', async (req, res) => {
    const parse = authorSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const author = await authorService.create(parse.data);
    return author;
  });

  app.put('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const parse = authorSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const author = await authorService.update(id, parse.data);
    return author;
  });

  app.delete('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    await authorService.delete(id);
    return { success: true };
  });
}
