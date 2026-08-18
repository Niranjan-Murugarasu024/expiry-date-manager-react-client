import React, { useState } from 'react';

export default function HowItWorksPage({ currentUser, onNavigate }) {
  // Interactive Savings Calculator State
  const [monthlySpend, setMonthlySpend] = useState(650);
  const [householdSize, setHouseholdSize] = useState(3);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Default spend benchmarks based on household size
  const defaultSpendMap = {
    1: 250,
    2: 450,
    3: 650,
    4: 850,
    5: 1100,
  };

  const handleHouseholdSizeChange = (size) => {
    setHouseholdSize(size);
    if (defaultSpendMap[size]) {
      setMonthlySpend(defaultSpendMap[size]);
    }
  };

  // Dynamic Calculations factoring both monthly spend AND household size
  // Waste % increases slightly with household size (20% for 1 person up to 30% for 5+ people due to bulk purchasing & complex diets)
  const wastePercentage = 0.20 + (householdSize - 1) * 0.025;
  const annualSpend = monthlySpend * 12;
  const estimatedWasteWithoutApp = Math.round(annualSpend * wastePercentage);
  const estimatedSavingsWithApp = Math.round(estimatedWasteWithoutApp * 0.85); // 85% waste reduction
  const savedMealsPerYear = Math.round(estimatedSavingsWithApp / 4.25); // ~$4.25 per meal average
  const wasteReducedLbs = Math.round(estimatedSavingsWithApp * 1.6); // ~1.6 lbs per dollar saved

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Hero Section */}
      <div className="max-w-6xl mx-auto text-center space-y-6 pt-4 relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-24 w-96 h-96 bg-[#f78503]/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-semibold shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Smarter Inventory & Zero Food Waste</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          How <span className="bg-gradient-to-r from-amber-200 via-[#f78503] to-[#e5832e] bg-clip-text text-transparent">ExpiryGuard</span> Eliminates Food Waste & Saves You Money
        </h1>

        <p className="text-stone-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          ExpiryGuard is an intelligent pantry management platform that tracks your groceries, medications, and supplies in real time—notifying you before items spoil so you never throw money away again.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate(currentUser ? 'dashboard' : 'register')}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-2xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <span>{currentUser ? 'Go to My Dashboard' : 'Start Saving Free'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <a
            href="#interactive-calculator"
            className="px-7 py-4 rounded-2xl font-semibold text-sm text-stone-300 hover:text-white bg-stone-900 border border-stone-800 hover:border-amber-900/60 transition-all"
          >
            Calculate Your Savings ↓
          </a>
        </div>
      </div>

      {/* 2. Real-Time Impact Stats & Live Interactive Savings Calculator */}
      <div id="interactive-calculator" className="max-w-6xl mx-auto space-y-8">
        
        {/* Real-time Global Data Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-900/90 border border-stone-800/90 rounded-2xl p-5 text-center space-y-1 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-amber-400">1.3B</div>
            <div className="text-xs text-stone-400 font-medium uppercase tracking-wider">Tons Food Wasted Yearly (Global)</div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800/90 rounded-2xl p-5 text-center space-y-1 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">$1,500+</div>
            <div className="text-xs text-stone-400 font-medium uppercase tracking-wider">Avg. Household Waste / Year</div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800/90 rounded-2xl p-5 text-center space-y-1 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-orange-400">85%</div>
            <div className="text-xs text-stone-400 font-medium uppercase tracking-wider">Reduction in Expired Items</div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800/90 rounded-2xl p-5 text-center space-y-1 shadow-xl">
            <div className="text-3xl sm:text-4xl font-black text-amber-200">2.5 hrs</div>
            <div className="text-xs text-stone-400 font-medium uppercase tracking-wider">Saved per Month on Inventory</div>
          </div>
        </div>

        {/* Interactive ROI & Money Savings Calculator */}
        <div className="bg-gradient-to-br from-stone-900 via-amber-950/20 to-stone-900 border border-amber-900/50 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-72 h-72 bg-[#f78503]/10 blur-[100px] pointer-events-none rounded-full"></div>

          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Interactive Savings Calculator</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">See How Much Money You Will Save</h2>
            <p className="text-xs sm:text-sm text-stone-400">Select your household size or adjust your monthly grocery spend to see your live personalized savings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            
            {/* Controls */}
            <div className="space-y-6 bg-stone-950 p-6 rounded-2xl border border-stone-800/80">
              
              {/* Household Size Selector */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-stone-300">Household Size:</span>
                  <span className="text-amber-300 font-bold text-sm">{householdSize} {householdSize === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleHouseholdSizeChange(size)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        householdSize === size
                          ? 'bg-gradient-to-r from-[#f78503] to-[#e5832e] text-white border-[#f78503] shadow-lg shadow-amber-950 scale-[1.05]'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
                      }`}
                    >
                      {size} {size === 5 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Spend Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-stone-300">Monthly Grocery & Pantry Spend:</span>
                  <span className="text-[#f78503] font-bold text-sm">${monthlySpend} / month</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="25"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#f78503]"
                />
                <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
                  <span>$100</span>
                  <span>$1,250</span>
                  <span>$2,500</span>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                <span>Calculated for <strong>{householdSize} {householdSize === 1 ? 'person' : 'family members'}</strong> (~{Math.round(wastePercentage * 100)}% estimated unmanaged food waste).</span>
              </div>

            </div>

            {/* Live Calculation Results */}
            <div className="bg-stone-950/90 border border-emerald-900/60 rounded-2xl p-6 space-y-5 text-center shadow-xl relative">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block">Estimated Annual Savings Impact</span>
              
              <div>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight transition-all">
                  ${estimatedSavingsWithApp.toLocaleString()}
                </div>
                <span className="text-xs text-stone-400 mt-1 block">money saved back in your pocket</span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-800 text-xs">
                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] block font-semibold">Annual Bill</span>
                  <span className="font-bold text-stone-200 text-xs sm:text-sm">${annualSpend.toLocaleString()}</span>
                </div>

                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] block font-semibold">Food Waste</span>
                  <span className="font-bold text-amber-300 text-xs sm:text-sm">~{wasteReducedLbs.toLocaleString()} lbs</span>
                </div>

                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                  <span className="text-stone-500 uppercase tracking-wider text-[9px] block font-semibold">Saved Meals</span>
                  <span className="font-bold text-emerald-300 text-xs sm:text-sm">~{savedMealsPerYear}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Why You Need This Product (Problem & Solution) */}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Why You Need ExpiryGuard</span>
          <h2 className="text-3xl font-extrabold text-white">Stop Throwing Food & Money Away</h2>
          <p className="text-sm text-stone-400">Most households lose hundreds of dollars a year simply because items slip into the back of cabinets or refrigerators unnoticed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* The Problem Card */}
          <div className="bg-stone-900/80 border border-red-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">The Painful Reality Without ExpiryGuard</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Forgotten Groceries:</strong> Expired milk, moldy cheese, and wilted produce hidden behind jars.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Double Buying:</strong> Purchasing items at the store that you already had in your pantry.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Safety Risks:</strong> Unknowingly consuming spoiled food or using expired medications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Financial Loss:</strong> Throwing away 20% to 30% of what you buy every month.</span>
              </li>
            </ul>
          </div>

          {/* The Solution Card */}
          <div className="bg-stone-900/80 border border-emerald-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">The Power of Smart Expiry Management</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Instant Camera & UPC Scanning:</strong> Scan barcodes in seconds to auto-lookup items in our Master Catalog.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Color-Coded Urgency Dashboard:</strong> At-a-glance alerts for items expiring today, within 7 days, or expired.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Category & Status Tracking:</strong> Filter by Dairy, Produce, Bakery, Household, or Medicine in seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Smart Grocery Planning:</strong> Consume items before expiry and cut your monthly spend dramatically.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Real-World Use Cases */}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Target Applications</span>
          <h2 className="text-3xl font-extrabold text-white">Tailored for Every Use Case</h2>
          <p className="text-sm text-stone-400">Whether for personal home use or small business management, ExpiryGuard fits seamlessly into your workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Use Case 1 */}
          <div className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 space-y-3 shadow-lg transition-all hover:-translate-y-1">
            <div className="text-3xl">🏠</div>
            <h3 className="text-lg font-bold text-white">Household Pantry & Refrigerator</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Keep track of dairy, produce, meats, frozen goods, and dry spices. Receive visual alerts so your family consumes food before it spoils.
            </p>
          </div>

          {/* Use Case 2 */}
          <div className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 space-y-3 shadow-lg transition-all hover:-translate-y-1">
            <div className="text-3xl">☕</div>
            <h3 className="text-lg font-bold text-white">Cafes, Restaurants & Bakeries</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Enforce FIFO (First-In, First-Out) ingredient rotation, track perishable stock levels, and comply with food safety inspection audits.
            </p>
          </div>

          {/* Use Case 3 */}
          <div className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 space-y-3 shadow-lg transition-all hover:-translate-y-1">
            <div className="text-3xl">💊</div>
            <h3 className="text-lg font-bold text-white">Medicine & First-Aid Cabinet</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Monitor prescription medications, vitamins, supplements, and first-aid supplies to ensure your family's health safety.
            </p>
          </div>

          {/* Use Case 4 */}
          <div className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 space-y-3 shadow-lg transition-all hover:-translate-y-1">
            <div className="text-3xl">🍱</div>
            <h3 className="text-lg font-bold text-white">Meal Preppers & Bulk Buyers</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Manage bulk purchases from Costco or Sam's Club, track prepped weekly meals, and organize your chest freezer inventory.
            </p>
          </div>

          {/* Use Case 5 */}
          <div className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 space-y-3 shadow-lg transition-all hover:-translate-y-1">
            <div className="text-3xl">🏢</div>
            <h3 className="text-lg font-bold text-white">Office Breakroom & Kitchens</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Track communal office coffee supplies, snacks, beverages, and breakroom perishables across office teams.
            </p>
          </div>

          {/* Use Case 6 */}
          <div className="bg-stone-900/90 border border-stone-800/90 hover:border-amber-900/60 rounded-3xl p-6 space-y-3 shadow-lg transition-all hover:-translate-y-1">
            <div className="text-3xl">🧺</div>
            <h3 className="text-lg font-bold text-white">Household Supplies & Cosmetics</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Track expiry dates for cleaning chemicals, skincare products, sunscreens, and personal care items that lose effectiveness over time.
            </p>
          </div>

        </div>
      </div>

      {/* 5. Step-by-Step Workflow Visualizer */}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Simple 4-Step Process</span>
          <h2 className="text-3xl font-extrabold text-white">How ExpiryGuard Works in 4 Steps</h2>
          <p className="text-sm text-stone-400">Effortlessly add and monitor your inventory in less than 10 seconds per item.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 relative overflow-hidden">
            <div className="text-xs font-black text-[#f78503] uppercase tracking-widest">Step 01</div>
            <h4 className="text-lg font-bold text-white">Scan or Search</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Scan barcode with your phone camera or type the UPC barcode. Our Master Catalog auto-populates product details instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 relative overflow-hidden">
            <div className="text-xs font-black text-[#f78503] uppercase tracking-widest">Step 02</div>
            <h4 className="text-lg font-bold text-white">Set Expiry Date</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Choose the expiration date using quick date preset buttons (+3d, +7d, +14d, +30d) and tag the category & storage notes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 relative overflow-hidden">
            <div className="text-xs font-black text-[#f78503] uppercase tracking-widest">Step 03</div>
            <h4 className="text-lg font-bold text-white">Real-Time Alerts</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dashboard automatically highlights items expiring soon (amber), expired (red), or fresh (green) so you prioritize usage.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 relative overflow-hidden">
            <div className="text-xs font-black text-[#f78503] uppercase tracking-widest">Step 04</div>
            <h4 className="text-lg font-bold text-white">Consume & Save</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Mark items as "Consumed" with one click. Watch your saved meals increase and your monthly grocery spend decrease!
            </p>
          </div>

        </div>
      </div>

      {/* 6. Interactive FAQ Accordion */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f78503]">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Do I need a special barcode scanner device?',
              a: 'No! ExpiryGuard uses your smartphone or laptop webcam to scan UPC barcodes directly in the browser via WebRTC HTML5 camera scanning.'
            },
            {
              q: 'How does the Master Catalog UPC lookup work?',
              a: 'When you scan or type a UPC barcode code, ExpiryGuard checks our master catalog database to retrieve the product title and category automatically.'
            },
            {
              q: 'Can I use ExpiryGuard without scanning barcodes?',
              a: 'Absolutely. You can manually enter any product title, quantity, expiry date, category, and notes in under 5 seconds.'
            },
            {
              q: 'Is ExpiryGuard free to use?',
              a: 'Yes, basic inventory tracking and expiry alerts are 100% free with unlimited item storage.'
            },
            {
              q: 'What categories of items can I track?',
              a: 'You can track Dairy & Eggs, Produce, Meats, Bakery, Beverages, Frozen Foods, Medicine & Health products, Household cleaning supplies, and custom categories.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left text-sm font-bold text-white flex items-center justify-between hover:bg-stone-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-[#f78503] font-bold text-base">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Call to Action Banner */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-900/50 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f78503]/10 blur-[100px] pointer-events-none rounded-full"></div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to Stop Wasting Food & Save Money?
        </h2>
        <p className="text-sm text-stone-400 max-w-xl mx-auto">
          Join thousands of smart households and kitchens using ExpiryGuard to keep their inventory organized.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onNavigate && onNavigate(currentUser ? 'dashboard' : 'register')}
            className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-xl shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>{currentUser ? 'Go to My Dashboard' : 'Create Free Account Now'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}
