import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const authorSchema = z.object({
  name: z.string().min(1),
  bio: z.string().optional(),
});

export async function authorRoutes(app: FastifyInstance) {
  app.get('/', async (req) => {
    const search = (req.query as any).search?.toString().trim();
    if (search) {
      return prisma.author.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: { created_at: 'desc' },
      });
    }
    return prisma.author.findMany({ orderBy: { created_at: 'desc' } });
  });

  app.get('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) return res.status(404).send({ error: 'Author not found' });
    return author;
  });

  app.post('/', async (req, res) => {
    const parse = authorSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const author = await prisma.author.create({ data: parse.data });
    return author;
  });

  app.put('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    const parse = authorSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).send({ error: parse.error.errors });
    const author = await prisma.author.update({ where: { id }, data: parse.data });
    return author;
  });

  app.delete('/:id', async (req, res) => {
    const id = Number((req.params as any).id);
    await prisma.author.delete({ where: { id } });
    return { success: true };
  });
}
