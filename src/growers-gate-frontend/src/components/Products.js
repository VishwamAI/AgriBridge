import React, { useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

/**
 * Products Component
 *
 * This component is responsible for displaying and managing product listings.
 * It includes a search bar, product grid, and placeholders for product management functionality.
 */
function Products() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock product data (replace with API call in production)
  const products = [
    { id: 1, name: 'Organic Apples', price: 5.99, stock: 100 },
    { id: 2, name: 'Fresh Carrots', price: 3.49, stock: 150 },
    { id: 3, name: 'Artisan Bread', price: 4.99, stock: 50 },
    // Add more mock products as needed
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 flex items-center">
          <FaPlus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition duration-300">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">Price: ${product.price.toFixed(2)}</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            <div className="mt-4 flex justify-between">
              <button className="text-blue-500 hover:text-blue-700">Edit</button>
              <button className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* TODO: Implement product detail view */}
      {/* TODO: Implement product management functionality (add, edit, delete) */}
      {/* TODO: Integrate with backend API to fetch and update product data */}
    </div>
  );
}

export default Products;
