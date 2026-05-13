import React, { useState } from 'react';
import { useCategories } from '../context/CategoryContext';
import { CategoryForm } from '../components/category/CategoryForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Book } from 'lucide-react';
import { Category } from '../types/category';

export const CategoryPage = () => {
  const { systemCategories, customCategories, deleteCategory } = useCategories();
  const [modalType, setModalType] = useState<'add' | 'edit' | 'confirm' | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const handleAdd = () => {
    setCurrentCategory(null);
    setModalType('add');
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setModalType('edit');
  };

  const handleDelete = (category: Category) => {
    setCurrentCategory(category);
    setModalType('confirm');
  };

  const handleConfirmDelete = () => {
    if (currentCategory) {
      deleteCategory(currentCategory.id);
    }
    setModalType(null);
  };

  const CategoryRow = ({ category, canEdit }: { category: Category; canEdit: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Book size={20} className="text-blue-600" />
        </div>
        <div>
          <span className="font-medium text-gray-800">{category.name}</span>
          {category.isSystem && (
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
              系统分类
            </span>
          )}
        </div>
      </div>
      {canEdit && (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(category)}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <Edit2 size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleDelete(category)}
            className="p-2 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">分类管理</h1>
          <p className="text-gray-500">管理和组织你的图书分类</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          <Plus size={20} />
          添加分类
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">系统分类</h2>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {systemCategories.map(category => (
              <CategoryRow key={category.id} category={category} canEdit={false} />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">自定义分类</h2>
        {customCategories.length > 0 ? (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customCategories.map(category => (
                <CategoryRow key={category.id} category={category} canEdit={true} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <Book className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-4">还没有自定义分类</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              创建第一个分类
            </button>
          </div>
        )}
      </div>

      {modalType === 'add' && (
        <CategoryForm
          onSubmit={(data) => {
            const { addCategory } = useCategories();
            addCategory(data);
            setModalType(null);
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === 'edit' && currentCategory && (
        <CategoryForm
          category={currentCategory}
          onSubmit={(data) => {
            const { updateCategory } = useCategories();
            updateCategory(currentCategory.id, data);
            setModalType(null);
          }}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === 'confirm' && currentCategory && (
        <ConfirmDialog
          title="删除分类"
          message={`确定要删除"${currentCategory.name}"吗？该分类下的图书将移至"其他"分类。`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setModalType(null)}
        />
      )}
    </div>
  );
};
