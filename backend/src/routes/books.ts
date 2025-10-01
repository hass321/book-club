import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const bookSchema = z.object({
  title: z.string().min(1),
  authorId: z.number(),
  description: z.string().optional(),
  publishedYear: z.number().optional(),
});

export async function bookRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return prisma.book.findMany();
  });

  app.get('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return res.status(404).send({ error: 'Book not found' });
    return book;
  });

  app.post('/', async (req, res) => {
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const book = await prisma.book.create({ data: {
      title: parse.data.title,
      authorId: parse.data.authorId,
      description: parse.data.description,
      published_year: parse.data.publishedYear,
    }});
    return book;
  });

  app.put('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const book = await prisma.book.update({ where: { id }, data: {
      title: parse.data.title,
      authorId: parse.data.authorId,
      description: parse.data.description,
      published_year: parse.data.publishedYear,
    }});
    return book;
  });

  app.delete('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    await prisma.book.delete({ where: { id } });
    return { success: true };
  });
}
