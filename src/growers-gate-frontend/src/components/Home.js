import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

/**
 * Home Component
 *
 * This component serves as the landing page for the Growers Gate application.
 * It showcases the main features and benefits of the platform to attract both farmers and consumers.
 */
function Home() {
  return (
    <div className={styles.home}>
      {/* Hero Section: Introduces the platform and provides call-to-action buttons */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Growers Gate</h1>
          <p className={styles.heroDescription}>
            Connect directly with local farmers and get fresh produce delivered to your doorstep.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.ctaButton}>Sign Up</Link>
            <Link to="/about" className={styles.ctaButton}>Learn More</Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section: Displays a carousel of featured products */}
      <section className={styles.featuredProducts}>
        <h2>Featured Products</h2>
        <div className={styles.carousel}>
          {/* TODO: Replace with actual product data from API or state management */}
          {[1, 2, 3, 4, 5].map((product) => (
            <div key={product} className={styles.productCard}>
              <img src={`https://via.placeholder.com/150?text=Product${product}`} alt={`Product ${product}`} />
              <h3>Product {product}</h3>
              <p>$9.99</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      {/* Placeholder sections for future content */}
      <section className={styles.aboutUs}>
        {/* TODO: Add content about Growers Gate's mission and values */}
      </section>

      <section className={styles.howItWorks}>
        {/* TODO: Explain the process of using Growers Gate for both farmers and consumers */}
      </section>

      <section className={styles.testimonials}>
        {/* TODO: Add testimonials or featured farmer stories */}
      </section>

      <section className={styles.benefits}>
        {/* TODO: List the benefits of using Growers-Gate for farmers and consumers */}
      </section>

      <section className={styles.newsletter}>
        {/* TODO: Implement newsletter signup form */}
      </section>

      <footer className={styles.footer}>
        {/* TODO: Add footer content (links, copyright, etc.) */}
      </footer>
    </div>
  );
}

export default Home;
