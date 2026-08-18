import React from 'react';

export default function LandingPage({ currentUser, onNavigate }) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-[#f78503] selection:text-white space-y-16 py-8">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-16 md:pt-16 md:pb-24 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#f78503]/20 via-amber-600/10 to-[#e5832e]/20 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-xs font-semibold text-amber-300 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live WebRTC Barcode Scanner & Master Catalog</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                Stop Food Spoilage.{' '}
                <span className="bg-gradient-to-r from-white via-amber-100 to-[#e5832e] bg-clip-text text-transparent">
                  Master Expiry Dates & Save Money.
                </span>
              </h1>

              {/* Sub-Heading */}
              <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Scan UPC barcodes with your smartphone camera, auto-fill product details from our Master Catalog, organize pantry & medication inventory, and track real-time food waste savings.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => onNavigate && onNavigate('dashboard')}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-2xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span>Go to My Dashboard</span>
                    </button>

                    <button
                      onClick={() => onNavigate && onNavigate('add-product')}
                      className="w-full sm:w-auto px-7 py-4 rounded-2xl font-semibold text-sm text-amber-200 bg-amber-950/60 border border-amber-800/60 hover:bg-amber-900/60 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5 text-[#f78503]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      <span>Scan & Add Product</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate && onNavigate('register')}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-2xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Create Free Account</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                    <button
                      onClick={() => onNavigate && onNavigate('how-it-works')}
                      className="w-full sm:w-auto px-7 py-4 rounded-2xl font-semibold text-sm text-stone-300 hover:text-white bg-stone-900 border border-stone-800 hover:border-amber-900/60 transition-all cursor-pointer"
                    >
                      See How It Works →
                    </button>
                  </>
                )}
              </div>

              {/* Stats Highlights */}
              <div className="pt-8 border-t border-amber-900/30 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-extrabold text-white">85%</div>
                  <div className="text-xs text-stone-400 font-medium">Waste Reduced</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">UPC Auto</div>
                  <div className="text-xs text-stone-400 font-medium">Master Lookup</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#f78503]">$1,500/yr</div>
                  <div className="text-xs text-stone-400 font-medium">Avg Household Saved</div>
                </div>
              </div>

            </div>

            {/* Hero Right Card Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-amber-900/40 via-stone-900/90 to-stone-950 p-1 border border-amber-700/40 shadow-2xl">
                <div className="bg-stone-950 rounded-[22px] p-5 space-y-4">
                  
                  {/* Scanner Header Mock */}
                  <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Camera Barcode Radar
                    </span>
                  </div>

                  {/* Simulated Scanner Viewfinder */}
                  <div className="relative h-44 rounded-xl bg-stone-900 border border-amber-800/50 overflow-hidden flex flex-col items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#f78503]/10 via-transparent to-[#e5832e]/10 pointer-events-none"></div>
                    <div className="w-full h-0.5 bg-[#f78503] shadow-[0_0_12px_#f78503] animate-pulse"></div>
                    
                    <svg className="w-10 h-10 text-amber-400 opacity-70 my-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m0 14v1m8-8h-1M5 8h14M5 12h14M5 16h14M4 12h1" />
                    </svg>
                    <span className="text-[11px] font-mono text-stone-300">UPC: 0 12345 67890 5</span>
                    <span className="text-[11px] text-[#f78503] font-bold mt-0.5">Found: Organic Milk 1 Gal (Dairy)</span>
                  </div>

                  {/* Sample Real-time Radar Items */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-300 uppercase tracking-wider">Live Inventory Radar</div>
                    
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/90 border border-orange-900/60 text-xs">
                      <div>
                        <div className="font-bold text-white">Fresh Whole Milk</div>
                        <div className="text-[10px] text-stone-400">Dairy • 1 bottle</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-orange-950 text-orange-200 border border-orange-800 text-[10px] font-semibold">
                        Expires in 2 days
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900/90 border border-red-900/60 text-xs">
                      <div>
                        <div className="font-bold text-white">Fresh Strawberries</div>
                        <div className="text-[10px] text-stone-400">Produce • 1 box</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-100 border border-red-600 animate-pulse text-[10px] font-bold">
                        Expires Today!
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Specialties & Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Full Platform Tour</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Built with Powerful Modern Features
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            From barcode camera scanning to real-time inventory analytics, ExpiryGuard has everything built-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1: Camera Scanner */}
          <div
            onClick={() => onNavigate && onNavigate('features')}
            className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-8 shadow-xl space-y-4 cursor-pointer group transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-[#f78503] shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#f78503] transition-colors">Camera Barcode Scanner</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Use your device camera to scan barcodes (UPC-A, EAN-13, QR Code). Streamlined WebRTC camera scanning with zero hardware required.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#f78503] flex items-center gap-1">
              <span>Learn about scanning →</span>
            </div>
          </div>

          {/* Feature 2: Master Catalog */}
          <div
            onClick={() => onNavigate && onNavigate('features')}
            className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-8 shadow-xl space-y-4 cursor-pointer group transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-[#f78503] shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#f78503] transition-colors">UPC Master Catalog Auto-Lookup</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Scanning or entering a UPC code automatically queries our backend master database, auto-populating product title and category instantly.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#f78503] flex items-center gap-1">
              <span>Explore Master Catalog →</span>
            </div>
          </div>

          {/* Feature 3: Interactive Dashboard */}
          <div
            onClick={() => onNavigate && onNavigate(currentUser ? 'dashboard' : 'login')}
            className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-8 shadow-xl space-y-4 cursor-pointer group transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-[#f78503] shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#f78503] transition-colors">KPI Stats & Dual View Modes</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Monitor active, expiring soon, and consumed item metrics. Switch seamlessly between rich visual card grid and compact table list views.
            </p>
            <div className="pt-2 text-xs font-semibold text-[#f78503] flex items-center gap-1">
              <span>Open Dashboard →</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Interactive ROI & Savings Teaser */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-900/50 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Interactive Food Waste Calculator</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">How Much Can Your Household Save?</h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Average families save over $1,500 per year by preventing food spoilage. Calculate your exact savings based on monthly grocery spend and family size.
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('how-it-works')}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-xl shadow-amber-900/50 hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Open Interactive Calculator</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      {/* 4. Quick Page Navigation Footer CTA */}
      <section className="py-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#f78503] via-amber-700 to-[#e5832e] p-10 md:p-14 text-center shadow-2xl overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Ready to Organize Your Pantry & Prevent Waste?
              </h2>
              <p className="text-amber-100 max-w-xl mx-auto text-sm sm:text-base">
                Join thousands saving money every month with automated expiry radar tracking.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
                {currentUser ? (
                  <button
                    onClick={() => onNavigate && onNavigate('dashboard')}
                    className="px-8 py-3.5 rounded-xl font-bold text-amber-950 bg-white hover:bg-stone-100 shadow-lg transition-all duration-200 text-center cursor-pointer"
                  >
                    Go to My Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate && onNavigate('register')}
                      className="px-8 py-3.5 rounded-xl font-bold text-amber-950 bg-white hover:bg-stone-100 shadow-lg transition-all duration-200 text-center cursor-pointer"
                    >
                      Create Free Account
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('login')}
                      className="px-8 py-3.5 rounded-xl font-semibold text-white bg-stone-950/40 border border-white/30 hover:bg-stone-950/60 transition-all duration-200 text-center cursor-pointer"
                    >
                      Sign In Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
