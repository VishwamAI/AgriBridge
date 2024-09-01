import React, { useState } from 'react';
import { FaBox, FaShoppingCart, FaUsers, FaHeadset, FaChartLine } from 'react-icons/fa';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'support':
        return <SupportManagement />;
      case 'analytics':
        return <AnalyticsReporting />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mr-4">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                >
                  <FaBox className="inline-block mr-2" /> Products
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                >
                  <FaUsers className="inline-block mr-2" /> Users
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('support')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'support' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                >
                  <FaHeadset className="inline-block mr-2" /> Support
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
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
const UserManagement = () => <div>User Management Component</div>;
const SupportManagement = () => <div>Support Management Component</div>;
const AnalyticsReporting = () => <div>Analytics and Reporting Component</div>;

export default AdminDashboard;
