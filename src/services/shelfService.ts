import api from './api';
import { Shelf, ShelfDTO } from './types';

export const shelfService = {
  async getMyShelves(): Promise<Shelf[]> {
    const response = await api.get<any>('/shelves');
    return response.data || [];
  },

  async addShelf(data: ShelfDTO): Promise<void> {
    await api.post('/shelves', data);
  },

  async updateShelf(id: number, data: ShelfDTO): Promise<void> {
    await api.put(`/shelves/${id}`, data);
  },

  async deleteShelf(id: number): Promise<void> {
    await api.delete(`/shelves/${id}`);
  },

  async addBookToShelf(shelfId: number, bookId: number): Promise<void> {
    await api.post(`/shelves/${shelfId}/books/${bookId}`);
  },

  async removeBookFromShelf(shelfId: number, bookId: number): Promise<void> {
    await api.delete(`/shelves/${shelfId}/books/${bookId}`);
  },
};
