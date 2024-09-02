import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';

const TOKEN_KEY = 'token';
const REFRESH_THRESHOLD = 2 * 60; // 2 minutes in seconds

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

export const refreshToken = async () => {
  try {
    const currentToken = getToken();
    if (!currentToken) throw new Error('No token found');

    const decodedToken = jwtDecode(currentToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp - currentTime > REFRESH_THRESHOLD) {
      return currentToken; // Token is still valid for more than 2 minutes
    }

    const response = await axios.post(`${config.API_URL}/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${currentToken}` }
    });

    const newToken = response.data.token;
    setToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    removeToken(); // Remove invalid token
    throw error;
  }
};

export const getAuthHeader = async () => {
  try {
    const token = await refreshToken();
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error('Error getting auth header:', error);
    throw error;
  }
};

export const setupTokenRefresh = () => {
  setInterval(async () => {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Auto token refresh failed:', error);
    }
  }, REFRESH_THRESHOLD * 1000); // Convert seconds to milliseconds
};
