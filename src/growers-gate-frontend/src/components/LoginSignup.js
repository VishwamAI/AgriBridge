/**
 * LoginSignup Component
 *
 * This component handles user authentication for both login and signup processes.
 * It provides a form for users to enter their credentials and switches between
 * login and signup modes. It also supports two-factor authentication.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For navigation and routing
import axios from 'axios'; // For making HTTP requests
import config from '../config'; // Application configuration
import styles from './LoginSignup.module.css'; // CSS modules for styling

function LoginSignup() {
  const navigate = useNavigate();

  // State variables for form inputs and component behavior
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup modes
  const [showTwoFactor, setShowTwoFactor] = useState(false); // Show 2FA input when required
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const [error, setError] = useState(null); // Error state for displaying messages

  /**
   * Handles form submission for both login and signup
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Handle login process
        const response = await axios.post(`${config.API_URL}/login`, { email, password });
        if (response.data.twoFactorRequired) {
          // If 2FA is required, show the 2FA input form
          setShowTwoFactor(true);
        } else {
          // TODO: Handle successful login (e.g., store token, redirect)
          console.log('Login successful', response.data);
        }
      } else {
        // Handle signup process
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const response = await axios.post(`${config.API_URL}/register`, {
          firstName,
          lastName,
          email,
          password,
          userType
        });
        console.log('Signup successful', response.data);
        // Switch to login mode after successful signup
        setIsLogin(true);
      }
    } catch (error) {
      // Set error message from the server response or use a generic error message
      setError(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the submission of the two-factor authentication code.
   * @param {Event} e - The form submission event.
   */
  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Send the 2FA code to the server for verification
      const response = await axios.post(`${config.API_URL}/verify-2fa`, { token: twoFactorCode });
      console.log('2FA Verification successful', response.data);
      // TODO: Store the authentication token from the response
      // Redirect to the dashboard upon successful verification
      navigate('/dashboard');
    } catch (error) {
      // Set an error message if 2FA verification fails
      setError(error.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the LoginSignup component
  return (
    <div className={styles.loginSignup}>
      {/* Dynamic title based on login or signup mode */}
      <h2 className={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h2>

      {/* Display error message if there's an error */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Conditional rendering based on whether 2FA is required */}
      {!showTwoFactor ? (
        // Main login/signup form
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Additional fields for signup */}
          {!isLogin && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  className={styles.input}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  className={styles.input}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          {/* Common fields for both login and signup */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Additional fields for signup */}
          {!isLogin && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={styles.input}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="userType" className={styles.label}>User Type:</label>
                <select
                  id="userType"
                  className={styles.input}
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="farmer">Farmer</option>
                  <option value="community">Community</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  I accept the terms and conditions
                </label>
              </div>
            </>
          )}
          {/* Submit button with dynamic text based on login/signup and loading state */}
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
      ) : (
        // Two-factor authentication form
        <form onSubmit={handleTwoFactorSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="twoFactorCode" className={styles.label}>Enter 2FA Code:</label>
            <input
              type="text"
              id="twoFactorCode"
              className={styles.input}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      )}
      {/* Toggle between login and signup modes */}
      <div className={styles.switchMode}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className={styles.switchButton}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </div>
      {/* Link to return to the home page */}
      <Link to="/" className={styles.backLink}>Back to Home</Link>
    </div>
  );
}

export default LoginSignup;
