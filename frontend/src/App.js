import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import OpeningPage from './OpeningPage';
import Signup from './Signup';
import Login from './Login';
import Option from './Option';
import Home from './Home';

// Admin Panel
import AdminDashboard from './AdminDashboard';
import ManageUsers from './ManageUsers';

// Optional components (not pages)
import Dashboard from './Dashboard';
import DailyQuests from './DailyQuests';
import StatusBar from './StatusBar';

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
