import React, { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchProductSummary, updateProductStatus, deleteProduct } from '../utils/api';
import AddEditProductModal from '../components/AddEditProductModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function DashboardPage({ currentUser, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
    consumed: 0,
    discarded: 0,
  });
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination, Filtering & Sorting State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expiringDaysFilter, setExpiringDaysFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [sortOrder, setSortOrder] = useState('expiryDate');

  // Display View Mode: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Summary KPI Stats
  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const stats = await fetchProductSummary();
      if (stats) setSummary(stats);
    } catch (err) {
      console.error('Failed to load inventory summary stats:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Fetch Paginated & Filtered Products from API
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 18,
        status: statusFilter,
        sort: sortOrder,
      };

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      if (expiringDaysFilter) {
        params.expiringDays = expiringDaysFilter;
      }

      const res = await fetchProducts(params);
      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.totalCount || 0);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, categoryFilter, expiringDaysFilter, sortOrder, searchTerm]);

  // Combined Refresh Handler
  const refreshAll = useCallback(() => {
    loadProducts();
    loadSummary();
  }, [loadProducts, loadSummary]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Filter Change Handlers (Resetting Page to 1)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handleExpiryFilterChange = (e) => {
    setExpiringDaysFilter(e.target.value);
    setPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const handleStatusTabChange = (st) => {
    setStatusFilter(st);
    setPage(1);
  };

  // Quick Status Toggle Handler
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await updateProductStatus(id, newStatus);
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  // Delete product handler
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deletingProduct._id);
      setDeletingProduct(null);
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculate Urgency Status & Color Badge
  const getItemUrgency = (expiryDateStr) => {
    if (!expiryDateStr) return { label: 'Unknown', bg: 'bg-stone-800 text-stone-300 border-stone-700', days: 999 };
    
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Expired ${Math.abs(diffDays)} days ago`, bg: 'bg-red-950/90 text-red-200 border-red-800/80', days: diffDays };
    } else if (diffDays === 0) {
      return { label: 'Expires Today!', bg: 'bg-red-950 text-red-100 border-red-600 animate-pulse', days: diffDays };
    } else if (diffDays <= 3) {
      return { label: `Expires in ${diffDays} days`, bg: 'bg-orange-950/90 text-orange-200 border-orange-700', days: diffDays };
    } else if (diffDays <= 7) {
      return { label: `Expires in ${diffDays} days`, bg: 'bg-amber-950/90 text-amber-200 border-amber-700', days: diffDays };
    } else {
      return { label: `Expires in ${diffDays} days`, bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60', days: diffDays };
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/30 to-stone-900 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#f78503]/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-amber-300 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Pantry & Product Dashboard
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, {currentUser?.name || 'Pantry Manager'}! 👋
              </h1>
              <p className="mt-1 text-sm text-stone-400">
                Manage your food inventory, keep track of expiry dates, and prevent food waste.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={refreshAll}
                title="Refresh Inventory"
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-amber-900/60 transition-all shadow-md active:scale-95"
              >
                <svg className={`w-5 h-5 ${(loading || summaryLoading) ? 'animate-spin text-[#f78503]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={() => {
                  if (onNavigate) onNavigate('add-product');
                }}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-xl shadow-amber-900/40 hover:shadow-amber-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Active Items KPI */}
          <div className="bg-stone-900/90 border border-stone-800/80 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Active Items</span>
              <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-[#f78503]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">{summary.active}</span>
              <span className="text-xs text-stone-500 block mt-0.5">items in pantry</span>
            </div>
          </div>

          {/* Expiring Soon KPI */}
          <div className={`bg-stone-900/90 border rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between ${
            summary.expiringSoon > 0 ? 'border-orange-900/70 bg-orange-950/10' : 'border-stone-800/80'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">Expiring Soon</span>
              <div className="w-8 h-8 rounded-xl bg-orange-950/60 border border-orange-800/50 flex items-center justify-center text-orange-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-200">{summary.expiringSoon}</span>
              <span className="text-xs text-orange-400/80 block mt-0.5">within 7 days</span>
            </div>
          </div>

          {/* Expired Items KPI */}
          <div className={`bg-stone-900/90 border rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between ${
            summary.expired > 0 ? 'border-red-900/70 bg-red-950/10' : 'border-stone-800/80'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-300">Expired Items</span>
              <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-red-200">{summary.expired}</span>
              <span className="text-xs text-red-400/80 block mt-0.5">past expiry date</span>
            </div>
          </div>

          {/* Consumed Items KPI */}
          <div className="bg-stone-900/90 border border-stone-800/80 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Consumed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-200">{summary.consumed}</span>
              <span className="text-xs text-emerald-400/80 block mt-0.5">items saved & used</span>
            </div>
          </div>

        </div>

        {/* Filters & Control Toolbar */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-grow max-w-md">
              <svg className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products by title, category, or UPC barcode..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0">
              {[
                { key: 'active', label: 'Active' },
                { key: 'consumed', label: 'Consumed' },
                { key: 'discarded', label: 'Discarded' },
                { key: 'all', label: 'All' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleStatusTabChange(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === tab.key
                      ? 'bg-amber-950 text-amber-200 border border-amber-800/60 shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

          <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
            
            {/* Secondary Select Filters */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Category:
                </label>
                <select
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  className="px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-xs font-medium focus:outline-none focus:border-[#f78503]"
                >
                  <option value="all">All Categories</option>
                  <option value="General">General</option>
                  <option value="Dairy">Dairy & Eggs</option>
                  <option value="Produce">Produce</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Meat & Seafood">Meat & Seafood</option>
                  <option value="Pantry">Pantry & Dry Goods</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Frozen">Frozen Foods</option>
                  <option value="Medicine">Medicine & Health</option>
                  <option value="Household">Household</option>
                </select>
              </div>

              {/* Expiry Days Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Expiry:
                </label>
                <select
                  value={expiringDaysFilter}
                  onChange={handleExpiryFilterChange}
                  className="px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-xs font-medium focus:outline-none focus:border-[#f78503]"
                >
                  <option value="">All Expiry Dates</option>
                  <option value="7">Expiring in 7 Days</option>
                  <option value="30">Expiring in 30 Days</option>
                  <option value="90">Expiring in 90 Days</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Sort By:
                </label>
                <select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  className="px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 text-xs font-medium focus:outline-none focus:border-[#f78503]"
                >
                  <option value="expiryDate">Expiry (Earliest First)</option>
                  <option value="-expiryDate">Expiry (Latest First)</option>
                  <option value="title">Name (A-Z)</option>
                  <option value="createdAt">Date Added (Newest)</option>
                </select>
              </div>

            </div>

            {/* View Mode Switcher (Grid vs Table) */}
            <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-950 text-amber-200 border border-amber-800/60 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-amber-950 text-amber-200 border border-amber-800/60 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Table View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

          </div>

        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-sm p-4 rounded-2xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refreshAll} className="underline text-xs font-semibold hover:text-white">
              Try Again
            </button>
          </div>
        )}

        {/* Products Display Container */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block w-10 h-10 border-4 border-[#f78503] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-stone-400">Loading products from backend API...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-stone-900/60 border border-stone-800/80 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-950/60 border border-amber-900/50 flex items-center justify-center text-[#f78503]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">No products found</h3>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              {searchTerm || expiringDaysFilter || categoryFilter !== 'all' || statusFilter !== 'active'
                ? 'No items match your current search and filter criteria. Try clearing or adjusting your filters.'
                : 'Your pantry inventory is empty. Click below to add your first product!'}
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('add-product');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#f78503] to-[#e5832e] text-white text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Add First Product
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => {
              const urgency = getItemUrgency(item.expiryDate);
              const formattedExpiry = new Date(item.expiryDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={item._id}
                  className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:shadow-2xl hover:translate-y-[-2px] group"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Category & Urgency Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-400 text-[11px] font-medium uppercase tracking-wider">
                        {item.category || 'General'}
                      </span>

                      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold ${urgency.bg}`}>
                        {urgency.label}
                      </span>
                    </div>

                    {/* Title & UPC */}
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#f78503] transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      {item.upc && (
                        <p className="text-xs text-stone-500 font-mono mt-0.5 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m4-16v16M8 4v16M4 4v16m16-16v16" />
                          </svg>
                          UPC: {item.upc}
                        </p>
                      )}
                    </div>

                    {/* Quantity & Expiry Details */}
                    <div className="grid grid-cols-2 gap-2 bg-stone-950 p-3 rounded-xl border border-stone-800/80 text-xs">
                      <div>
                        <span className="text-stone-500 uppercase tracking-wider text-[10px] block font-semibold">
                          Quantity
                        </span>
                        <span className="font-bold text-stone-200">
                          {item.quantity} {item.unit || 'pcs'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 uppercase tracking-wider text-[10px] block font-semibold">
                          Expiry Date
                        </span>
                        <span className="font-bold text-stone-200">
                          {formattedExpiry}
                        </span>
                      </div>
                    </div>

                    {/* Notes if any */}
                    {item.notes && (
                      <p className="text-xs text-stone-400 italic bg-stone-950/50 p-2 rounded-lg border border-stone-800/40 line-clamp-2">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 mt-4 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    
                    {/* Quick Status Buttons */}
                    <div className="flex items-center gap-1.5">
                      {item.status === 'active' ? (
                        <>
                          <button
                            onClick={() => handleQuickStatusChange(item._id, 'consumed')}
                            title="Mark as Consumed"
                            className="px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Consumed</span>
                          </button>

                          <button
                            onClick={() => handleQuickStatusChange(item._id, 'discarded')}
                            title="Mark as Discarded"
                            className="px-2 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 text-xs font-medium rounded-lg transition-colors"
                          >
                            Discard
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleQuickStatusChange(item._id, 'active')}
                          className="px-2.5 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 text-amber-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>

                    {/* Edit & Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (onNavigate) onNavigate('edit-product', item._id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                        title="Edit Product Page"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => setDeletingProduct(item)}
                        className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* Table View Layout */
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider font-semibold border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4">Status / Urgency</th>
                    <th className="py-3.5 px-4">Product & UPC</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Quantity</th>
                    <th className="py-3.5 px-4">Expiry Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {products.map((item) => {
                    const urgency = getItemUrgency(item.expiryDate);
                    const formattedExpiry = new Date(item.expiryDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={item._id} className="hover:bg-stone-950/50 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold ${urgency.bg}`}>
                            {urgency.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-sm">{item.title}</div>
                          {item.upc && <div className="text-[11px] text-stone-500 font-mono">UPC: {item.upc}</div>}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400 text-[10px]">
                            {item.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-stone-200">
                          {item.quantity} {item.unit || 'pcs'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-semibold text-stone-200">
                          {formattedExpiry}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-right space-x-1">
                          {item.status === 'active' ? (
                            <button
                              onClick={() => handleQuickStatusChange(item._id, 'consumed')}
                              className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold rounded"
                            >
                              Consumed
                            </button>
                          ) : (
                            <button
                              onClick={() => handleQuickStatusChange(item._id, 'active')}
                              className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 text-amber-300 text-[11px] font-semibold rounded"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (onNavigate) onNavigate('edit-product', item._id);
                            }}
                            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded inline-block"
                            title="Edit Product Page"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeletingProduct(item)}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/50 rounded inline-block"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-stone-400">
              Showing page <span className="font-semibold text-white">{page}</span> of{' '}
              <span className="font-semibold text-white">{totalPages}</span> ({totalCount} total items, max 18 per page)
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-[#f78503] text-white shadow-md'
                        : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={refreshAll}
        initialData={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        productTitle={deletingProduct?.title || ''}
        loading={deleteLoading}
      />
    </div>
  );
}
