import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './DashboardOverview.module.css';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * DashboardOverview Component
 *
 * This component displays an overview of the user's dashboard, including:
 * - Quick access widgets for recent transactions, popular products, and delivery status
 * - A bar chart showing monthly sales data
 *
 * The component uses CSS modules for styling (imported from DashboardOverview.module.css)
 */
function DashboardOverview() {
  // Chart data configuration
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Chart options configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales',
      },
    },
  };

  return (
    <div className={styles.dashboardOverview}>
      <h2>Dashboard Overview</h2>
      {/* Quick access widgets section */}
      <div className={styles.quickAccessWidgets}>
        {/* Recent Transactions widget */}
        <div className={styles.widget}>
          <h3>Recent Transactions</h3>
          <ul>
            <li>Order #1234 - $50.00</li>
            <li>Order #1235 - $75.50</li>
            <li>Order #1236 - $30.25</li>
          </ul>
        </div>
        {/* Popular Products widget */}
        <div className={styles.widget}>
          <h3>Popular Products</h3>
          <ul>
            <li>Organic Apples</li>
            <li>Fresh Tomatoes</li>
            <li>Free-range Eggs</li>
          </ul>
        </div>
        {/* Delivery Status widget */}
        <div className={styles.widget}>
          <h3>Delivery Status</h3>
          <ul>
            <li>Order #1234 - In Transit</li>
            <li>Order #1235 - Delivered</li>
            <li>Order #1236 - Processing</li>
          </ul>
        </div>
      </div>
      {/* Sales chart section */}
      <div className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default DashboardOverview;
