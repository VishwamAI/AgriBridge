import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import TwoFAManagement from './TwoFAManagement';

function ProfileManagement() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    userType: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);

  useEffect(() => {
    // TODO: Fetch user data from API
    // For now, we'll use mock data
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      userType: 'Customer'
    });
  }, []);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // TODO: Implement password change logic
    console.log('Password change requested');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Management</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <div className="flex items-center mb-2">
          <FaUser className="text-gray-500 mr-2" />
          <span>{user.name}</span>
        </div>
        <div className="flex items-center mb-2">
          <FaEnvelope className="text-gray-500 mr-2" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center">
          <FaUser className="text-gray-500 mr-2" />
          <span>{user.userType}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Security</h3>
        <button
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 mb-2"
        >
          <FaLock className="inline-block mr-2" />
          Change Password
        </button>
        {showPasswordChange && (
          <form onSubmit={handlePasswordChange} className="mt-2">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
            >
              Update Password
            </button>
          </form>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
        <button
          onClick={() => setShowTwoFA(!showTwoFA)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          <FaShieldAlt className="inline-block mr-2" />
          Manage 2FA
        </button>
        {showTwoFA && (
          <div className="mt-4">
            <TwoFAManagement />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileManagement;
