import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key';

/**
 * Encrypts the given data
 * @param {string} data - The data to encrypt
 * @returns {string} The encrypted data
 */
export const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

/**
 * Decrypts the given encrypted data
 * @param {string} encryptedData - The data to decrypt
 * @returns {any} The decrypted data
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

/**
 * Hashes the given data using SHA256
 * @param {string} data - The data to hash
 * @returns {string} The hashed data
 */
export const hashData = (data) => {
  try {
    return CryptoJS.SHA256(data).toString();
  } catch (error) {
    console.error('Error hashing data:', error);
    return null;
  }
};

/**
 * Generates a random salt
 * @param {number} length - The length of the salt (default: 16)
 * @returns {string} The generated salt
 */
export const generateSalt = (length = 16) => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

/**
 * Encrypts data with a salt
 * @param {string} data - The data to encrypt
 * @param {string} salt - The salt to use
 * @returns {string} The encrypted data with salt
 */
export const encryptWithSalt = (data, salt) => {
  try {
    const saltedData = salt + data;
    return encryptData(saltedData);
  } catch (error) {
    console.error('Error encrypting data with salt:', error);
    return null;
  }
};

/**
 * Decrypts data that was encrypted with a salt
 * @param {string} encryptedData - The data to decrypt
 * @param {number} saltLength - The length of the salt used (default: 16)
 * @returns {string} The decrypted data without salt
 */
export const decryptWithSalt = (encryptedData, saltLength = 16) => {
  try {
    const decryptedData = decryptData(encryptedData);
    return decryptedData.slice(saltLength);
  } catch (error) {
    console.error('Error decrypting data with salt:', error);
    return null;
  }
};
