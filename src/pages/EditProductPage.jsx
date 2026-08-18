import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { fetchProductById, updateProduct, lookupCatalogByUpc } from '../utils/api';

export default function EditProductPage({ productId, currentUser, onNavigate }) {
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

  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Camera Scanner States
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedCode, setScannedCode] = useState(null);
  const html5QrCodeRef = useRef(null);

  // Catalog Lookup States
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupMessage, setLookupMessage] = useState(null);

  // Form Submit States
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch product details on mount
  useEffect(() => {
    async function loadDetails() {
      if (!productId) {
        setFetchError('No product selected for editing.');
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);
      setFetchError(null);
      try {
        const prod = await fetchProductById(productId);
        if (prod) {
          let formattedDate = '';
          if (prod.expiryDate) {
            const d = new Date(prod.expiryDate);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toISOString().split('T')[0];
            }
          }

          setFormData({
            upc: prod.upc || '',
            title: prod.title || '',
            quantity: prod.quantity || 1,
            unit: prod.unit || 'pcs',
            expiryDate: formattedDate,
            category: prod.category || 'General',
            notes: prod.notes || '',
            status: prod.status || 'active',
          });
        } else {
          setFetchError('Product details not found.');
        }
      } catch (err) {
        setFetchError(err.message || 'Failed to load product details.');
      } finally {
        setInitialLoading(false);
      }
    }

    loadDetails();
  }, [productId]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      stopScannerSilently();
    };
  }, []);

  const stopScannerSilently = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      } catch (e) {
        // Ignore stop errors
      }
      html5QrCodeRef.current = null;
    }
  };

  // Start Camera Barcode Scanner
  const startScanner = async () => {
    setCameraError(null);
    setScannedCode(null);
    setIsScanning(true);

    setTimeout(async () => {
      try {
        const readerElement = document.getElementById('barcode-reader-edit');
        if (!readerElement) {
          throw new Error('Scanner container element not found.');
        }

        if (html5QrCodeRef.current) {
          await stopScannerSilently();
        }

        const html5QrCode = new Html5Qrcode('barcode-reader-edit');
        html5QrCodeRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 280, height: 160 },
          aspectRatio: 1.777778,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            handleBarcodeScanned(decodedText);
          },
          (errorMessage) => {}
        );
      } catch (err) {
        console.error('Camera Scanner Error:', err);
        setCameraError(
          err.message || 'Unable to access device camera. Please check permissions or enter UPC manually.'
        );
        setIsScanning(false);
      }
    }, 200);
  };

  // Stop Camera Scanner
  const stopScanner = async () => {
    await stopScannerSilently();
    setIsScanning(false);
  };

  // Handle barcode scanned
  const handleBarcodeScanned = async (code) => {
    const trimmedCode = code.trim();
    setScannedCode(trimmedCode);
    setFormData((prev) => ({ ...prev, upc: trimmedCode }));

    await stopScannerSilently();
    setIsScanning(false);

    performUpcLookup(trimmedCode);
  };

  // UPC Catalog Lookup Helper
  const performUpcLookup = async (upcCode) => {
    if (!upcCode || !upcCode.trim()) {
      setLookupMessage({ type: 'error', text: 'Please enter a UPC barcode code first.' });
      return;
    }

    setLookingUp(true);
    setLookupMessage(null);
    try {
      const res = await lookupCatalogByUpc(upcCode.trim());
      if (res.found && res.catalogItem) {
        setFormData((prev) => ({
          ...prev,
          title: res.catalogItem.title || prev.title,
          category: res.catalogItem.category || prev.category,
        }));
        setLookupMessage({
          type: 'success',
          text: `Found in Master Catalog: "${res.catalogItem.title}" (${res.catalogItem.category || 'General'})`,
        });
      } else {
        setLookupMessage({
          type: 'info',
          text: 'UPC barcode not found in Master Catalog. You can update details manually.',
        });
      }
    } catch (err) {
      setLookupMessage({
        type: 'error',
        text: 'Could not lookup UPC in catalog.',
      });
    } finally {
      setLookingUp(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
  };

  const setPresetExpiryDays = (days) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    const formatted = target.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!formData.title.trim()) {
      setFormError('Product Title is required.');
      return;
    }

    if (!formData.expiryDate) {
      setFormError('Expiry Date is required.');
      return;
    }

    setLoading(true);
    try {
      await updateProduct(productId, formData);
      setSuccessMessage('Product updated successfully!');
      
      await stopScannerSilently();

      setTimeout(() => {
        if (onNavigate) onNavigate('dashboard');
      }, 1200);
    } catch (err) {
      setFormError(err.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 py-20 text-center space-y-4">
        <div className="inline-block w-10 h-10 border-4 border-[#f78503] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-stone-400">Loading product details for editing...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 max-w-lg mx-auto">
        <div className="bg-stone-900 border border-red-900/50 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Error Loading Product</h3>
          <p className="text-xs text-stone-400">{fetchError}</p>
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="px-5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs font-semibold text-stone-300 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation Header / Breadcrumb */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                stopScannerSilently();
                if (onNavigate) onNavigate('dashboard');
              }}
              className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-amber-900/60 transition-all flex items-center gap-1.5 text-xs font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
            <span className="text-stone-600">/</span>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Edit Product</h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-amber-300 text-xs font-semibold">
              Editing Item: {formData.title || 'Product'}
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-sm p-4 rounded-2xl flex items-center gap-3 shadow-xl animate-bounce">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{successMessage} Redirecting to dashboard...</span>
          </div>
        )}

        {/* Camera Barcode Scanner Card */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-[#f78503]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Camera Barcode Scanner</h3>
                <p className="text-xs text-stone-400">Optionally scan barcode to update UPC code</p>
              </div>
            </div>

            {!isScanning ? (
              <button
                type="button"
                onClick={startScanner}
                className="px-5 py-2.5 bg-gradient-to-r from-[#f78503] to-[#e5832e] text-white text-xs font-bold rounded-xl shadow-lg shadow-amber-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Start Camera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopScanner}
                className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold rounded-xl transition-all"
              >
                Stop Scanner
              </button>
            )}
          </div>

          {isScanning && (
            <div className="space-y-3 pt-2">
              <div className="relative w-full max-w-md mx-auto aspect-video bg-black rounded-2xl overflow-hidden border-2 border-[#f78503] shadow-inner">
                <div id="barcode-reader-edit" className="w-full h-full"></div>
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-amber-400/40 rounded-xl m-4 flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-amber-300 bg-stone-950/80 px-3 py-1 rounded-full border border-amber-800/60 shadow">
                    Align barcode inside frame
                  </span>
                </div>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3.5 rounded-xl flex items-center justify-between">
              <span>{cameraError}</span>
              <button onClick={() => setCameraError(null)} className="text-stone-400 hover:text-white text-xs underline">
                Dismiss
              </button>
            </div>
          )}

          {scannedCode && (
            <div className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 text-xs p-3 rounded-xl flex items-center justify-between">
              <span className="font-semibold">Scanned Barcode: <code className="bg-stone-950 px-2 py-0.5 rounded text-amber-300">{scannedCode}</code></span>
              <span className="text-[11px] text-emerald-400">Barcode applied!</span>
            </div>
          )}
        </div>

        {/* Product Details Form */}
        <div className="bg-stone-900/90 border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h2 className="text-lg font-bold text-white">Edit Product Details</h2>
            <p className="text-xs text-stone-400">Modify information below and click "Save Changes" to update inventory.</p>
          </div>

          {formError && (
            <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3.5 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* UPC Barcode & Master Catalog Lookup */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                UPC Barcode Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="upc"
                  value={formData.upc}
                  onChange={handleChange}
                  placeholder="e.g. 012345678905"
                  className="flex-grow px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503] font-mono"
                />
                <button
                  type="button"
                  onClick={() => performUpcLookup(formData.upc)}
                  disabled={lookingUp}
                  className="px-5 py-2.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded-xl text-xs font-semibold hover:bg-amber-900 hover:text-white transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {lookingUp ? (
                    <span>Looking up...</span>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Lookup Master Catalog</span>
                    </>
                  )}
                </button>
              </div>

              {lookupMessage && (
                <p className={`mt-1.5 text-xs font-medium ${
                  lookupMessage.type === 'success'
                    ? 'text-emerald-400'
                    : lookupMessage.type === 'error'
                    ? 'text-red-400'
                    : 'text-amber-400'
                }`}>
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
                placeholder="e.g. Organic Whole Milk 1 Gallon"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              />
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-2 gap-4">
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
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
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
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
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

            {/* Expiry Date Picker & Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Expiry Date <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-500 font-semibold mr-1">Presets:</span>
                  {[3, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setPresetExpiryDays(days)}
                      className="px-2 py-0.5 bg-stone-950 hover:bg-amber-950 hover:text-amber-300 border border-stone-800 text-stone-400 text-[10px] font-semibold rounded transition-colors"
                    >
                      +{days}d
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Product Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
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

            {/* Status Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Inventory Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'active', label: 'Active' },
                  { key: 'consumed', label: 'Consumed' },
                  { key: 'discarded', label: 'Discarded' },
                ].map((st) => (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: st.key }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      formData.status === st.key
                        ? st.key === 'active'
                          ? 'bg-amber-950 border-[#f78503] text-amber-200 shadow-md shadow-amber-950'
                          : st.key === 'consumed'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                          : 'bg-stone-800 border-stone-500 text-stone-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Notes / Storage Location (Optional)
              </label>
              <textarea
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Kept in top shelf of pantry cabinet"
                className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503]"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => {
                  stopScannerSilently();
                  if (onNavigate) onNavigate('dashboard');
                }}
                className="px-6 py-3 text-xs font-semibold text-stone-400 hover:text-white bg-stone-950 border border-stone-800 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] rounded-xl shadow-xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <span>Updating Product...</span>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
