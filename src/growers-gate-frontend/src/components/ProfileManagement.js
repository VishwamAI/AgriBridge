import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const TwoFAEducation = () => (
  <div className="bg-blue-100 p-4 rounded-md mb-4">
    <h4 className="text-lg font-semibold mb-2 flex items-center">
      <FaInfoCircle className="mr-2" />
      Two-Factor Authentication (2FA)
    </h4>
    <p className="mb-2">2FA adds an extra layer of security to your account by requiring two different forms of identification to log in.</p>
    <h5 className="font-semibold mt-2">Benefits:</h5>
    <ul className="list-disc list-inside mb-2">
      <li>Enhanced account security</li>
      <li>Protection against unauthorized access</li>
      <li>Mitigation of risks from password breaches</li>
    </ul>
    <h5 className="font-semibold mt-2">How to set up:</h5>
    <ol className="list-decimal list-inside mb-2">
      <li>Click the "Enable 2FA" button</li>
      <li>Scan the QR code with an authenticator app (e.g., Google Authenticator, Authy)</li>
      <li>Enter the 6-digit code from the app to verify</li>
    </ol>
    <p>Once enabled, you'll need to enter a code from your authenticator app each time you log in.</p>
  </div>
);

function ProfileManagement() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    userType: '',
    twoFactorEnabled: false
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFAQRCode, setTwoFAQRCode] = useState('');
  const [show2FAInfo, setShow2FAInfo] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await axios.post('/api/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Password changed successfully');
      setShowPasswordChange(false);
    } catch (error) {
      alert('Error changing password');
      console.error('Error changing password:', error);
    }
  };

  const handleToggle2FA = async () => {
    try {
      if (user.twoFactorEnabled) {
        await axios.post('/api/disable-2fa', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser({ ...user, twoFactorEnabled: false });
        setTwoFASecret('');
        setTwoFAQRCode('');
      } else {
        const response = await axios.post('/api/enable-2fa', {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTwoFASecret(response.data.secret);
        setTwoFAQRCode(response.data.qrCode);
        setShowTwoFA(true);
      }
    } catch (error) {
      alert('Error toggling 2FA');
      console.error('Error toggling 2FA:', error);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    const token = e.target.token.value;
    try {
      await axios.post('/api/verify-2fa', { token }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser({ ...user, twoFactorEnabled: true });
      setShowTwoFA(false);
      alert('2FA enabled successfully');
    } catch (error) {
      alert('Error verifying 2FA token');
      console.error('Error verifying 2FA token:', error);
    }
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
              name="currentPassword"
              placeholder="Current Password"
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full p-2 mb-2 border rounded"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full p-2 mb-2 border rounded"
              required
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
          onClick={() => setShow2FAInfo(!show2FAInfo)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mr-2"
        >
          <FaInfoCircle className="inline-block mr-2" />
          {show2FAInfo ? 'Hide 2FA Info' : 'Learn about 2FA'}
        </button>
        <button
          onClick={handleToggle2FA}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          <FaShieldAlt className="inline-block mr-2" />
          {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
        {show2FAInfo && <TwoFAEducation />}
        {showTwoFA && !user.twoFactorEnabled && (
          <div className="mt-4">
            <p>Scan this QR code with your authenticator app:</p>
            <img src={twoFAQRCode} alt="2FA QR Code" className="my-4" />
            <p>Or enter this secret manually: {twoFASecret}</p>
            <form onSubmit={handleVerify2FA} className="mt-4">
              <input
                type="text"
                name="token"
                placeholder="Enter 2FA Token"
                className="w-full p-2 mb-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                Verify and Enable 2FA
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileManagement;
