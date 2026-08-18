import React, { useState } from 'react';

export default function Header({ onNavigate, currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-stone-950/85 border-b border-amber-900/30 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div
            onClick={() => handleNav(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f78503] to-[#e5832e] p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#f78503]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-white via-amber-100 to-[#e5832e] bg-clip-text text-transparent tracking-tight">
                ExpiryGuard
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wider uppercase -mt-1">
                Pantry & Expiry Manager
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNav('landing')}
              className="text-stone-300 hover:text-white font-medium text-sm transition-colors"
            >
              Home
            </button>
            {currentUser && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="text-[#f78503] hover:text-amber-300 font-semibold text-sm transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('add-product')}
                  className="text-amber-200 hover:text-white font-semibold text-sm transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              </>
            )}
            <button
              onClick={() => handleNav('features')}
              className="text-stone-300 hover:text-white font-medium text-sm transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNav('how-it-works')}
              className="text-stone-300 hover:text-white font-medium text-sm transition-colors"
            >
              How It Works
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold text-amber-200 bg-amber-950/80 border border-amber-800/50 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {currentUser.name || currentUser.email}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white bg-stone-900 border border-stone-800 hover:border-red-900/60 hover:bg-red-950/40 rounded-xl transition-all shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-medium text-amber-200 hover:text-white transition-colors hover:bg-amber-900/20 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="relative group px-5 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden shadow-lg shadow-amber-900/40 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#f78503] to-[#e5832e] transition-all duration-300 group-hover:opacity-90"></span>
                  <span className="relative flex items-center gap-1.5">
                    Register Free
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-amber-900/30 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900/95 border-b border-amber-900/40 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNav('landing')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-200 hover:text-white hover:bg-amber-900/30"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('features')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-200 hover:text-white hover:bg-amber-900/30"
          >
            Features
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-200 hover:text-white hover:bg-amber-900/30"
          >
            How It Works
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-bold text-[#f78503] hover:bg-amber-900/30"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('add-product')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-amber-200 hover:bg-amber-900/30"
              >
                Add Product
              </button>
            </>
          )}
          {currentUser ? (
            <div className="pt-4 border-t border-amber-900/40 space-y-2">
              <div className="text-xs text-amber-300 font-semibold px-3">
                Logged in as: {currentUser.name || currentUser.email}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-center py-2.5 text-sm font-medium text-red-300 bg-red-950/40 border border-red-800/40 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-amber-900/40 flex flex-col space-y-2">
              <button
                onClick={() => handleNav('login')}
                className="w-full text-center py-2.5 text-sm font-medium text-amber-200 hover:text-white bg-amber-950/40 border border-amber-800/40 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('register')}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] rounded-lg shadow-lg shadow-amber-900/40"
              >
                Register Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
