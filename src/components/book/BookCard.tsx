import { Book, BookStatus } from '../../types/book';
import { Edit2, Trash2, Eye, Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onView: (book: Book) => void;
}

export const BookCard = ({ book, onEdit, onDelete, onView }: BookCardProps) => {
  const statusLabels: Record<BookStatus, string> = {
    available: '可借阅',
    borrowed: '已借出',
    reserved: '已预约',
    damaged: '已损坏',
    lost: '已丢失'
  };

  const statusColors: Record<BookStatus, string> = {
    available: 'bg-green-100 text-green-700',
    borrowed: 'bg-blue-100 text-blue-700',
    reserved: 'bg-yellow-100 text-yellow-700',
    damaged: 'bg-orange-100 text-orange-700',
    lost: 'bg-red-100 text-red-700'
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
            <span className="text-white text-5xl font-bold opacity-50">
              {book.title.charAt(0)}
            </span>
          </div>
        )}
        {book.status && (
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[book.status]}`}>
            {statusLabels[book.status]}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 line-clamp-2 mb-1 text-lg">
          {book.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3">{book.author}</p>

        {book.category && (
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-3">
            {book.category}
          </span>
        )}

        {book.rating && (
          <div className="mb-3">
            {renderStars(book.rating)}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(book)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            <Eye size={16} />
            详情
          </button>
          <button
            onClick={() => onEdit(book)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Edit2 size={16} />
            编辑
          </button>
          <button
            onClick={() => onDelete(book)}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            <Trash2 size={16} />
            删除
          </button>
        </div>
      </div>
    </div>
  );
};
