import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const author1 = await prisma.author.create({
    data: { name: 'Jane Austen', bio: 'English novelist.' }
  });
  const author2 = await prisma.author.create({
    data: { name: 'George Orwell', bio: 'English novelist, essayist.' }
  });
  await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      authorId: author1.id,
      description: 'Classic novel of manners.',
      published_year: 1813
    }
  });
  await prisma.book.create({
    data: {
      title: '1984',
      authorId: author2.id,
      description: 'Dystopian social science fiction novel.',
      published_year: 1949
    }
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
