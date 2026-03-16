import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Coffee, TrendingUp, Package, Lock, FolderOpen, CreditCard, Settings, Tag } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';
import { addOnCategories } from '../data/menuData';
import { useMenu } from '../hooks/useMenu';
import { useCategories } from '../hooks/useCategories';
import ImageUpload from './ImageUpload';
import CategoryManager from './CategoryManager';
import PaymentMethodManager from './PaymentMethodManager';
import SiteSettingsManager from './SiteSettingsManager';
import CouponManager from './CouponManager';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('brand_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const { menuItems, loading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { categories } = useCategories();
  const [currentView, setCurrentView] = useState<'dashboard' | 'items' | 'add' | 'edit' | 'categories' | 'payments' | 'settings' | 'coupons'>('dashboard');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    basePrice: 0,
    category: 'hot-coffee',
    popular: false,
    available: true,
    variations: [],
    addOns: [],
    images: []
  });

  const handleAddItem = () => {
    setCurrentView('add');
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      category: categories[0]?.id || 'premium-tees',
      popular: false,
      available: true,
      variations: [],
      addOns: [],
      images: [],
      stock: 0,
      weight: 0.5
    });
  };

  const handleEditItem = (item: MenuItem) => {
    console.log('[AdminDashboard] handleEditItem called, item id:', item.id, 'name:', item.name);
    setEditingItem(item);
    setFormData(item);
    setCurrentView('edit');
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        setIsProcessing(true);
        await deleteMenuItem(id);
      } catch (error) {
        alert('Failed to delete item. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveItem = async () => {
    console.log('[AdminDashboard] handleSaveItem called');
    console.log('[AdminDashboard] editingItem:', editingItem ? editingItem.id : 'null (adding new)');
    console.log('[AdminDashboard] formData:', JSON.stringify({
      name: formData.name,
      description: formData.description?.substring(0, 50),
      basePrice: formData.basePrice,
      category: formData.category,
      variationsCount: formData.variations?.length,
      addOnsCount: formData.addOns?.length,
    }));

    // Validation
    if (!formData.name || !formData.description || !formData.basePrice) {
      alert('❌ Please fill in all required fields:\n- Item Name\n- Description\n- Base Price');
      return;
    }

    if (formData.basePrice <= 0) {
      alert('❌ Base price must be greater than 0');
      return;
    }

    // Validate discount pricing if enabled
    if (formData.discountActive) {
      if (!formData.discountPrice || formData.discountPrice <= 0) {
        alert('❌ Please enter a valid discount price when discount is enabled');
        return;
      }
      if (formData.discountPrice >= formData.basePrice) {
        alert('❌ Discount price must be less than base price');
        return;
      }
    }

    try {
      setIsProcessing(true);

      if (editingItem) {
        console.log('[AdminDashboard] Calling updateMenuItem with id:', editingItem.id);
        await updateMenuItem(editingItem.id, formData);
        alert(`✅ Successfully updated "${formData.name}"!`);
      } else {
        console.log('[AdminDashboard] Calling addMenuItem');
        await addMenuItem(formData as Omit<MenuItem, 'id'>);
        alert(`✅ Successfully added "${formData.name}" to the menu!`);
      }

      // Reset form and navigate back
      setCurrentView('items');
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        basePrice: 0,
        category: 'premium-tees',
        popular: false,
        available: true,
        variations: [],
        addOns: [],
        images: [],
        stock: 0,
        weight: 0.5
      });
    } catch (error) {
      console.error('[AdminDashboard] Save error:', error);
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
      alert(`❌ Failed to save item.\n\nError: ${errorMsg}\n\nPlease check the browser console (F12) for full details.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCurrentView(currentView === 'add' || currentView === 'edit' ? 'items' : 'dashboard');
    setEditingItem(null);
    setSelectedItems([]);
  };

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) {
      alert('Please select items to delete');
      return;
    }

    const itemNames = selectedItems.map(id => {
      const item = menuItems.find(i => i.id === id);
      return item ? item.name : 'Unknown Item';
    }).slice(0, 5); // Show first 5 items

    const displayNames = itemNames.join(', ');
    const moreItems = selectedItems.length > 5 ? ` and ${selectedItems.length - 5} more items` : '';

    if (confirm(`Are you sure you want to delete ${selectedItems.length} item(s)?\n\nItems to delete: ${displayNames}${moreItems}\n\nThis action cannot be undone.`)) {
      try {
        setIsProcessing(true);
        // Delete items one by one
        for (const itemId of selectedItems) {
          await deleteMenuItem(itemId);
        }
        setSelectedItems([]);
        setShowBulkActions(false);
        alert(`Successfully deleted ${selectedItems.length} item(s).`);
      } catch (error) {
        alert('Failed to delete some items. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  const handleBulkCategoryChange = async (newCategoryId: string) => {
    if (selectedItems.length === 0) {
      alert('Please select items to update');
      return;
    }

    const categoryName = categories.find(cat => cat.id === newCategoryId)?.name;
    if (confirm(`Are you sure you want to change the category of ${selectedItems.length} item(s) to "${categoryName}"?`)) {
      try {
        setIsProcessing(true);
        // Update category for each selected item
        for (const itemId of selectedItems) {
          const item = menuItems.find(i => i.id === itemId);
          if (item) {
            await updateMenuItem(itemId, { ...item, category: newCategoryId });
          }
        }
        setSelectedItems([]);
        setShowBulkActions(false);
        alert(`Successfully updated category for ${selectedItems.length} item(s)`);
      } catch (error) {
        alert('Failed to update some items');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === menuItems.length) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      setSelectedItems(menuItems.map(item => item.id));
      setShowBulkActions(true);
    }
  };

  // Update bulk actions visibility when selection changes
  React.useEffect(() => {
    setShowBulkActions(selectedItems.length > 0);
  }, [selectedItems]);

  const addVariation = () => {
    const newVariation: Variation = {
      id: `var-${Date.now()} `,
      name: '',
      price: 0
    };
    setFormData({
      ...formData,
      variations: [...(formData.variations || []), newVariation]
    });
  };

  const updateVariation = (index: number, field: keyof Variation, value: string | number) => {
    const updatedVariations = [...(formData.variations || [])];
    updatedVariations[index] = { ...updatedVariations[index], [field]: value };
    setFormData({ ...formData, variations: updatedVariations });
  };

  const removeVariation = (index: number) => {
    const updatedVariations = formData.variations?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, variations: updatedVariations });
  };

  const addAddOn = () => {
    const newAddOn: AddOn = {
      id: `addon - ${Date.now()} `,
      name: '',
      price: 0,
      category: 'extras'
    };
    setFormData({
      ...formData,
      addOns: [...(formData.addOns || []), newAddOn]
    });
  };

  const updateAddOn = (index: number, field: keyof AddOn, value: string | number) => {
    const updatedAddOns = [...(formData.addOns || [])];
    updatedAddOns[index] = { ...updatedAddOns[index], [field]: value };
    setFormData({ ...formData, addOns: updatedAddOns });
  };

  const removeAddOn = (index: number) => {
    const updatedAddOns = formData.addOns?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, addOns: updatedAddOns });
  };

  // Dashboard Stats
  const totalItems = menuItems.length;
  const popularItems = menuItems.filter(item => item.popular).length;
  const availableItems = menuItems.filter(item => item.available).length;
  const categoryCounts = categories.map(cat => ({
    ...cat,
    count: menuItems.filter(item => item.category === cat.id).length
  }));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Profound@Admin!2026') {
      setIsAuthenticated(true);
      localStorage.setItem('brand_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('brand_admin_auth');
    setPassword('');
    setPassword('');
    setCurrentView('dashboard');
  };

  // navItems removed as it was unused

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(127,0,255,0.15)] p-10 w-full max-w-md border border-brand-violet/5">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 bg-brand-violet rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-brand-violet/30 rotate-3 transform transition-transform hover:rotate-0 duration-500">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-black text-brand-black uppercase tracking-tight mb-3">Admin Access</h1>
            <p className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-[0.2em]">Secure Brand Management Terminal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-sans font-black uppercase tracking-widest text-brand-black mb-2 px-1">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-brand-gray/50 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-sans font-bold"
                placeholder="••••••••••••"
                required
              />
              {loginError && (
                <p className="text-red-500 text-[10px] font-sans font-bold uppercase tracking-wider mt-2 px-1 flex items-center">
                  <X className="w-3 h-3 mr-1" /> {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-violet text-white py-5 rounded-2xl hover:bg-brand-deep transition-all duration-500 font-sans font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-brand-violet/25 active:scale-[0.98] border border-white/10"
            >
              Initialize Terminal
            </button>
          </form>

          <p className="text-center mt-10 text-[9px] font-sans font-medium text-gray-300 uppercase tracking-widest">
            Protected by Advanced Cryptography
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
                  title="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-serif font-black text-brand-black uppercase tracking-tight">
                  {currentView === 'add' ? 'Initialize Item' : 'Modify Item'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl border border-brand-violet/10 text-[10px] font-sans font-black uppercase tracking-widest text-gray-500 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={isProcessing}
                  className="px-10 py-2.5 bg-brand-violet text-white rounded-xl shadow-lg shadow-brand-violet/20 hover:bg-brand-deep transition-all duration-300 flex items-center space-x-3 font-sans font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/30 border-t-white"></div>
                      <span>Persisting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Synchronize</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {isProcessing && (
            <div className="bg-brand-violet/5 border-l-4 border-brand-violet rounded-2xl p-6 mb-12 flex items-center space-x-5 shadow-sm animate-pulse">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-violet border-t-transparent"></div>
              <div>
                <p className="font-sans font-black text-[10px] text-brand-violet uppercase tracking-widest">Persisting Portfolio Changes</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Synchronizing with central brand database.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] p-12 border border-brand-violet/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-2">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Item Title</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-sans font-bold"
                  placeholder="E.g. Vintage Oversized Tee"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Primary Valuation</label>
                <input
                  type="number"
                  value={formData.basePrice || ''}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) || 0 })}
                  className="w-full px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-serif font-black text-xl"
                  placeholder="₱ 0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-sans font-black uppercase tracking-widest text-gray-400 px-1">Portfolio Category</label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-4 bg-brand-gray/30 border border-transparent rounded-2xl focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet focus:bg-white transition-all duration-300 font-sans font-bold appearance-none"
                  title="Select product category"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Discount Pricing Section */}
            <div className="mb-8">
              <h3 className="text-lg font-black text-black mb-4 uppercase tracking-tighter font-montserrat">Discount Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Discount Price</label>
                  <input
                    type="number"
                    value={formData.discountPrice || ''}
                    onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter discount price"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.discountActive || false}
                      onChange={(e) => setFormData({ ...formData, discountActive: e.target.checked })}
                      className="rounded-sm border-brand-silver text-brand-lavender focus:ring-brand-lavender"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest font-montserrat text-brand-black">Enable Discount</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Discount Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.discountStartDate || ''}
                    onChange={(e) => setFormData({ ...formData, discountStartDate: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    title="Discount start date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Discount End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.discountEndDate || ''}
                    onChange={(e) => setFormData({ ...formData, discountEndDate: e.target.value || undefined })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    title="Discount end date"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Leave dates empty for indefinite discount period. Discount will only be active if "Enable Discount" is checked and current time is within the date range.
              </p>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-black mb-2">Description *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-brand-gray/20 text-xs font-bold"
                placeholder="Enter item description"
                rows={3}
              />
            </div>

            <div className="mb-8 p-6 border border-brand-silver rounded-sm bg-brand-gray/10">
              <ImageUpload
                currentImage={formData.image}
                onImageChange={(imageUrl) => {
                  setFormData({
                    ...formData,
                    image: imageUrl || undefined
                  });
                }}
                label="Main Product Image"
              />
            </div>

            {/* Variations Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-black text-brand-black uppercase tracking-widest font-montserrat text-brand-black">Product Variations</h3>
                <button
                  onClick={addVariation}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-black text-white rounded-sm hover:bg-brand-lavender hover:text-black transition-all duration-500 font-black text-[10px] uppercase tracking-widest font-montserrat border border-transparent hover:border-brand-lavender/30"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Variation</span>
                </button>
              </div>

              {formData.variations?.map((variation, index) => (
                <div key={variation.id} className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={variation.name}
                          onChange={(e) => updateVariation(index, 'name', e.target.value)}
                          className="flex-1 px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-bold uppercase tracking-wider"
                          placeholder="Variation name (e.g., Small, Medium, Large)"
                        />
                        <input
                          type="number"
                          value={variation.price}
                          onChange={(e) => updateVariation(index, 'price', Number(e.target.value) || 0)}
                          className="w-32 px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-black font-montserrat"
                          placeholder="Price"
                        />
                        <button
                          onClick={() => removeVariation(index)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Remove variation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full md:w-64">
                      <ImageUpload
                        currentImage={variation.image}
                        onImageChange={(imageUrl) => updateVariation(index, 'image', imageUrl || '')}
                        label="Variation Image"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add-ons Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-black text-brand-black uppercase tracking-widest font-montserrat">Add-ons</h3>
                <button
                  onClick={addAddOn}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-brand-black rounded-sm hover:bg-brand-gray transition-all duration-500 font-black text-[10px] uppercase tracking-widest font-montserrat border border-brand-silver"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Add-on</span>
                </button>
              </div>

              {formData.addOns?.map((addOn, index) => (
                <div key={addOn.id} className="flex items-center space-x-3 mb-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={addOn.name}
                    onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-bold uppercase tracking-wider"
                    placeholder="Add-on name"
                  />
                  <select
                    value={addOn.category}
                    onChange={(e) => updateAddOn(index, 'category', e.target.value)}
                    className="px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-bold uppercase tracking-wider"
                    title="Add-on category"
                  >
                    {addOnCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={addOn.price}
                    onChange={(e) => updateAddOn(index, 'price', Number(e.target.value))}
                    className="w-24 px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-black font-montserrat"
                    placeholder="Price"
                  />
                  <button
                    onClick={() => removeAddOn(index)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                    title="Remove add-on"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Items List View
  if (currentView === 'items') {
    return (
      <div className="min-h-screen bg-brand-gray/20">
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-violet/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 text-gray-400 hover:text-brand-violet hover:bg-brand-gray rounded-xl transition-all"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-serif font-black text-brand-black uppercase tracking-tight">Product Portfolio</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddItem}
                  className="flex items-center space-x-2 bg-brand-violet text-white px-6 py-2.5 rounded-xl shadow-lg shadow-brand-violet/20 hover:bg-brand-deep transition-all duration-300 font-sans font-black text-[10px] uppercase tracking-widest"
                >
                  <Plus className="h-4 w-4" />
                  <span>Initialize Item</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Bulk Actions Panel */}
          {showBulkActions && selectedItems.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-black mb-1">Bulk Actions</h3>
                  <p className="text-sm text-gray-600">{selectedItems.length} item(s) selected</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Change Category */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Change Category:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkCategoryChange(e.target.value);
                          e.target.value = ''; // Reset selection
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isProcessing}
                      title="Change category for selected items"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Items */}
                  <button
                    onClick={handleBulkRemove}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isProcessing ? 'Removing...' : 'Remove Selected'}</span>
                  </button>

                  {/* Clear Selection */}
                  <button
                    onClick={() => {
                      setSelectedItems([]);
                      setShowBulkActions(false);
                    }}
                    className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear Selection</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Bulk Actions Bar */}
            {menuItems.length > 0 && (
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === menuItems.length && menuItems.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-chick-orange focus:ring-chick-golden"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest font-montserrat text-brand-black">
                        Select All ({menuItems.length} products)
                      </span>
                    </label>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedItems.length} item(s) selected
                      </span>
                      <button
                        onClick={() => setSelectedItems([])}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        Clear Selection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Select
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Weight</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Variations</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Add-ons</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          title={`Select ${item.name}`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {categories.find(cat => cat.id === item.category)?.name}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          {item.isOnDiscount && item.discountPrice ? (
                            <>
                              <span className="text-red-600 font-semibold">₱{item.discountPrice}</span>
                              <span className="text-gray-500 line-through text-xs">₱{item.basePrice}</span>
                            </>
                          ) : (
                            <span>₱{item.basePrice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.weight || 0.5}kg
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.variations?.length || 0} variations
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.addOns?.length || 0} add-ons
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {item.popular && (
                            <span className="inline-flex items-center px-3 py-1 rounded-sm text-[8px] font-black bg-brand-lavender text-black shadow-lg uppercase tracking-wider font-montserrat">
                              💎 Premium
                            </span>
                          )}
                          <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium ${item.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            } `}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            disabled={isProcessing}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={isProcessing}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {menuItems.map((item) => (
                <div key={item.id} className={`p-4 border-b border-gray-200 last:border-b-0 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-gray-300 text-chick-orange focus:ring-chick-golden"
                        title={`Select ${item.name}`}
                      />
                      <span className="text-sm text-gray-600">Select</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        disabled={isProcessing}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                        title="Edit product"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isProcessing}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 text-gray-900">
                        {categories.find(cat => cat.id === item.category)?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {item.isOnDiscount && item.discountPrice ? (
                          <span className="text-red-600">₱{item.discountPrice}</span>
                        ) : (
                          `₱${item.basePrice} `
                        )}
                        {item.isOnDiscount && item.discountPrice && (
                          <span className="text-gray-500 line-through text-xs ml-1">₱{item.basePrice}</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Variations:</span>
                      <span className="ml-1 text-gray-900">{item.variations?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Add-ons:</span>
                      <span className="ml-1 text-gray-900">{item.addOns?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {item.popular && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-chick-gradient text-white shadow-md">
                          ⭐ Popular
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Categories View
  if (currentView === 'categories') {
    return <CategoryManager onBack={() => setCurrentView('dashboard')} />;
  }

  // Payment Methods View
  if (currentView === 'payments') {
    return <PaymentMethodManager onBack={() => setCurrentView('dashboard')} />;
  }


  // Coupons View
  if (currentView === 'coupons') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <h1 className="text-2xl font-black text-black uppercase tracking-tighter font-montserrat">Coupon Management</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <CouponManager />
        </div>
      </div>
    );
  }

  // Site Settings View
  if (currentView === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <h1 className="text-2xl font-black text-black uppercase tracking-tighter font-montserrat">Site Settings</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <SiteSettingsManager />
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-brand-gray/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-violet/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-brand-violet rounded-xl flex items-center justify-center shadow-lg shadow-brand-violet/20">
                <span className="text-white text-xl">💎</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-black text-brand-black uppercase tracking-tight">Management</h1>

              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="/"
                className="text-[10px] font-sans font-black text-gray-500 hover:text-brand-violet transition-colors uppercase tracking-widest hidden sm:block"
              >
                Launch Store
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-brand-gray text-brand-black px-4 py-2.5 rounded-xl text-[10px] font-sans font-black uppercase tracking-widest hover:bg-brand-violet hover:text-white transition-all duration-300 shadow-sm"
              >
                <span>Terminate Access</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
          {[
            { label: 'Total Products', value: totalItems, icon: '📦', color: 'bg-white' },
            { label: 'Active Items', value: availableItems, icon: '✨', color: 'bg-white' },
            { label: 'Featured', value: popularItems, icon: '💎', color: 'bg-white' },
            { label: 'Terminal', value: 'Online', icon: '📡', color: 'bg-white' }
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-[2rem] p-6 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-brand-violet/5 hover:border-brand-violet/20 transition-all duration-500 group`}>
              <div className="flex flex-col items-center text-center space-y-3">
                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">{stat.icon}</span>
                <div className="space-y-1">
                  <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-serif font-black text-brand-black">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] border border-brand-violet/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-black text-brand-black uppercase tracking-tight">Quick Terminal Actions</h3>
              <div className="h-1 w-12 bg-brand-violet/20 rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: 'add', label: 'Add Item', icon: <Plus className="w-5 h-5" />, action: handleAddItem, primary: true },
                { id: 'items', label: 'Products', icon: <Package className="w-5 h-5" />, action: () => setCurrentView('items') },
                { id: 'categories', label: 'Categories', icon: <FolderOpen className="w-5 h-5" />, action: () => setCurrentView('categories') },
                { id: 'coupons', label: 'Coupons', icon: <Tag className="w-5 h-5" />, action: () => setCurrentView('coupons') },
                { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, action: () => setCurrentView('payments') },
                { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, action: () => setCurrentView('settings') },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`group flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-500 border ${item.primary
                    ? 'bg-brand-violet text-white border-transparent shadow-lg shadow-brand-violet/20 hover:bg-brand-deep'
                    : 'bg-brand-gray/30 text-brand-black border-transparent hover:bg-white hover:border-brand-violet/20 hover:shadow-xl hover:shadow-brand-violet/5'
                    } active:scale-95`}
                >
                  <div className={`mb-3 transition-transform duration-500 group-hover:scale-110 ${item.primary ? 'text-white' : 'text-brand-violet'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-sans font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-black rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-serif font-black text-white uppercase tracking-tight mb-8">Live Insights</h3>
              <div className="space-y-6">
                {categoryCounts.slice(0, 4).map((category) => (
                  <div key={category.id} className="flex items-center justify-between group/item">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover/item:bg-brand-violet transition-colors">
                        {category.icon}
                      </div>
                      <span className="text-xs font-sans font-bold text-gray-400 group-hover/item:text-white transition-colors">{category.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-serif font-black text-white">{category.count}</span>
                      <div className="w-8 h-0.5 bg-brand-violet/30 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentView('categories')}
                className="mt-10 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-sans font-black text-white uppercase tracking-widest hover:bg-brand-violet hover:border-transparent transition-all duration-500"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Product Portfolio Preview */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)] overflow-hidden border border-brand-violet/5">
          <div className="px-10 py-8 border-b border-brand-violet/5 flex items-center justify-between bg-white">
            <h3 className="text-xl font-serif font-black text-brand-black uppercase tracking-tight">Active Portfolio</h3>
            <button
              onClick={() => setCurrentView('items')}
              className="group flex items-center space-x-2 text-[10px] font-sans font-black text-brand-violet uppercase tracking-widest hover:text-brand-deep transition-colors"
            >
              <span>Explore Collection</span>
              <TrendingUp className="w-3 h-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="divide-y divide-brand-violet/5">
            {menuItems.slice(0, 10).map((item) => {
              const itemCategory = categories.find(cat => cat.id === item.category);
              return (
                <div key={item.id} className="px-10 py-6 hover:bg-brand-gray/20 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-5">
                        <div className="w-12 h-12 bg-brand-gray rounded-2xl flex items-center justify-center text-xl group-hover:bg-white transition-colors shadow-sm">
                          {itemCategory?.icon || '🍽️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-serif font-black text-brand-black group-hover:text-brand-violet transition-colors">{item.name}</h4>
                            {item.popular && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-sans font-black bg-brand-violet text-white uppercase tracking-tighter">
                                featured
                              </span>
                            )}
                            {!item.available && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] font-sans font-black bg-brand-gray text-gray-400 uppercase tracking-tighter line-through">
                                inactive
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-sans font-medium text-gray-400 truncate max-w-md">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-8 flex items-center space-x-10">
                      <div className="text-right">
                        {item.isOnDiscount && item.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-serif font-black text-brand-violet">₱{item.discountPrice}</span>
                            <span className="text-[10px] text-gray-300 line-through">₱{item.basePrice}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-serif font-black text-brand-black">₱{item.basePrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-3 text-gray-300 hover:text-brand-violet hover:bg-white rounded-xl transition-all duration-300 shadow-sm"
                          title="Modify Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm"
                          title="Retire Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {menuItems.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-brand-gray/50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📭</div>
              <h3 className="text-xl font-serif font-black text-brand-black uppercase tracking-tight mb-2">Portfolio Empty</h3>
              <p className="text-[10px] font-sans font-black text-gray-400 uppercase tracking-widest mb-10">Initialize your first product to begin collection.</p>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center space-x-3 bg-brand-violet text-white px-10 py-4 rounded-2xl shadow-xl shadow-brand-violet/20 hover:bg-brand-deep transition-all duration-500 font-sans font-black text-[10px] uppercase tracking-[0.2em]"
              >
                <Plus className="w-4 h-4" />
                <span>Initialize Product</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
