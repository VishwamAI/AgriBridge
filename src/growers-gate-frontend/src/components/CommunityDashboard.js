import React, { useState } from 'react';
import { FaUser, FaBox, FaShoppingCart, FaCreditCard, FaStar, FaComments } from 'react-icons/fa';

function CommunityDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'cart':
        return <CartManagement />;
      case 'checkout':
        return <CheckoutProcess />;
      case 'payments':
        return <PaymentManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'forums':
        return <CommunityForums />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Community Dashboard</h1>
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mr-4">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaUser className="inline-block mr-2" /> Profile
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaBox className="inline-block mr-2" /> Products
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('cart')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'cart' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Cart
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'checkout' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaCreditCard className="inline-block mr-2" /> Checkout
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'payments' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaCreditCard className="inline-block mr-2" /> Payments
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'reviews' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaStar className="inline-block mr-2" /> Reviews
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('forums')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'forums' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaComments className="inline-block mr-2" /> Forums
                </button>
              </li>
            </ul>
          </nav>
          <main className="flex-1 bg-white shadow-md rounded-lg p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

// Placeholder components for each section
const ProfileManagement = () => <div>Profile Management Component</div>;
const ProductManagement = () => <div>Product Management Component</div>;
const OrderManagement = () => <div>Order Management Component</div>;
const CartManagement = () => <div>Cart Management Component</div>;
const CheckoutProcess = () => <div>Checkout Process Component</div>;
const PaymentManagement = () => <div>Payment Management Component</div>;
const ReviewManagement = () => <div>Review Management Component</div>;
const CommunityForums = () => <div>Community Forums Component</div>;

export default CommunityDashboard;
