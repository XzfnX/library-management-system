import { Book, BookStatus } from '../../types/book';
import { X, Star, Calendar, Building, Hash, BookOpen } from 'lucide-react';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export const BookDetail = ({ book, onClose }: BookDetailProps) => {
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
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-blue-600 to-indigo-600">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-8xl font-bold opacity-30">{book.title.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              {book.category && (
                <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                  {book.category}
                </span>
              )}
              {book.status && (
                <span className={`px-3 py-1 ${statusColors[book.status]} text-sm font-semibold rounded-full`}>
                  {statusLabels[book.status]}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{book.title}</h2>
            <p className="text-white/90 text-lg">作者：{book.author}</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 20rem)' }}>
          {book.rating && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">我的评分</h3>
              {renderStars(book.rating)}
            </div>
          )}

          {book.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                <BookOpen size={16} />
                简介
              </h3>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {book.isbn && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Hash size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">ISBN</p>
                  <p className="font-medium text-gray-800">{book.isbn}</p>
                </div>
              </div>
            )}

            {book.publisher && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Building size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">出版社</p>
                  <p className="font-medium text-gray-800">{book.publisher}</p>
                </div>
              </div>
            )}

            {book.publishDate && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">出版日期</p>
                  <p className="font-medium text-gray-800">{book.publishDate}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
