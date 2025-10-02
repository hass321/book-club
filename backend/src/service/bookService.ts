
import { bookRepository } from '../repositories/bookRepository';

export const bookService = {
  findAll: (search?: string) => bookRepository.findAll(search),
  findById: (id: number) => bookRepository.findById(id),
  create: (data: { title: string; authorId: number; description?: string; published_year?: number }) => bookRepository.create(data),
  update: (id: number, data: { title: string; authorId: number; description?: string; published_year?: number }) => bookRepository.update(id, data),
  delete: (id: number) => bookRepository.delete(id),
};
