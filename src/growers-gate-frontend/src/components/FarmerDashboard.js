import React, { useState, useEffect } from 'react';
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
const ProfileUpdate = () => <div>Profile Update Component</div>;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from API
    // This is a placeholder and should be replaced with actual API call
    const fetchOrders = async () => {
      // const response = await fetch('/api/farmer/orders');
      // const data = await response.json();
      // setOrders(data);
      setOrders([
        { id: 1, customer: 'John Doe', product: 'Tomatoes', quantity: 10, status: 'Pending' },
        { id: 2, customer: 'Jane Smith', product: 'Carrots', quantity: 5, status: 'Shipped' },
      ]);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-2">Order ID</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Product</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.customer}</td>
              <td className="p-2">{order.product}</td>
              <td className="p-2">{order.quantity}</td>
              <td className="p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SupportRequest = () => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ subject: '', message: '' });

  useEffect(() => {
    // Fetch support requests from API
    // This is a placeholder and should be replaced with actual API call
    const fetchRequests = async () => {
      // const response = await fetch('/api/farmer/support-requests');
      // const data = await response.json();
      // setRequests(data);
      setRequests([
        { id: 1, subject: 'Delivery Issue', message: 'My order was not delivered on time.', status: 'Open' },
        { id: 2, subject: 'Product Quality', message: 'The vegetables I received were not fresh.', status: 'Closed' },
      ]);
    };
    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit new request to API
    // This is a placeholder and should be replaced with actual API call
    // const response = await fetch('/api/farmer/support-requests', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newRequest),
    // });
    // const data = await response.json();
    setRequests([...requests, { ...newRequest, id: requests.length + 1, status: 'Open' }]);
    setNewRequest({ subject: '', message: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Support Requests</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="subject"
          value={newRequest.subject}
          onChange={handleInputChange}
          placeholder="Subject"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          name="message"
          value={newRequest.message}
          onChange={handleInputChange}
          placeholder="Message"
          className="w-full p-2 mb-2 border rounded"
          required
        ></textarea>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit Request
        </button>
      </form>
      <h3 className="text-xl font-bold mb-2">Previous Requests</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-2">ID</th>
            <th className="p-2">Subject</th>
            <th className="p-2">Message</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b">
              <td className="p-2">{request.id}</td>
              <td className="p-2">{request.subject}</td>
              <td className="p-2">{request.message}</td>
              <td className="p-2">{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Analytics = () => <div>Analytics Component</div>;

export default FarmerDashboard;
