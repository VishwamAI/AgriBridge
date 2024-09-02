import React, { useState } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaClipboardList,
  FaStar,
  FaCreditCard,
  FaHeart,
} from "react-icons/fa";
import ProfileManagement from "./ProfileManagement";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileManagement />;
      case "orders":
        return <OrderManagement />;
      case "cart":
        return <CartManagement />;
      case "reviews":
        return <ReviewManagement />;
      case "payments":
        return <PaymentManagement />;
      case "wishlist":
        return <WishlistManagement />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mr-4">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "profile" ? "bg-green-500 text-white" : "hover:bg-green-100"}`}
                >
                  <FaUser className="inline-block mr-2" /> Profile
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "orders" ? "bg-green-500 text-white" : "hover:bg-green-100"}`}
                >
                  <FaClipboardList className="inline-block mr-2" /> Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "cart" ? "bg-green-500 text-white" : "hover:bg-green-100"}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Cart
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "reviews" ? "bg-green-500 text-white" : "hover:bg-green-100"}`}
                >
                  <FaStar className="inline-block mr-2" /> Reviews
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "payments" ? "bg-green-500 text-white" : "hover:bg-green-100"}`}
                >
                  <FaCreditCard className="inline-block mr-2" /> Payments
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === "wishlist" ? "bg-green-500 text-white" : "hover:bg-green-100"}`}
                >
                  <FaHeart className="inline-block mr-2" /> Wishlist
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

// Placeholder components for other sections
const OrderManagement = () => <div>Order Management Component</div>;
const CartManagement = () => <div>Cart Management Component</div>;
const ReviewManagement = () => <div>Review Management Component</div>;
const PaymentManagement = () => <div>Payment Management Component</div>;
const WishlistManagement = () => <div>Wishlist Management Component</div>;

export default UserDashboard;
