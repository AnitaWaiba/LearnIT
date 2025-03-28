import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🌐 Public Pages
import OpeningPage from './Pages/OpeningPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ContactUs from './Pages/ContactUs';
import AboutUs from './Pages/AboutUs';

// 📚 Learning Pages
import Option from './Pages/Option';
import Home from './Pages/Introduction/Home';
import DailyQuests from './Pages/DailyQuests';

// 🧑‍💼 User Pages
import ProfilePage from './Pages/ProfilePage';
import EditProfile from './Pages/EditProfile';
import SettingsPage from './Pages/SettingsPage';
import HelpPage from './Pages/HelpPage';

// 🛠️ Admin Panel
import AdminDashboard from './Admin/AdminDashboard';
import ManageUsers from './Admin/ManageUsers';

// 🚀 App Entry
function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<OpeningPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />

        {/* 📚 Learning Content */}
        <Route path="/option" element={<Option />} />
        <Route path="/home" element={<Home />} />
        <Route path="/frontend" element={<div>Front-end Development Page</div>} />
        <Route path="/backend" element={<div>Back-end Development Page</div>} />
        <Route path="/dailyquests" element={<DailyQuests />} />

        {/* 👤 User Management */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* 🛠️ Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manageusers" element={<ManageUsers />} />

        {/* 🚫 404 Fallback */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
