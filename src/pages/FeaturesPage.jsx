import React, { useState } from 'react';

export default function FeaturesPage({ currentUser, onNavigate }) {
  // Feature Category Filter State
  const [activeTab, setActiveTab] = useState('all');

  const featuresList = [
    {
      id: 'scanner',
      category: 'camera',
      icon: '📷',
      title: 'WebRTC Camera Barcode Scanner',
      tagline: 'Instant Barcode Detection via Device Camera',
      description:
        'Scan physical barcodes (UPC-A, EAN-13, EAN-8, Code 128, QR Code) directly through your smartphone or laptop browser. Powered by HTML5 WebRTC and canvas detection without needing external hardware scanners.',
      highlights: ['No App Store download required', 'Environment camera facing mode', 'Auto-stops stream on success', 'Manual UPC fallback'],
      badge: 'Hardware Free',
    },
    {
      id: 'catalog',
      category: 'smart',
      icon: '🔍',
      title: 'UPC Master Catalog Auto-Lookup',
      tagline: 'Zero-Effort Product Metadata Auto-Fill',
      description:
        'Scanning or typing any UPC barcode code automatically queries the ExpiryGuard Master Catalog database, populating the product title, brand, and category instantly to save typing time.',
      highlights: ['Pre-fills title & category', 'Universal barcode database', 'Automatic catalog indexing', 'Custom override support'],
      badge: 'Auto-Complete',
    },
    {
      id: 'radar',
      category: 'smart',
      icon: '🚨',
      title: 'Color-Coded Expiry Radar',
      tagline: 'At-a-Glance Expiration Urgency Indicators',
      description:
        'Visual status badges immediately draw your attention to critical inventory state: Green (Fresh > 7d), Amber (Expiring in 7d), Orange (Expiring in 3d), Pulsing Red (Expires Today!), and Dark Red (Expired).',
      highlights: ['Animated pulse for today', 'Relative day counter', '7d, 30d, 90d date filters', 'Prevents accidental spoilage'],
      badge: 'Visual Alert',
    },
    {
      id: 'kpi',
      category: 'inventory',
      icon: '📊',
      title: 'Real-Time KPI Analytics Dashboard',
      tagline: 'Live Summary Statistics of Pantry Health',
      description:
        'Track active items, items expiring soon, expired counts, and saved/consumed counts in real time. Get instant feedback on your food waste reduction progress.',
      highlights: ['Active pantry counter', 'Expiring soon count', 'Expired alert counter', 'Consumed & saved counter'],
      badge: 'Real-Time Stats',
    },
    {
      id: 'views',
      category: 'inventory',
      icon: '🗂️',
      title: 'Dual Grid & Compact Table View Modes',
      tagline: 'Tailored Display Options for Every Inventory Size',
      description:
        'Switch seamlessly between a rich visual grid of product cards with category badges and a high-density tabular list designed for managing larger pantries and commercial kitchens.',
      highlights: ['Rich card grid view', 'Compact table list view', 'One-click toggle switcher', 'Responsive layout'],
      badge: 'Flexible UI',
    },
    {
      id: 'presets',
      category: 'smart',
      icon: '⏱️',
      title: 'One-Click Expiry Date Presets',
      tagline: 'Speed Up Manual Entry with Preset Buttons',
      description:
        'Adding products manually? Use one-tap preset date buttons (+3 days, +7 days, +14 days, +30 days) to quickly assign expiration dates without typing calendar numbers.',
      highlights: ['+3d, +7d, +14d, +30d buttons', 'Custom date picker selector', 'Default category assignment', 'Storage location notes'],
      badge: 'Quick Tap',
    },
    {
      id: 'lifecycle',
      category: 'inventory',
      icon: '⚡',
      title: '1-Click Lifecycle Status Updates',
      tagline: 'Track Item Transition from Active to Consumed',
      description:
        'Easily mark products as "Consumed" or "Discarded" with a single click. Reactivate consumed items when you restock them in your pantry.',
      highlights: ['Mark Consumed in 1-click', 'Mark Discarded in 1-click', 'Reactivate restocked items', 'Historical tracking'],
      badge: 'Status Workflow',
    },
    {
      id: 'security',
      category: 'security',
      icon: '🔒',
      title: 'JWT Authentication & Data Isolation',
      tagline: 'Private & Secure Personal Pantry Vault',
      description:
        'Your inventory data is strictly private. Protected by JSON Web Token (JWT) stateless authentication and MongoDB user-isolated database collections.',
      highlights: ['JWT Bearer authorization', 'Encrypted passwords', 'Private per-user data', 'Secure CORS header policy'],
      badge: 'Private & Secure',
    },
  ];

  const filteredFeatures =
    activeTab === 'all'
      ? featuresList
      : featuresList.filter((f) => f.category === activeTab);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Page Hero Section */}
      <div className="max-w-6xl mx-auto text-center space-y-6 pt-4 relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-24 w-96 h-96 bg-[#f78503]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-semibold shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#f78503]"></span>
          <span>Technical Specs & Product Specialties</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Everything You Need to Master Your <span className="bg-gradient-to-r from-amber-200 via-[#f78503] to-[#e5832e] bg-clip-text text-transparent">Pantry Inventory</span>
        </h1>

        <p className="text-stone-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Discover the powerful features, real-time tracking capabilities, and technical specialties built into ExpiryGuard.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate(currentUser ? 'add-product' : 'register')}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-2xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>Try Barcode Scanner</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            onClick={() => onNavigate && onNavigate(currentUser ? 'dashboard' : 'login')}
            className="px-7 py-4 rounded-2xl font-semibold text-sm text-stone-300 hover:text-white bg-stone-900 border border-stone-800 hover:border-amber-900/60 transition-all"
          >
            {currentUser ? 'Go to My Dashboard' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* 2. Interactive Feature Explorer Tabs */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Feature Specialties</h2>
            <p className="text-xs text-stone-400">Explore capabilities by technology category.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center bg-stone-900 p-1.5 rounded-2xl border border-stone-800">
            {[
              { id: 'all', label: 'All Features' },
              { id: 'camera', label: '📷 Barcode & Camera' },
              { id: 'smart', label: '⚡ Smart Tracking' },
              { id: 'inventory', label: '📊 Inventory & Analytics' },
              { id: 'security', label: '🔒 Security & Auth' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#f78503] text-white shadow-lg shadow-amber-950 font-bold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all hover:-translate-y-1 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-2xl bg-stone-950 border border-stone-800">
                    {feat.icon}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#f78503] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                    {feat.tagline}
                  </p>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {feat.description}
                </p>

                <div className="pt-2 border-t border-stone-800/60 space-y-1.5">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f78503]"></span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800/60 flex items-center justify-between text-[11px] font-semibold text-stone-500">
                <span>Specialty Feature</span>
                <span className="text-[#f78503] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Learn more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Technical Specifications Matrix */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Architecture & Stack</span>
          <h2 className="text-3xl font-extrabold text-white">Technical Specifications</h2>
          <p className="text-sm text-stone-400">High-performance architecture built with modern web standards and responsive design.</p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider font-semibold border-b border-stone-800">
                <tr>
                  <th className="py-4 px-6">Component / Spec</th>
                  <th className="py-4 px-6">Technology Used</th>
                  <th className="py-4 px-6">Capability / Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">Camera Scanner</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">html5-qrcode & WebRTC getUserMedia</td>
                  <td className="py-3.5 px-6 text-stone-400">UPC-A, EAN-13, EAN-8, Code 128, Code 39, QR Code scanning</td>
                </tr>
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">Frontend Framework</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">React 19 & Vite 8</td>
                  <td className="py-3.5 px-6 text-stone-400">Fast HMR, component modularity, client-side view routing</td>
                </tr>
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">Styling & UI Design</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">Tailwind CSS & Glassmorphism</td>
                  <td className="py-3.5 px-6 text-stone-400">Dark mode theme, HSL palette, custom animations, responsive flexbox/grid</td>
                </tr>
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">Backend Server</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">Node.js & Express.js API</td>
                  <td className="py-3.5 px-6 text-stone-400">RESTful JSON endpoints, controller-service-DAO architecture pattern</td>
                </tr>
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">Database & Persistence</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">MongoDB & Mongoose ORM</td>
                  <td className="py-3.5 px-6 text-stone-400">Indexed collections, population references, validation schemas</td>
                </tr>
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">Security & Auth</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">JWT Tokens & bcryptjs</td>
                  <td className="py-3.5 px-6 text-stone-400">Stateless bearer authorization, salt password hashing, isolated user data</td>
                </tr>
                <tr className="hover:bg-stone-950/50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">API Documentation</td>
                  <td className="py-3.5 px-6 text-amber-300 font-mono">Swagger UI (OpenAPI)</td>
                  <td className="py-3.5 px-6 text-stone-400">Interactive API documentation endpoint at /api-docs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Comparison Matrix: ExpiryGuard vs Alternatives */}
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Comparison</span>
          <h2 className="text-3xl font-extrabold text-white">Why ExpiryGuard Beats Alternatives</h2>
          <p className="text-sm text-stone-400">See how ExpiryGuard compares to traditional spreadsheets or pen-and-paper tracking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Paper / Memory */}
          <div className="bg-stone-900/60 border border-stone-800/80 rounded-3xl p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Traditional Method</div>
            <h3 className="text-lg font-bold text-stone-300">Memory or Paper Notes</h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2 text-red-400 font-medium">✕ No expiration alerts</li>
              <li className="flex items-center gap-2 text-red-400 font-medium">✕ Requires manual writing</li>
              <li className="flex items-center gap-2 text-red-400 font-medium">✕ Easy to lose or forget</li>
              <li className="flex items-center gap-2 text-red-400 font-medium">✕ No search or filters</li>
            </ul>
          </div>

          {/* Spreadsheets */}
          <div className="bg-stone-900/60 border border-stone-800/80 rounded-3xl p-6 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-500">Generic Tools</div>
            <h3 className="text-lg font-bold text-stone-300">Excel / Google Sheets</h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2 text-amber-400 font-medium">⚠️ Manual date typing required</li>
              <li className="flex items-center gap-2 text-red-400 font-medium">✕ No camera barcode scanner</li>
              <li className="flex items-center gap-2 text-red-400 font-medium">✕ No auto UPC catalog lookup</li>
              <li className="flex items-center gap-2 text-amber-400 font-medium">⚠️ Clunky on mobile phones</li>
            </ul>
          </div>

          {/* ExpiryGuard (Highlighted) */}
          <div className="bg-gradient-to-b from-stone-900 to-amber-950/40 border-2 border-[#f78503] rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-[#f78503] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Recommended
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#f78503]">ExpiryGuard</div>
            <h3 className="text-lg font-bold text-white">Smart Expiry Platform</h3>
            <ul className="space-y-2.5 text-xs text-stone-200 font-medium">
              <li className="flex items-center gap-2 text-emerald-400">✓ WebRTC Camera Barcode Scanner</li>
              <li className="flex items-center gap-2 text-emerald-400">✓ Automatic UPC Master Catalog lookup</li>
              <li className="flex items-center gap-2 text-emerald-400">✓ Color-coded Expiry Radar alerts</li>
              <li className="flex items-center gap-2 text-emerald-400">✓ Real-time summary statistics & savings</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 5. Call to Action Banner */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-900/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f78503]/10 blur-[100px] pointer-events-none rounded-full"></div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experience All Features Today
        </h2>
        <p className="text-sm text-stone-400 max-w-xl mx-auto">
          Start scanning barcodes and managing your pantry inventory with full automated tracking.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate && onNavigate(currentUser ? 'dashboard' : 'register')}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>{currentUser ? 'Go to My Dashboard' : 'Get Started Free'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
