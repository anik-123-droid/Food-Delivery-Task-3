import React, { useState } from 'react';
import { RestaurantProvider } from './context/RestaurantContext';
import MobileFrame from './components/MobileFrame';
import BottomNav from './components/BottomNav';

import PartnerWelcome from './pages/PartnerWelcome';
import PartnerLogin from './pages/PartnerLogin';
import PartnerSignup from './pages/PartnerSignup';
import PartnerDashboard from './pages/PartnerDashboard';
import MenuManager from './pages/MenuManager';
import PartnerOffers from './pages/PartnerOffers';
import PartnerAnalytics from './pages/PartnerAnalytics';
import PartnerProfile from './pages/PartnerProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome');

  const renderPage = () => {
    switch (activeTab) {
      case 'welcome':
        return <PartnerWelcome onNavigate={setActiveTab} />;
      case 'login':
        return <PartnerLogin onNavigate={setActiveTab} />;
      case 'signup':
        return <PartnerSignup onNavigate={setActiveTab} />;
      case 'dashboard':
        return <PartnerDashboard onNavigate={setActiveTab} />;
      case 'menu':
        return <MenuManager onNavigate={setActiveTab} />;
      case 'offers':
        return <PartnerOffers onNavigate={setActiveTab} />;
      case 'analytics':
        return <PartnerAnalytics onNavigate={setActiveTab} />;
      case 'profile':
        return <PartnerProfile onNavigate={setActiveTab} />;
      default:
        return <PartnerWelcome onNavigate={setActiveTab} />;
    }
  };

  const showBottomNav = ['dashboard', 'menu', 'offers', 'analytics', 'profile'].includes(activeTab);

  return (
    <RestaurantProvider>
      <MobileFrame bottomNav={showBottomNav && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}>
        <div key={activeTab} className="animate-page-enter flex-1 flex flex-col">
          {renderPage()}
        </div>
      </MobileFrame>
    </RestaurantProvider>
  );
}
