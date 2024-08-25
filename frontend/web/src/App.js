import React from 'react';
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

function App() {
  return (
    <ChakraProvider>
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
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
