import React, { useState } from 'react';
import { loginUser } from '../utils/api';

export default function LoginPage({ onNavigate, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Basic Client Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccessMsg('Login successful! Redirecting...');
      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
      }
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data);
        } else if (onNavigate) {
          onNavigate('landing');
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-stone-950">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#f78503]/20 to-[#e5832e]/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10 bg-stone-900/90 border border-amber-900/40 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        
        {/* Header Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f78503] to-[#e5832e] p-0.5 mb-4 shadow-lg shadow-amber-900/40">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#f78503]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-stone-400">
            Sign in to access your ExpiryGuard pantry
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3.5 rounded-xl flex items-start gap-2 animate-shake">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-stone-950 border border-amber-900/50 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-stone-950 border border-amber-900/50 rounded-xl text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:border-[#f78503] focus:ring-1 focus:ring-[#f78503] transition-all"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#f78503] to-[#e5832e] shadow-lg shadow-amber-900/50 hover:shadow-amber-700/60 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer Navigation Switcher */}
        <div className="text-center text-xs text-stone-400 pt-2 border-t border-amber-900/30">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate && onNavigate('register')}
            className="font-semibold text-[#f78503] hover:underline focus:outline-none"
          >
            Create an Account
          </button>
        </div>

      </div>
    </div>
  );
}
