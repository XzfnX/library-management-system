import React, { useState } from 'react';
import { useShelves } from '../context/ShelfContext';
import { ShelfForm } from '../components/shelf/ShelfForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { Shelf } from '../types/shelf';

export const BookshelfPage = () => {
  const { defaultShelves, customShelves, deleteShelf } = useShelves();
  const [modalType, setModalType] = useState<'add' | 'edit' | 'confirm' | null>(null);
  const [currentShelf, setCurrentShelf] = useState<Shelf | null>(null);

  const handleAdd = () => {
    setCurrentShelf(null);
    setModalType('add');
  };

  const handleEdit = (shelf: Shelf) => {
    setCurrentShelf(shelf);
    setModalType('edit');
  };

  const handleDelete = (shelf: Shelf) => {
    setCurrentShelf(shelf);
    setModalType('confirm');
  };

  const handleConfirmDelete = () => {
    if (currentShelf) {
      deleteShelf(currentShelf.id);
    }
    setModalType(null);
  };

  const ShelfCard = ({ shelf, canEdit }: { shelf: Shelf; canEdit: boolean }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: shelf.color + '20' }}
          >
            <BookOpen size={24} style={{ color: shelf.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{shelf.name}</h3>
            {shelf.isDefault && (
              <span className="text-xs text-gray-500">默认书架</span>
            )}
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(shelf)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Edit2 size={18} className="text-gray-600" />
            </button>
            <button
              onClick={() => handleDelete(shelf)}
              className="p-2 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">书架管理</h1>
          <p className="text-gray-500">管理和组织你的图书收藏</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          <Plus size={20} />
          创建书架
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">默认书架</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultShelves.map(shelf => (
            <ShelfCard key={shelf.id} shelf={shelf} canEdit={false} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">自定义书架</h2>
        {customShelves.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customShelves.map(shelf => (
              <ShelfCard key={shelf.id} shelf={shelf} canEdit={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-4">还没有自定义书架</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              创建第一个书架
            </button>
          </div>
        )}
      </div>

      {modalType === 'add' && (
        <ShelfForm
          onSubmit={(data) => {
            const { addShelf } = useShelves();
            addShelf(data);
            setModalType(null);
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === 'edit' && currentShelf && (
        <ShelfForm
          shelf={currentShelf}
          onSubmit={(data) => {
            const { updateShelf } = useShelves();
            updateShelf(currentShelf.id, data);
            setModalType(null);
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === 'confirm' && currentShelf && (
        <ConfirmDialog
          title="删除书架"
          message={`确定要删除"${currentShelf.name}"吗？书架中的图书将移至"全部图书"。`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModalType(null)}
        />
      )}
    </div>
  );
};
