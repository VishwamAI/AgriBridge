import React from "react";
import { FaChartLine, FaUsers, FaShoppingCart } from "react-icons/fa";

function Analytics({ data }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="flex items-center">
            <FaChartLine className="text-blue-500 text-3xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-xl font-bold">${data?.totalSales || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="flex items-center">
            <FaUsers className="text-green-500 text-3xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="text-xl font-bold">{data?.newUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <div className="flex items-center">
            <FaShoppingCart className="text-yellow-500 text-3xl mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Orders</p>
              <p className="text-xl font-bold">{data?.activeOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>
      {/* TODO: Add more detailed analytics charts and graphs */}
    </div>
  );
}

export default Analytics;
