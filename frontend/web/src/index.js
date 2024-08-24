import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Signup from './components/Signup';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import Logout from './components/Logout';
import FarmerDashboard from './components/FarmerDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import CommunityDashboard from './components/CommunityDashboard';
import EntertainmentDashboard from './components/EntertainmentDashboard';
import SocialMediaIntegration from './components/SocialMediaIntegration';
import DashboardLayout from './components/DashboardLayout';

function Home() {
  return (
    <Box p={8}>
      <h1>Welcome to Growers Gate</h1>
      <p>Connecting farmers and consumers for a sustainable future.</p>
    </Box>
  );
}

function Dashboard() {
  // Placeholder for user type (should be determined by authentication in the future)
  const userType = 'farmer'; // Can be 'farmer', 'admin', or 'user'

  if (userType === 'user') {
    return <UserDashboard />;
  } else if (userType === 'farmer') {
    return <FarmerDashboard />;
  } else if (userType === 'admin') {
    return <AdminDashboard />;
  }

  return null;
}

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/community-dashboard" element={<CommunityDashboard />} />
          <Route path="/entertainment-dashboard" element={<EntertainmentDashboard />} />
          <Route path="/social-media-integration" element={<SocialMediaIntegration />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
