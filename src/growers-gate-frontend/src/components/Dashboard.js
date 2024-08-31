import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartBar, FaShoppingCart, FaBox, FaTruck, FaSearch, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import styles from './Dashboard.module.css';

// Import components for different dashboard sections
import DashboardOverview from './DashboardOverview';
import Transactions from './Transactions';
import Cart from './Cart';
import Products from './Products';
import Delivery from './Delivery';

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
        return <DashboardOverview />;
      case 'transactions':
        return <Transactions />;
      case 'cart':
        return <Cart />;
      case 'products':
        return <Products />;
      case 'delivery':
        return <Delivery />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  /**
   * Function to toggle the circular menu visibility
   * This function is called when the user clicks on their profile icon
   */
  const toggleCircularMenu = () => {
    setShowCircularMenu(!showCircularMenu); // Toggle the menu visibility state
    setActiveMenuItem(null); // Reset the active menu item when toggling
  };

  /**
   * Function to handle clicks on circular menu items
   * This function is called when a user clicks on an item in the circular menu
   *
   * @param {string} item - The menu item that was clicked ('profile', 'settings', or 'logout')
   */
  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item); // Set the clicked item as active
    // Handle the click action for each menu item
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
    <div className={styles.dashboard}>
      {/* Sidebar navigation */}
      <div className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <ul>
            {/* Navigation links for different sections */}
            {/* Each link updates the activeTab state when clicked */}
            <li><Link to="#" onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? styles.active : ''}><FaHome className={styles.icon} /> Dashboard</Link></li>
            <li><Link to="#" onClick={() => setActiveTab('transactions')} className={activeTab === 'transactions' ? styles.active : ''}><FaChartBar className={styles.icon} /> Transactions</Link></li>
            <li><Link to="#" onClick={() => setActiveTab('cart')} className={activeTab === 'cart' ? styles.active : ''}><FaShoppingCart className={styles.icon} /> Cart</Link></li>
            <li><Link to="#" onClick={() => setActiveTab('products')} className={activeTab === 'products' ? styles.active : ''}><FaBox className={styles.icon} /> Products</Link></li>
            <li><Link to="#" onClick={() => setActiveTab('delivery')} className={activeTab === 'delivery' ? styles.active : ''}><FaTruck className={styles.icon} /> Delivery</Link></li>
          </ul>
        </nav>
      </div>
      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Header with search bar and user profile */}
        <div className={styles.header}>
          {/* Search bar */}
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search..." />
            <FaSearch className={styles.searchIcon} />
          </div>
          {/* User profile and circular menu */}
          <div className={styles.userProfileContainer}>
            {/* User profile icon that toggles the circular menu when clicked */}
            <div className={styles.userProfile} onClick={toggleCircularMenu}>
              <FaUser />
            </div>
            {/* Circular menu for user actions, only shown when showCircularMenu is true */}
            {showCircularMenu && (
              <div className={styles.circularMenu}>
                {/* Each menu item calls handleMenuItemClick when clicked */}
                <div className={`${styles.menuItem} ${activeMenuItem === 'profile' ? styles.active : ''}`} onClick={() => handleMenuItemClick('profile')}>
                  <FaUser /> Profile
                </div>
                <div className={`${styles.menuItem} ${activeMenuItem === 'settings' ? styles.active : ''}`} onClick={() => handleMenuItemClick('settings')}>
                  <FaCog /> Settings
                </div>
                <div className={`${styles.menuItem} ${activeMenuItem === 'logout' ? styles.active : ''}`} onClick={() => handleMenuItemClick('logout')}>
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Content area for rendering active tab content */}
        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
