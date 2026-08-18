import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct, lookupCatalogByUpc } from '../utils/api';

export default function AddEditProductModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    upc: '',
    title: '',
    quantity: 1,
    unit: 'pcs',
    expiryDate: '',
    category: 'General',
    notes: '',
    status: 'active',
  });

  const [lookingUp, setLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      // Format Date to YYYY-MM-DD for date input
      let formattedDate = '';
      if (initialData.expiryDate) {
        const d = new Date(initialData.expiryDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0];
        }
      }

      setFormData({
        upc: initialData.upc || '',
        title: initialData.title || '',
        quantity: initialData.quantity || 1,
        unit: initialData.unit || 'pcs',
        expiryDate: formattedDate,
        category: initialData.category || 'General',
        notes: initialData.notes || '',
        status: initialData.status || 'active',
      });
    } else {
      // Reset form
      setFormData({
        upc: '',
        title: '',
        quantity: 1,
        unit: 'pcs',
        expiryDate: '',
        category: 'General',
        notes: '',
        status: 'active',
      });
    }
    setError(null);
    setLookupMessage(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  // UPC Catalog Lookup Handler
  const handleUpcLookup = async () => {
    if (!formData.upc.trim()) {
      setLookupMessage({ type: 'error', text: 'Please enter a UPC barcode first.' });
      return;
    }

    setLookingUp(true);
    setLookupMessage(null);
    try {
      const res = await lookupCatalogByUpc(formData.upc.trim());
      if (res.found && res.catalogItem) {
        setFormData((prev) => ({
          ...prev,
          title: res.catalogItem.title || prev.title,
          category: res.catalogItem.category || prev.category,
        }));
        setLookupMessage({
          type: 'success',
          text: `Found in Master Catalog: "${res.catalogItem.title}" (${res.catalogItem.category})`,
        });
      } else {
        setLookupMessage({
          type: 'info',
          text: 'UPC not found in Master Catalog. You can enter details manually and it will be saved to the catalog!',
        });
      }
    } catch (err) {
      setLookupMessage({
        type: 'error',
        text: 'Error looking up UPC. You can still enter details manually.',
      });
    } finally {
      setLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Product title is required.');
      return;
    }

    if (!formData.expiryDate) {
      setError('Expiry date is required.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateProduct(initialData._id, formData);
      } else {
        await createProduct(formData);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-stone-900 border border-amber-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f78503] to-[#e5832e] p-0.5 shadow-lg shadow-amber-900/40">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center text-[#f78503]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-stone-400">
                {isEditing ? 'Update item details in your inventory' : 'Scan UPC barcode or enter product details manually'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* UPC Barcode & Lookup */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              UPC Barcode (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="upc"
                value={formData.upc}
                onChange={handleChange}
                placeholder="e.g. 012345678905"
                className="flex-grow px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              />
              <button
                type="button"
                onClick={handleUpcLookup}
                disabled={lookingUp}
                className="px-4 py-2.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded-xl text-xs font-semibold hover:bg-amber-900/60 hover:text-white transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
              >
                {lookingUp ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Lookup</span>
                  </>
                )}
              </button>
            </div>
            {lookupMessage && (
              <p className={`mt-1.5 text-xs ${lookupMessage.type === 'success' ? 'text-emerald-400' : lookupMessage.type === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
                {lookupMessage.text}
              </p>
            )}
          </div>

          {/* Product Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Whole Milk 1 Gallon"
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
            />
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                step="any"
                min="0.01"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              >
                <option value="pcs">pcs (Pieces)</option>
                <option value="pack">pack (Packs)</option>
                <option value="box">box (Boxes)</option>
                <option value="can">can (Cans)</option>
                <option value="bottle">bottle (Bottles)</option>
                <option value="g">g (Grams)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="ml">ml (Milliliters)</option>
                <option value="l">l (Liters)</option>
              </select>
            </div>
          </div>

          {/* Expiry Date & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Expiry Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              >
                <option value="General">General</option>
                <option value="Dairy">Dairy & Eggs</option>
                <option value="Produce">Produce (Fruits & Veggies)</option>
                <option value="Bakery">Bakery</option>
                <option value="Meat & Seafood">Meat & Seafood</option>
                <option value="Pantry">Pantry & Dry Goods</option>
                <option value="Beverages">Beverages</option>
                <option value="Frozen">Frozen Foods</option>
                <option value="Medicine">Medicine & Health</option>
                <option value="Household">Household Essentials</option>
              </select>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Item Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['active', 'consumed', 'discarded'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: st }))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    formData.status === st
                      ? st === 'active'
                        ? 'bg-amber-950 border-[#f78503] text-amber-200 shadow-md shadow-amber-950'
                        : st === 'consumed'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                        : 'bg-stone-800 border-stone-500 text-stone-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Kept in freezer top shelf"
              className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-stone-400 hover:text-white bg-stone-950 border border-stone-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] rounded-xl shadow-lg shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Add Item'}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
