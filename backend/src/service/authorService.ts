
import { authorRepository } from '../repositories/authorRepository';

export const authorService = {
  findAll: (search?: string) => authorRepository.findAll(search),
  findById: (id: number) => authorRepository.findById(id),
  create: (data: { name: string; bio?: string }) => authorRepository.create(data),
  update: (id: number, data: { name: string; bio?: string }) => authorRepository.update(id, data),
  delete: (id: number) => authorRepository.delete(id),
};
