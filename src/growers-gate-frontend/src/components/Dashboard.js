import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaShoppingCart, FaBox, FaTruck, FaSearch, FaUser, FaCog, FaSignOutAlt, FaUsers, FaChartLine, FaDollarSign, FaUserPlus, FaShoppingBasket } from 'react-icons/fa';

// Import components for different dashboard sections
import DashboardOverview from './DashboardOverview';
import Transactions from './Transactions';
import Cart from './Cart';
import Products from './Products';
import Delivery from './Delivery';
import Analytics from './Analytics';
import UserManagement from './UserManagement';

/**
 * Dashboard component
 *
 * This component serves as the main dashboard interface for the Growers Gate application.
 * It provides navigation to different sections and renders the appropriate content based on the active tab.
 * The component includes a sidebar for navigation, a header with a search bar and user profile,
 * and a main content area that displays the active section's content.
 */
function Dashboard() {
  // State for managing the active tab in the dashboard
  const [activeTab, setActiveTab] = useState('dashboard');
  // State for controlling the visibility of the circular menu
  const [showCircularMenu, setShowCircularMenu] = useState(false);
  // State for tracking the active item in the circular menu
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState(null);
  // State for user list
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Fetch analytics data
    const fetchAnalyticsData = async () => {
      // TODO: Replace with actual API call
      const mockData = {
        totalSales: 10000,
        newUsers: 50,
        activeOrders: 25
      };
      setAnalyticsData(mockData);
    };

    // Fetch user list
    const fetchUserList = async () => {
      // TODO: Replace with actual API call
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Farmer' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer' },
      ];
      setUserList(mockUsers);
    };

    fetchAnalyticsData();
    fetchUserList();
  }, []);

  /**
   * Renders the appropriate content based on the active tab
   * This function uses a switch statement to determine which component to render
   * based on the current value of the activeTab state.
   *
   * @returns {JSX.Element} The component corresponding to the active tab
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview analyticsData={analyticsData} />;
      case 'transactions':
        return <Transactions />;
      case 'cart':
        return <Cart />;
      case 'products':
        return <Products />;
      case 'delivery':
        return <Delivery />;
      case 'analytics':
        return <Analytics data={analyticsData} />;
      case 'users':
        return <UserManagement users={userList} />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  /**
   * Function to toggle the circular menu visibility
   * This function is called when the user clicks on their profile icon
   */
  const toggleCircularMenu = () => {
    setShowCircularMenu(!showCircularMenu);
    setActiveMenuItem(null);
  };

  /**
   * Function to handle clicks on circular menu items
   * This function is called when a user clicks on an item in the circular menu
   *
   * @param {string} item - The menu item that was clicked ('profile', 'settings', or 'logout')
   */
  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
    switch (item) {
      case 'profile':
        // TODO: Implement navigation to profile page
        console.log('Navigate to profile page');
        break;
      case 'settings':
        // TODO: Implement navigation to settings page
        console.log('Navigate to settings page');
        break;
      case 'logout':
        // TODO: Implement logout functionality
        console.log('Perform logout action');
        break;
      default:
        break;
    }
  };

  // Render the Dashboard component
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-white shadow-md md:h-screen">
        <nav className="mt-5">
          <ul>
            {/* Navigation links for different sections */}
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('dashboard')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'dashboard' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaHome className="mr-3" /> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('transactions')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'transactions' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaChartBar className="mr-3" /> Transactions
              </Link>
            </li>
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('cart')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'cart' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaShoppingCart className="mr-3" /> Cart
              </Link>
            </li>
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('products')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'products' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaBox className="mr-3" /> Products
              </Link>
            </li>
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('delivery')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'delivery' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaTruck className="mr-3" /> Delivery
              </Link>
            </li>
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('analytics')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'analytics' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaChartLine className="mr-3" /> Analytics
              </Link>
            </li>
            <li className="mb-2">
              <Link to="#" onClick={() => setActiveTab('users')} className={`flex items-center px-4 py-2 text-gray-700 ${activeTab === 'users' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}>
                <FaUsers className="mr-3" /> Users
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with search bar and user profile */}
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Search bar */}
            <div className="relative">
              <input type="text" placeholder="Search..." className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            {/* User profile and circular menu */}
            <div className="relative">
              {/* User profile icon that toggles the circular menu when clicked */}
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white cursor-pointer" onClick={toggleCircularMenu}>
                <FaUser />
              </div>
              {/* Circular menu for user actions, only shown when showCircularMenu is true */}
              {showCircularMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  {/* Each menu item calls handleMenuItemClick when clicked */}
                  <div className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${activeMenuItem === 'profile' ? 'bg-gray-100' : ''}`} onClick={() => handleMenuItemClick('profile')}>
                    <FaUser className="inline-block mr-2" /> Profile
                  </div>
                  <div className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${activeMenuItem === 'settings' ? 'bg-gray-100' : ''}`} onClick={() => handleMenuItemClick('settings')}>
                    <FaCog className="inline-block mr-2" /> Settings
                  </div>
                  <div className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${activeMenuItem === 'logout' ? 'bg-gray-100' : ''}`} onClick={() => handleMenuItemClick('logout')}>
                    <FaSignOutAlt className="inline-block mr-2" /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Content area for rendering active tab content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {/* Summary section */}
          <div className="bg-white shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Dashboard Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaDollarSign className="text-green-500 text-3xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-xl font-bold">${analyticsData?.totalSales || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaUserPlus className="text-blue-500 text-3xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">New Users</p>
                    <p className="text-xl font-bold">{analyticsData?.newUsers || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <FaShoppingBasket className="text-yellow-500 text-3xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Active Orders</p>
                    <p className="text-xl font-bold">{analyticsData?.activeOrders || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
