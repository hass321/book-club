import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const bookRepository = {
  findAll: (search?: string) => {
    if (search) {
      return prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: { created_at: 'desc' },
      });
    }
    return prisma.book.findMany({ orderBy: { created_at: 'desc' } });
  },
  findById: (id: number) => prisma.book.findUnique({ where: { id } }),
  create: (data: { title: string; authorId: number; description?: string; published_year?: number }) =>
    prisma.book.create({ data }),
  update: (id: number, data: { title: string; authorId: number; description?: string; published_year?: number }) =>
    prisma.book.update({ where: { id }, data }),
  delete: (id: number) => prisma.book.delete({ where: { id } }),
};
