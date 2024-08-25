import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginSystem from './components/LoginSystem';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import FarmerDashboard from './components/FarmerDashboard';
import CommunityDashboard from './components/CommunityDashboard';
import PaymentIntegration from './components/PaymentIntegration';
import EntertainmentDashboard from './components/EntertainmentDashboard';
import { getUserProfile } from './api';

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyTokenAndSetUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyTokenAndSetUser = async (token) => {
    try {
      const response = await getUserProfile();
      setIsLoggedIn(true);
      setUserType(response.data.userType);
    } catch (error) {
      console.error('Error verifying token:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (type, token) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (token) {
      localStorage.setItem('authToken', token);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('authToken');
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginSystem />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute userType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute userType="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer-dashboard"
              element={
                <ProtectedRoute userType="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community-dashboard"
              element={
                <ProtectedRoute userType="community">
                  <CommunityDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/payment" element={<PaymentIntegration />} />
            <Route path="/entertainment-dashboard" element={<EntertainmentDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

function ProtectedRoute({ children, userType }) {
  const { isLoggedIn, userType: currentUserType } = React.useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (currentUserType !== userType) {
    return <Navigate to="/" />;
  }

  return children;
}

export default App;
