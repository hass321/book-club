import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { bookService } from '../service/bookService';

const bookSchema = z.object({
  title: z.string().min(1),
  authorId: z.number(),
  description: z.string().optional(),
  publishedYear: z.number().optional(),
});

export async function bookRoutes(app: FastifyInstance) {
  app.get('/', async (req) => {
    const search = (req.query as any).search?.toString().trim();
    return bookService.findAll(search);
  });

  app.get('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const book = await bookService.findById(id);
    if (!book) return res.status(404).send({ error: 'Book not found' });
    return book;
  });

  app.post('/', async (req, res) => {
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const book = await bookService.create({
      title: parse.data.title,
      authorId: parse.data.authorId,
      description: parse.data.description,
      published_year: parse.data.publishedYear,
    });
    return book;
  });

  app.put('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const book = await bookService.update(id, {
      title: parse.data.title,
      authorId: parse.data.authorId,
      description: parse.data.description,
      published_year: parse.data.publishedYear,
    });
    return book;
  });

  app.delete('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    await bookService.delete(id);
    return { success: true };
  });
}
