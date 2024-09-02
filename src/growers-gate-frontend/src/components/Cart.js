import React from "react";

/**
 * Cart Component
 *
 * This component is responsible for displaying the user's shopping cart.
 * It shows a list of items in the cart, total price, and checkout functionality.
 */
function Cart() {
  // TODO: Implement state management for cart items and total price
  const cartItems = [
    { id: 1, name: "Organic Apples", price: 5.99, quantity: 2 },
    { id: 2, name: "Fresh Carrots", price: 3.49, quantity: 1 },
  ];
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="text-lg font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
          <button className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300">
            Proceed to Checkout
          </button>
        </>
      )}
      {/* TODO: Implement checkout functionality */}
      {/* TODO: Integrate with backend API to fetch and update cart data */}
    </div>
  );
}

export default Cart;
