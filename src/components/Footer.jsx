import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-amber-900/30 text-stone-400 py-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-[#f78503]/10 to-[#e5832e]/10 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f78503] to-[#e5832e] p-0.5">
                <div className="w-full h-full bg-stone-950 rounded-[6px] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#f78503]"
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
              <span className="text-lg font-bold bg-gradient-to-r from-white to-[#e5832e] bg-clip-text text-transparent">
                ExpiryGuard
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Smart expiry tracking & camera barcode scanner to save money, minimize food waste, and keep your pantry fresh.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-amber-300 transition-colors">
                  Bar Code Scanner
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-300 transition-colors">
                  Expiry Alerts
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-amber-300 transition-colors">
                  Smart Inventory
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Account */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Account
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#login" className="hover:text-amber-300 transition-colors">
                  Sign In
                </a>
              </li>
              <li>
                <a href="#register" className="hover:text-amber-300 transition-colors">
                  Create Account
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Technology */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Built With
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Powered by React 19, Vite, Tailwind CSS, and AI-assisted item detection.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-[11px] text-amber-300">
              <span className="w-2 h-2 rounded-full bg-[#f78503] animate-pulse"></span>
              Live Expiry Radar Active
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} ExpiryGuard. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-stone-400 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-stone-400 transition-colors cursor-pointer">
              Security
            </span>
            <span className="hover:text-stone-400 transition-colors cursor-pointer">
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
