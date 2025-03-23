import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import OpeningPage from './Pages/OpeningPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Option from './Pages/Option';
import Home from './Pages/Introduction/Home';
import ContactUs from './Pages/ContactUs';

// Admin Panel
import AdminDashboard from './Admin/AdminDashboard';
import ManageUsers from './Admin/ManageUsers';

// Optional components (not pages)
import Dashboard from './Components/Dashboard';
import DailyQuests from './Pages/DailyQuests';
import StatusBar from './Components/StatusBar';
import ProfilePage from './Pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<OpeningPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Learning Pages */}
        <Route path="/option" element={<Option />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home" element={<div>Introduction of Computer Page</div>} />
        <Route path="/frontend" element={<div>Front-end Development Page</div>} />
        <Route path="/backend" element={<div>Back-end Development Page</div>} />
        <Route path="/dailyquests" element={<DailyQuests />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Dashboard & User Management */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manageusers" element={<ManageUsers />} />

        {/* 404 Not Found Fallback */}
        <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
