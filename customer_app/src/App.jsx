import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import BottomNav from './components/BottomNav';

import UserWelcome from './pages/UserWelcome';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import RestaurantMenu from './pages/RestaurantMenu';
import Checkout from './pages/Checkout';
import LiveTracking from './pages/LiveTracking';
import UserProfile from './pages/UserProfile';
import DishDetail from './pages/DishDetail';
import PaymentPage from './pages/PaymentPage';
import UserRewards from './pages/UserRewards';

export default function App() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleSelectDish = (dish) => {
    setSelectedDish(dish);
    setActiveTab('dish-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRestaurant = (resto) => {
    setSelectedRestaurant(resto);
    setActiveTab('menu');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'welcome':
        return <UserWelcome onNavigate={setActiveTab} />;
      case 'login':
        return <UserLogin onNavigate={setActiveTab} />;
      case 'signup':
        return <UserSignup onNavigate={setActiveTab} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={setActiveTab} />;
      case 'home':
        return (
          <Home
            onNavigate={setActiveTab}
            onSelectDish={handleSelectDish}
            onSelectRestaurant={handleSelectRestaurant}
          />
        );
      case 'menu':
        return (
          <RestaurantMenu
            restaurant={selectedRestaurant}
            onNavigate={setActiveTab}
            onSelectDish={handleSelectDish}
          />
        );
      case 'dish-detail':
        return <DishDetail dish={selectedDish} onNavigate={setActiveTab} onSelectDish={setSelectedDish} />;
      case 'checkout':
        return <Checkout onNavigate={setActiveTab} />;
      case 'payment':
        return <PaymentPage onNavigate={setActiveTab} />;
      case 'tracking':
        return <LiveTracking onNavigate={setActiveTab} />;
      case 'rewards':
        return <UserRewards onNavigate={setActiveTab} />;
      case 'profile':
        return <UserProfile onNavigate={setActiveTab} />;
      default:
        return <UserWelcome onNavigate={setActiveTab} />;
    }
  };

  const showBottomNav = ['home', 'menu', 'dish-detail', 'checkout', 'tracking', 'profile'].includes(activeTab);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen min-h-[100dvh] w-full bg-[#182017] dark:bg-[#0E140D] flex justify-center text-slate-900 dark:text-slate-100">
          <div className="w-full max-w-md min-h-screen min-h-[100dvh] bg-[#FAF7EE] dark:bg-slate-900 shadow-2xl flex flex-col relative overflow-x-hidden">
            <main className="flex-1 flex flex-col">
              <div key={activeTab} className="animate-page-enter flex-1 flex flex-col min-h-full">
                {renderPage()}
              </div>
            </main>
            {showBottomNav && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
          </div>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
