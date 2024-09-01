import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home Component
 *
 * This component serves as the landing page for the Growers Gate application.
 * It showcases the main features and benefits of the platform to attract both farmers and consumers.
 */
function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Growers Gate</Link>
          <div className="space-x-4">
            <Link to="/about" className="hover:text-green-200">About</Link>
            <Link to="/products" className="hover:text-green-200">Products</Link>
            <Link to="/login" className="hover:text-green-200">Login</Link>
            <Link to="/signup" className="bg-white text-green-600 px-4 py-2 rounded-full hover:bg-green-100">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section: Introduces the platform and provides call-to-action buttons */}
      <section className="bg-green-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Growers Gate</h1>
          <p className="text-xl mb-8">
            Connect directly with local farmers and get fresh produce delivered to your doorstep.
          </p>
          <div className="space-x-4">
            <Link to="/signup" className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-100">Sign Up</Link>
            <Link to="/about" className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section: Displays a carousel of featured products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {/* TODO: Replace with actual product data from API or state management */}
            {[1, 2, 3, 4, 5].map((product) => (
              <div key={product} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden">
                <img src={`https://via.placeholder.com/300x200?text=Product${product}`} alt={`Product ${product}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Product {product}</h3>
                  <p className="text-green-600 font-bold mb-2">$9.99</p>
                  <button className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">About Growers Gate</h2>
          <p className="text-xl mb-8">
            Growers Gate is on a mission to revolutionize the way people access fresh, local produce. We connect consumers directly with farmers, ensuring fair prices and supporting local agriculture.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p>To create a sustainable food ecosystem that benefits both farmers and consumers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p>A world where everyone has access to fresh, locally-sourced produce at fair prices.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <p>Sustainability, transparency, community support, and innovation in agriculture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p>Explore a wide range of fresh, locally-sourced produce from farmers in your area.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p>Select your desired products and place an order directly with the farmer.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Receive Fresh Produce</h3>
              <p>Get your order delivered to your doorstep or pick it up from a convenient location.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">"Growers Gate has transformed the way I source fresh produce for my restaurant. The quality is unmatched, and I love supporting local farmers."</p>
              <p className="font-semibold">- Chef Maria, Local Restaurant Owner</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">"As a small-scale farmer, Growers Gate has given me a platform to reach more customers and grow my business. It's been a game-changer."</p>
              <p className="font-semibold">- John, Organic Farmer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Using Growers Gate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">For Consumers</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Access to fresh, locally-sourced produce</li>
                <li>Support local farmers and communities</li>
                <li>Transparent pricing and sourcing</li>
                <li>Convenient delivery or pickup options</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">For Farmers</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Direct access to a wider customer base</li>
                <li>Fair pricing for your products</li>
                <li>Reduced waste through pre-orders</li>
                <li>Marketing and logistics support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-green-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">Subscribe to our newsletter for the latest updates, seasonal produce information, and exclusive offers.</p>
          <form className="max-w-md mx-auto">
            <div className="flex">
              <input type="email" placeholder="Enter your email" className="flex-grow px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-600" />
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-r-full hover:bg-green-700 transition duration-300">Subscribe</button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Growers Gate</h3>
              <p>Connecting farmers and consumers for a sustainable future.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-green-500">About Us</Link></li>
                <li><Link to="/products" className="hover:text-green-500">Products</Link></li>
                <li><Link to="/farmers" className="hover:text-green-500">Our Farmers</Link></li>
                <li><Link to="/faq" className="hover:text-green-500">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p>Email: info@growersgate.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-500">Facebook</a>
                <a href="#" className="hover:text-green-500">Twitter</a>
                <a href="#" className="hover:text-green-500">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 Growers Gate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
