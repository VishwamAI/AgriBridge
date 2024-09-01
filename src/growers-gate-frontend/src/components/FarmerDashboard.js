import React, { useState } from 'react';
import { FaBox, FaShoppingCart, FaUser, FaHeadset, FaChartLine } from 'react-icons/fa';

function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'profile':
        return <ProfileUpdate />;
      case 'support':
        return <SupportRequest />;
      case 'analytics':
        return <Analytics />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Farmer Dashboard</h1>
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mr-4">
            <ul>
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
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaUser className="inline-block mr-2" /> Profile
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'support' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaHeadset className="inline-block mr-2" /> Support
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaChartLine className="inline-block mr-2" /> Analytics
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
const ProductManagement = () => <div>Product Management Component</div>;
const OrderManagement = () => <div>Order Management Component</div>;
const ProfileUpdate = () => <div>Profile Update Component</div>;
const SupportRequest = () => <div>Support Request Component</div>;
const Analytics = () => <div>Analytics Component</div>;

export default FarmerDashboard;
