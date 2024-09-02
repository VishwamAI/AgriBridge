import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaUser, FaHeadset, FaChartLine } from 'react-icons/fa';
import ProfileManagement from './ProfileManagement';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import config from '../config';

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
const ProfileUpdate = () => <ProfileManagement />;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ customer: '', product: '', quantity: '', status: 'Pending' });
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // This is a placeholder and should be replaced with actual API call
    // const response = await fetch('/api/farmer/orders');
    // const data = await response.json();
    // setOrders(data);
    setOrders([
      { id: 1, customer: 'John Doe', product: 'Tomatoes', quantity: 10, status: 'Pending' },
      { id: 2, customer: 'Jane Smith', product: 'Carrots', quantity: 5, status: 'Shipped' },
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // This is a placeholder and should be replaced with actual API call
    // await fetch('/api/farmer/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newOrder),
    // });
    setOrders([...orders, { ...newOrder, id: orders.length + 1 }]);
    setNewOrder({ customer: '', product: '', quantity: '', status: 'Pending' });
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setNewOrder(order);
  };

  const handleUpdate = async () => {
    // This is a placeholder and should be replaced with actual API call
    // await fetch(`/api/farmer/orders/${editingOrder.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newOrder),
    // });
    setOrders(orders.map(order => order.id === editingOrder.id ? newOrder : order));
    setEditingOrder(null);
    setNewOrder({ customer: '', product: '', quantity: '', status: 'Pending' });
  };

  const handleDelete = async (id) => {
    // This is a placeholder and should be replaced with actual API call
    // await fetch(`/api/farmer/orders/${id}`, { method: 'DELETE' });
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <form onSubmit={editingOrder ? handleUpdate : handleSubmit} className="mb-4">
        <input
          type="text"
          name="customer"
          value={newOrder.customer}
          onChange={handleInputChange}
          placeholder="Customer Name"
          className="p-2 border rounded mr-2"
          required
        />
        <input
          type="text"
          name="product"
          value={newOrder.product}
          onChange={handleInputChange}
          placeholder="Product"
          className="p-2 border rounded mr-2"
          required
        />
        <input
          type="number"
          name="quantity"
          value={newOrder.quantity}
          onChange={handleInputChange}
          placeholder="Quantity"
          className="p-2 border rounded mr-2"
          required
        />
        <select
          name="status"
          value={newOrder.status}
          onChange={handleInputChange}
          className="p-2 border rounded mr-2"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editingOrder ? 'Update Order' : 'Add Order'}
        </button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="p-2">Order ID</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Product</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
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
              <td className="p-2">
                <button onClick={() => handleEdit(order)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
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



ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [salesData, setSalesData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [salesResponse, productResponse, customerResponse] = await Promise.all([
        fetch(`${config.API_URL}/api/farmer/analytics/sales`, { headers }),
        fetch(`${config.API_URL}/api/farmer/analytics/products`, { headers }),
        fetch(`${config.API_URL}/api/farmer/analytics/customers`, { headers })
      ]);

      if (!salesResponse.ok || !productResponse.ok || !customerResponse.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [salesData, productData, customerData] = await Promise.all([
        salesResponse.json(),
        productResponse.json(),
        customerResponse.json()
      ]);

      setSalesData(salesData);
      setProductData(productData);
      setCustomerData(customerData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const salesChartData = {
    labels: salesData?.labels || [],
    datasets: [
      {
        label: 'Sales',
        data: salesData?.data || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const productChartData = {
    labels: productData?.labels || [],
    datasets: [
      {
        label: 'Top Products',
        data: productData?.data || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  const customerChartData = {
    labels: customerData?.labels || [],
    datasets: [
      {
        label: 'Customer Demographics',
        data: customerData?.data || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <h2 className="text-2xl font-bold mb-4">Analytics and Insights</h2>
        <p className="text-center">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <h2 className="text-2xl font-bold mb-4">Analytics and Insights</h2>
        <p className="text-center text-red-500">{error}</p>
        <button
          onClick={fetchAnalyticsData}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <h2 className="text-2xl font-bold mb-4">Analytics and Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Sales Over Time</h3>
          <Line data={salesChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Top Products</h3>
          <Bar data={productChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Customer Demographics</h3>
          <Pie data={customerChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
