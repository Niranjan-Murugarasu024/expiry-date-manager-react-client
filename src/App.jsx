import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Check stored user session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('userData');
      const savedToken = localStorage.getItem('jwtToken');
      if (savedUser && savedToken) {
        setCurrentUser(JSON.parse(savedUser));
        setCurrentView('dashboard');
      }
    } catch (e) {
      console.error('Failed to parse saved user data:', e);
    }
  }, []);

  const handleNavigate = (view, extraData = null) => {
    if (view === 'edit-product' && extraData) {
      setSelectedProductId(extraData);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (data) => {
    if (data && data.user) {
      setCurrentUser(data.user);
    }
    // Redirect directly to Dashboard after successful authentication
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentView === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}
        {currentView === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onSuccess={handleAuthSuccess}
          />
        )}
        {currentView === 'register' && (
          <RegisterPage
            onNavigate={handleNavigate}
            onSuccess={handleAuthSuccess}
          />
        )}
        {currentView === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'add-product' && (
          <AddProductPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'edit-product' && (
          <EditProductPage
            productId={selectedProductId}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'how-it-works' && (
          <HowItWorksPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'features' && (
          <FeaturesPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
