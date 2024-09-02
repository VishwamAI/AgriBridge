import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaHeadset,
  FaChartLine,
  FaCog,
} from "react-icons/fa";
import axios from "axios";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      case "support":
        return <SupportManagement />;
      case "analytics":
        return <AnalyticsReporting />;
      case "settings":
        return <SystemSettings />;
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
                  onClick={() => setActiveTab("users")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaUsers className="inline-block mr-2" /> Users
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "products" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaBox className="inline-block mr-2" /> Products
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("support")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "support" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaHeadset className="inline-block mr-2" /> Support
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "analytics" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaChartLine className="inline-block mr-2" /> Analytics
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "settings" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaCog className="inline-block mr-2" /> Settings
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

const ProductManagement = () => <div>Product Management Component</div>;
const OrderManagement = () => <div>Order Management Component</div>;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
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

const SupportManagement = () => <div>Support Management Component</div>;
const AnalyticsReporting = () => <div>Analytics and Reporting Component</div>;

const SystemSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("/api/admin/settings");
      setSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <form>
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={key}
              type="text"
              value={value}
              onChange={(e) =>
                setSettings({ ...settings, [key]: e.target.value })
              }
            />
          </div>
        ))}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
