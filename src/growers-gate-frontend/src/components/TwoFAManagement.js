import React, { useState } from 'react';
import { FaQrcode, FaKey, FaToggleOn, FaToggleOff } from 'react-icons/fa';

function TwoFAManagement() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);

  const handleToggle2FA = () => {
    // TODO: Implement API call to enable/disable 2FA
    setTwoFAEnabled(!twoFAEnabled);
    if (!twoFAEnabled) {
      setShowQRCode(true);
      generateBackupCodes();
    } else {
      setShowQRCode(false);
      setBackupCodes([]);
    }
  };

  const generateBackupCodes = () => {
    // TODO: Implement API call to generate backup codes
    const codes = Array.from({ length: 8 }, () => Math.random().toString(36).substr(2, 8));
    setBackupCodes(codes);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Two-Factor Authentication</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-medium text-gray-900">Enable 2FA</span>
            <button
              onClick={handleToggle2FA}
              className={`${
                twoFAEnabled ? 'bg-green-600' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              <span
                className={`${
                  twoFAEnabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
              {twoFAEnabled ? <FaToggleOn className="absolute right-1 text-white" /> : <FaToggleOff className="absolute left-1 text-gray-400" />}
            </button>
          </div>

          {twoFAEnabled && (
            <>
              {showQRCode && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Scan QR Code</h3>
                  <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                    <FaQrcode className="text-6xl text-gray-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Scan this QR code with your authenticator app to set up 2FA.
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Codes</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <FaKey className="text-gray-400 mr-2" />
                      <span className="font-mono">{code}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Save these backup codes in a secure place. You can use them to access your account if you lose your 2FA device.
                </p>
              </div>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={generateBackupCodes}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={!twoFAEnabled}
            >
              Generate New Backup Codes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFAManagement;
