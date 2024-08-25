import React, { useState, createContext } from 'react';
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

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const login = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

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
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/community-dashboard" element={<CommunityDashboard />} />
            <Route path="/payment" element={<PaymentIntegration />} />
            <Route path="/entertainment-dashboard" element={<EntertainmentDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
