import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getProfile } from './utils/api';
import { useProfileStore } from './Store/profileStore';

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
import LearnPage from './Pages/LearnPage';

// 👤 User Pages
import ProfilePage from './Pages/ProfilePage';
import EditProfile from './Pages/EditProfile';
import SettingsPage from './Pages/SettingsPage';
import HelpPage from './Pages/HelpPage';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';

// 🛠️ Admin
import AdminDashboard from './Admin/AdminDashboard';
import ManageUsers from './Admin/ManageUsers';

// 🧱 Layouts
import LearnLayout from './Components/LearnLayout';
import QuestLayout from './Components/QuestLayout';

function App() {
  const setCourses = useProfileStore((state) => state.setCourses);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getProfile();
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Failed to load profile courses', error);
      }
    };

    fetchCourses();
  }, [setCourses]);

  return (
    <Router>
      <Routes>
        {/* 🌐 Public */}
        <Route path="/" element={<OpeningPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />

        {/* 📚 Learning */}
        <Route path="/option" element={<Option />} />
        <Route
          path="/home"
          element={
            <LearnLayout>
              <Home />
            </LearnLayout>
          }
        />
        <Route path="/frontend" element={<div>Front-end Development Page</div>} />
        <Route path="/backend" element={<div>Back-end Development Page</div>} />
        <Route
          path="/dailyquests"
          element={
            <QuestLayout>
              <DailyQuests />
            </QuestLayout>
          }
        />
        <Route path="/learn" element={<LearnPage />} />

        {/* 👤 User */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* 🛠️ Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manageusers" element={<ManageUsers />} />

        {/* 🚫 404 */}
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
