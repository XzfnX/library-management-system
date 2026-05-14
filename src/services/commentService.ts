import api from './api';
import { Comment, CommentDTO, PageResult } from './types';

export const commentService = {
  async getBookComments(
    bookId: number,
    params?: { page?: number; size?: number }
  ): Promise<PageResult<Comment>> {
    const response = await api.get<any>(`/comments/book/${bookId}`, { params });
    return {
      total: response.data.total,
      records: response.data.records,
      current: response.data.current,
      size: response.data.size,
    };
  },

  async addComment(data: CommentDTO): Promise<void> {
    await api.post('/comments', data);
  },

  async deleteComment(id: number): Promise<void> {
    await api.delete(`/comments/${id}`);
  },
};
