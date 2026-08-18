import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, productTitle, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-stone-900 border border-red-900/40 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-3 bg-red-950/80 border border-red-900/50 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Product</h3>
            <p className="text-xs text-stone-400">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-sm text-stone-300">
          Are you sure you want to delete <span className="font-semibold text-white">"{productTitle}"</span> from your inventory?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-800">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white bg-stone-950 border border-stone-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-950 transition-all disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
