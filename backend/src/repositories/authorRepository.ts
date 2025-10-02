import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authorRepository = {
  findAll: (search?: string) => {
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
  },
  findById: (id: number) => prisma.author.findUnique({ where: { id } }),
  create: (data: { name: string; bio?: string }) => prisma.author.create({ data }),
  update: (id: number, data: { name: string; bio?: string }) => prisma.author.update({ where: { id }, data }),
  delete: (id: number) => prisma.author.delete({ where: { id } }),
};
