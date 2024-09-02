import React, { useState, useEffect } from 'react';
import { FaUser, FaBox, FaShoppingCart, FaCreditCard, FaStar, FaComments, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

function CommunityDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'cart':
        return <CartManagement />;
      case 'checkout':
        return <CheckoutProcess />;
      case 'payments':
        return <PaymentManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'forums':
        return <CommunityForums />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Community Dashboard</h1>
        <div className="flex flex-col md:flex-row">
          <nav className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 mb-4 md:mr-4">
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'profile' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaUser className="inline-block mr-2" /> Profile
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'products' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaBox className="inline-block mr-2" /> Products
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Orders
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('cart')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'cart' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaShoppingCart className="inline-block mr-2" /> Cart
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'checkout' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaCreditCard className="inline-block mr-2" /> Checkout
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'payments' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaCreditCard className="inline-block mr-2" /> Payments
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'reviews' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaStar className="inline-block mr-2" /> Reviews
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => setActiveTab('forums')}
                  className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'forums' ? 'bg-green-500 text-white' : 'hover:bg-green-100'}`}
                >
                  <FaComments className="inline-block mr-2" /> Forums
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

const ProfileManagement = () => {
  const [user, setUser] = useState({});
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUser(response.data);
      setTwoFAEnabled(response.data.twoFAEnabled);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const toggle2FA = async () => {
    try {
      const response = await axios.post('/api/user/toggle2fa');
      setTwoFAEnabled(response.data.twoFAEnabled);
    } catch (error) {
      console.error('Error toggling 2FA:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Two-Factor Authentication</h3>
        <button
          onClick={toggle2FA}
          className={`px-4 py-2 rounded ${twoFAEnabled ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          <FaShieldAlt className="inline-block mr-2" />
          {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
      </div>
    </div>
  );
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      <ul>
        {products.map(product => (
          <li key={product.id} className="mb-2">{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id} className="mb-2">Order #{order.id} - Status: {order.status}</li>
        ))}
      </ul>
    </div>
  );
};

const CartManagement = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cart Management</h2>
      <ul>
        {cartItems.map(item => (
          <li key={item.id} className="mb-2">{item.product.name} - Quantity: {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

const CheckoutProcess = () => {
  const checkoutSteps = ['cart', 'shipping', 'payment', 'confirmation'];
  const [currentStep, setCurrentStep] = useState('cart');

  const handleNextStep = () => {
    const currentIndex = checkoutSteps.indexOf(currentStep);
    if (currentIndex < checkoutSteps.length - 1) {
      setCurrentStep(checkoutSteps[currentIndex + 1]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Checkout Process</h2>
      <div className="flex justify-between mb-4">
        {checkoutSteps.map((step, index) => (
          <div key={step} className={`${currentStep === step ? 'font-bold' : ''}`}>
            {index + 1}. {step.charAt(0).toUpperCase() + step.slice(1)}
          </div>
        ))}
      </div>
      {/* Placeholder for step content */}
      <div className="mb-4">Current Step: {currentStep}</div>
      <button onClick={handleNextStep} className="bg-green-500 text-white px-4 py-2 rounded">
        Next Step
      </button>
    </div>
  );
};

const PaymentManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({ type: '', details: '' });

  useEffect(() => {
    // Fetch payment methods from API
    // This is a placeholder and should be replaced with actual API call
    setPaymentMethods([
      { id: 1, type: 'Credit Card', details: '**** **** **** 1234' },
      { id: 2, type: 'PayPal', details: 'user@example.com' },
    ]);
  }, []);

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    // Add new payment method to API
    // This is a placeholder and should be replaced with actual API call
    setPaymentMethods([...paymentMethods, { ...newPaymentMethod, id: paymentMethods.length + 1 }]);
    setNewPaymentMethod({ type: '', details: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
      <ul className="mb-4">
        {paymentMethods.map((method) => (
          <li key={method.id} className="mb-2">
            {method.type}: {method.details}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddPaymentMethod}>
        <input
          type="text"
          placeholder="Payment Type"
          value={newPaymentMethod.type}
          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Payment Details"
          value={newPaymentMethod.details}
          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, details: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Payment Method
        </button>
      </form>
    </div>
  );
};

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ productId: '', rating: 5, comment: '' });

  useEffect(() => {
    // Fetch reviews from API
    // This is a placeholder and should be replaced with actual API call
    setReviews([
      { id: 1, productId: 'P1', rating: 4, comment: 'Great product!' },
      { id: 2, productId: 'P2', rating: 5, comment: 'Excellent service!' },
    ]);
  }, []);

  const handleAddReview = (e) => {
    e.preventDefault();
    // Add new review to API
    // This is a placeholder and should be replaced with actual API call
    setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
    setNewReview({ productId: '', rating: 5, comment: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Review Management</h2>
      <ul className="mb-4">
        {reviews.map((review) => (
          <li key={review.id} className="mb-2">
            Product ID: {review.productId}, Rating: {review.rating}, Comment: {review.comment}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddReview}>
        <input
          type="text"
          placeholder="Product ID"
          value={newReview.productId}
          onChange={(e) => setNewReview({ ...newReview, productId: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          className="border p-2 mr-2"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>{rating}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Comment"
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Review
        </button>
      </form>
    </div>
  );
};

const CommunityForums = () => {
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    // Fetch forums from API
    // This is a placeholder and should be replaced with actual API call
    setForums([
      { id: 1, name: 'General Discussion', posts: [] },
      { id: 2, name: 'Farming Tips', posts: [] },
    ]);
  }, []);

  const handleSelectForum = (forum) => {
    setSelectedForum(forum);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (selectedForum) {
      // Add new post to API
      // This is a placeholder and should be replaced with actual API call
      const updatedForums = forums.map(forum =>
        forum.id === selectedForum.id
          ? { ...forum, posts: [...forum.posts, { ...newPost, id: forum.posts.length + 1 }] }
          : forum
      );
      setForums(updatedForums);
      setNewPost({ title: '', content: '' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Community Forums</h2>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <h3 className="text-xl font-bold mb-2">Forums</h3>
          <ul>
            {forums.map((forum) => (
              <li
                key={forum.id}
                onClick={() => handleSelectForum(forum)}
                className={`cursor-pointer p-2 ${selectedForum?.id === forum.id ? 'bg-gray-200' : ''}`}
              >
                {forum.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3">
          {selectedForum && (
            <>
              <h3 className="text-xl font-bold mb-2">{selectedForum.name}</h3>
              <ul className="mb-4">
                {selectedForum.posts.map((post) => (
                  <li key={post.id} className="mb-2">
                    <h4 className="font-bold">{post.title}</h4>
                    <p>{post.content}</p>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleAddPost}>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="border p-2 mr-2 w-full mb-2"
                />
                <textarea
                  placeholder="Post Content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="border p-2 mr-2 w-full mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add Post
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;
