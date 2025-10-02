import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();

  const author1 = await prisma.author.create({
    data: { name: 'Colson Whitehead', bio: 'American novelist, Pulitzer Prize winner.' }
  });
  const author2 = await prisma.author.create({
    data: { name: 'Suzanne Collins', bio: 'American television writer and author.' }
  });
  const author3 = await prisma.author.create({
    data: { name: 'Jhumpa Lahiri', bio: 'Indian-American author and Pulitzer Prize winner.' }
  });

  await prisma.book.create({
    data: {
      title: 'The Underground Railroad',
      authorId: author1.id,
      description: 'Pulitzer Prize-winning novel about a slave’s escape from a Georgia plantation.',
      published_year: 2016
    }
  });
  await prisma.book.create({
    data: {
      title: 'The Ballad of Songbirds and Snakes',
      authorId: author2.id,
      description: 'Prequel to The Hunger Games trilogy.',
      published_year: 2020
    }
  });
  await prisma.book.create({
    data: {
      title: 'Interpreter of Maladies',
      authorId: author3.id,
      description: 'Pulitzer Prize-winning collection of short stories.',
      published_year: 2000
    }
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
