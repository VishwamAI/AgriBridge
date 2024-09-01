import React, { useState } from 'react';

/**
 * Transactions Component
 *
 * This component displays the user's transaction history in a responsive table layout.
 * It includes filtering options and is prepared for integration with a backend API.
 */
function Transactions() {
  const [filter, setFilter] = useState('all');

  // Mock transaction data (replace with API call in production)
  const transactions = [
    { id: 1, date: '2023-06-01', description: 'Organic Apples', amount: 15.99, status: 'completed' },
    { id: 2, date: '2023-06-03', description: 'Fresh Vegetables Bundle', amount: 25.50, status: 'processing' },
    { id: 3, date: '2023-06-05', description: 'Artisan Bread', amount: 7.99, status: 'completed' },
  ];

  const filteredTransactions = transactions.filter(transaction =>
    filter === 'all' || transaction.status === filter
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {/* Filter buttons */}
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('processing')}
          className={`px-4 py-2 rounded ${filter === 'processing' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Processing
        </button>
      </div>

      {/* Transactions table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-right">Amount</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{transaction.date}</td>
                <td className="py-3 px-6 text-left">{transaction.description}</td>
                <td className="py-3 px-6 text-right">${transaction.amount.toFixed(2)}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`${
                    transaction.status === 'completed' ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'
                  } py-1 px-3 rounded-full text-xs`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TODO: Implement pagination */}
      {/* TODO: Integrate with backend API to fetch real transaction data */}
    </div>
  );
}

export default Transactions;
