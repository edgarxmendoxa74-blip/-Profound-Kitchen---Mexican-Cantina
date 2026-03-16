import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FloatingCartButton from './components/FloatingCartButton';
import Hero from './components/Hero';
import LocationSection from './components/LocationSection';
import EventsSection from './components/EventsSection';
import { useMenu } from './hooks/useMenu';
import StoreClosedPopup from './components/StoreClosedPopup';

import AdminDashboard from './components/AdminDashboard';

function MainApp() {
  const cart = useCart();
  const { menuItems, loading: menuLoading } = useMenu();
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout' | 'events' | 'contact'>('menu');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout') => {
    setCurrentView(view);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBuyNow = (item: any, quantity?: number, variation?: any, addOns?: any[]) => {
    cart.addToCart(item, quantity, variation, addOns);
    setCurrentView('checkout');
  };

  return (
    <div className="min-h-screen bg-brand-gray font-inter">
      <Header
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('menu')}
        onEventsClick={() => setCurrentView('events')}
        onFeedbackClick={() => window.open('https://forms.gle/mXqsDJo8f3uutbJ18', '_blank')}
        onContactClick={() => setCurrentView('contact')}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        showCategories={currentView === 'menu'}
      />



      {currentView === 'contact' && (
        <div className="pt-24 min-h-screen">
          <LocationSection onBackClick={() => setCurrentView('menu')} />
        </div>
      )}
      {currentView === 'menu' && (
        <div className="pt-32 md:pt-40">
          <Hero
            onEventsClick={() => setCurrentView('events')}
            onFeedbackClick={() => window.open('https://forms.gle/mXqsDJo8f3uutbJ18', '_blank')}
            onContactClick={() => setCurrentView('contact')}
          />
          <div id="menu-section" className="scroll-mt-32">
            <Menu
              menuItems={menuItems}
              addToCart={cart.addToCart}
              onBuyNow={handleBuyNow}
              selectedCategory={selectedCategory}
              loading={menuLoading}
            />
          </div>
        </div>
      )}

      {currentView === 'events' && (
        <div className="pt-24 min-h-screen">
          <EventsSection onBackClick={() => setCurrentView('menu')} />
        </div>
      )}

      {currentView === 'cart' && (
        <Cart
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.removeFromCart}
          clearCart={cart.clearCart}
          getTotalPrice={cart.getTotalPrice}
          getSubtotal={cart.getSubtotal}
          getDiscountTotal={cart.getDiscountTotal}
          appliedCoupon={cart.appliedCoupon}
          applyCoupon={cart.applyCoupon}
          removeCoupon={cart.removeCoupon}
          onContinueShopping={() => handleViewChange('menu')}
          onCheckout={() => handleViewChange('checkout')}
        />
      )}

      {currentView === 'checkout' && (
        <Checkout
          cartItems={cart.cartItems}
          appliedCoupon={cart.appliedCoupon}
          onBack={() => handleViewChange('cart')}
        />
      )}

      {currentView === 'menu' && (
        <FloatingCartButton
          itemCount={cart.getTotalItems()}
          onCartClick={() => handleViewChange('cart')}
        />
      )}

      <StoreClosedPopup />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Catch-all: redirect any unmatched path back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;