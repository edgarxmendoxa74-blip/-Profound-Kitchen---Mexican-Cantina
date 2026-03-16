import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, ArrowLeft, GripVertical } from 'lucide-react';
import { useCategories, Category } from '../hooks/useCategories';

interface CategoryManagerProps {
  onBack: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onBack }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '☕',
    sort_order: 0,
    active: true
  });

  const handleAddCategory = () => {
    const nextSortOrder = Math.max(...categories.map(c => c.sort_order), 0) + 1;
    setFormData({
      id: '',
      name: '',
      icon: '☕',
      sort_order: nextSortOrder,
      active: true
    });
    setCurrentView('add');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon,
      sort_order: category.sort_order,
      active: category.active
    });
    setCurrentView('edit');
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete category');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.id || !formData.name || !formData.icon) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate ID format (kebab-case)
    const idRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!idRegex.test(formData.id)) {
      alert('Category ID must be in kebab-case format (e.g., "hot-drinks", "cold-beverages")');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setCurrentView('list');
      setEditingCategory(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingCategory(null);
  };

  const generateIdFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      id: currentView === 'add' ? generateIdFromName(name) : formData.id
    });
  };

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-brand-gray/20">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-violet/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-brand-violet hover:bg-brand-gray rounded-xl transition-all"
                  title="Return to Taxonomy"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-serif font-black text-brand-black uppercase tracking-tight">
                  {currentView === 'add' ? 'Initialize Category' : 'Modify Category'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-xl border border-brand-violet/10 text-[10px] font-sans font-black uppercase tracking-widest text-gray-500 hover:bg-white hover:shadow-sm transition-all"
                  title="Cancel changes"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-10 py-2.5 bg-brand-violet text-white rounded-xl shadow-lg shadow-brand-violet/20 hover:bg-brand-deep transition-all duration-300 flex items-center space-x-3 font-sans font-black text-[10px] uppercase tracking-widest"
                  title="Save category"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Synchronize</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] p-12 border border-brand-violet/5">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Category Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-sans font-bold"
                  placeholder="E.g. Vintage Apparel"
                  title="Category Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Access ID (System)</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-sans font-bold disabled:opacity-50"
                  placeholder="kebab-case-id"
                  disabled={currentView === 'edit'}
                  title="Category System ID"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Visual Icon</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="flex-1 px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300"
                      title="Category Icon"
                    />
                    <div className="w-14 h-14 bg-brand-gray rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-brand-violet/5">
                      {formData.icon}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Sequence Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-sans font-bold"
                    title="Sort Order"
                  />
                </div>
              </div>

              <div className="flex items-center px-1">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-brand-violet/20 text-brand-violet focus:ring-brand-violet/30 transition-all"
                  />
                  <span className="text-[10px] font-sans font-black uppercase tracking-widest text-brand-black group-hover:text-brand-violet transition-colors">Enabled in Collection</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-brand-gray/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-violet/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-brand-violet hover:bg-brand-gray rounded-xl transition-all"
                title="Return to Overview"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl md:text-2xl font-serif font-black text-brand-black uppercase tracking-tight">Taxonomy Control</h1>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center space-x-2 bg-brand-violet text-white px-6 py-2.5 rounded-xl shadow-lg shadow-brand-violet/20 hover:bg-brand-deep transition-all duration-300 font-sans font-black text-[10px] uppercase tracking-widest"
              title="Initialize new category"
            >
              <Plus className="h-4 w-4" />
              <span>Initialize Taxonomy</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] overflow-hidden border border-brand-violet/5">
          <div className="px-10 py-8 border-b border-brand-violet/5 flex items-center justify-between bg-white">
            <h3 className="text-xl font-serif font-black text-brand-black uppercase tracking-tight">Active Portfolio Taxonomy</h3>
            <div className="h-1 w-12 bg-brand-violet/20 rounded-full" />
          </div>

          <div className="p-10">
            {categories.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🗂️</div>
                <h3 className="text-xl font-serif font-black text-brand-black uppercase tracking-tight mb-2">Taxonomy Empty</h3>
                <p className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-widest mb-10">Initialize your first category to organize collection.</p>
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center space-x-3 bg-brand-violet text-white px-10 py-4 rounded-2xl shadow-xl shadow-brand-violet/20 hover:bg-brand-deep transition-all duration-500 font-sans font-black text-[10px] uppercase tracking-[0.2em]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Initialize Taxonomy</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-6 bg-brand-gray/20 rounded-[1.5rem] border border-transparent hover:border-brand-violet/20 hover:bg-white hover:shadow-xl hover:shadow-brand-violet/5 transition-all duration-500 group"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-brand-violet transition-colors cursor-move" />
                        <span className="text-[10px] font-sans font-black text-gray-400">#{category.sort_order}</span>
                      </div>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-brand-violet transition-all duration-500 group-hover:text-white">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-serif font-black text-brand-black group-hover:text-brand-violet transition-colors">{category.name}</h3>
                        <p className="text-[9px] font-sans font-black text-gray-400 uppercase tracking-[0.2em]">{category.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-sans font-black uppercase tracking-tighter ${category.active
                        ? 'bg-brand-violet text-white'
                        : 'bg-brand-gray text-gray-400 line-through'
                        }`}>
                        {category.active ? 'active' : 'inactive'}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-3 text-gray-300 hover:text-brand-violet hover:bg-white rounded-xl transition-all duration-300 shadow-sm"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;