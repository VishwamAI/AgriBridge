import React, { useState, useEffect, useCallback } from "react";
import {
  FaClipboardList,
  FaUser,
  FaHeadset,
  FaBell,
  FaChartLine,
  FaCreditCard,
} from "react-icons/fa";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001"; // Replace with your actual API base URL

function RiderDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderManagement />;
      case "profile":
        return <ProfileManagement />;
      case "support":
        return <SupportRequest />;
      case "notifications":
        return <Notifications />;
      case "analytics":
        return <Analytics />;
      case "payments":
        return <PaymentManagement />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Rider Dashboard</h1>
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mr-4">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "orders" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaClipboardList className="inline-block mr-2" /> Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "profile" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaUser className="inline-block mr-2" /> Profile
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
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "notifications" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaBell className="inline-block mr-2" /> Notifications
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
                  onClick={() => setActiveTab("payments")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "payments" ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
                >
                  <FaCreditCard className="inline-block mr-2" /> Payments
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

const OTPVerification = ({ onVerify, verificationError }) => {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");

  const validateOTP = (input) => {
    return /^\d{6}$/.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validateOTP(otp)) {
      setLocalError("OTP must be a 6-digit number");
      return;
    }

    try {
      await onVerify(otp);
    } catch (error) {
      setLocalError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="Enter 6-digit OTP"
        className="border rounded p-2 mr-2"
        maxLength={6}
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Verify OTP
      </button>
      {(localError || verificationError) && (
        <p className="text-red-500 mt-2">{localError || verificationError}</p>
      )}
    </form>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setError("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-rider-otp`,
        { orderId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setOtp(response.data.otp);
      setShowOTP(true);
      setSelectedOrder((prevOrder) => ({
        ...prevOrder,
        pendingStatus: newStatus,
      }));
    } catch (err) {
      setError("Failed to generate OTP. Please try again.");
      console.error("Error generating OTP:", err);
    }
  };

  const handleOTPVerify = async (enteredOtp) => {
    setError("");
    try {
      if (enteredOtp !== otp) {
        throw new Error("Invalid OTP");
      }
      await axios.post(
        `${API_BASE_URL}/update-order-status`,
        {
          orderId: selectedOrder.id,
          newStatus: selectedOrder.pendingStatus,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: selectedOrder.pendingStatus }
            : order,
        ),
      );
      setShowOTP(false);
      setSelectedOrder(null);
      setOtp("");
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
      console.error("Error verifying OTP:", err);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Current and Upcoming Deliveries
          </h3>
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-100 p-4 rounded-lg mb-2">
              <p>
                Order #{order.id} - {order.status}
              </p>
              <button
                onClick={() => setSelectedOrder(order)}
                className="text-blue-500 hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        {selectedOrder && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Order Details</h3>
            <p>Address: {selectedOrder.address}</p>
            <p>Contact: {selectedOrder.contact}</p>
            <div className="mt-4">
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateOrderStatus(selectedOrder.id, e.target.value)
                }
                className="border rounded p-2"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            {showOTP && <OTPVerification onVerify={handleOTPVerify} />}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileManagement = () => <div>Profile Management Component</div>;
const SupportRequest = () => <div>Support Request Component</div>;
const Notifications = () => <div>Notifications Component</div>;
const Analytics = () => <div>Analytics Component</div>;

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(`${API_BASE_URL}/rider/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError(`Failed to fetch payment details: ${err.message}`);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div>Loading payment details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2">Date</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">
                {new Date(payment.date).toLocaleDateString()}
              </td>
              <td className="p-2">${payment.amount.toFixed(2)}</td>
              <td className="p-2">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiderDashboard;
