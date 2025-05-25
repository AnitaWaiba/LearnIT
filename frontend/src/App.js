import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getProfile } from './utils/api';
import { useProfileStore } from './Store/profileStore';

// 🌐 Public Pages
import OpeningPage from './Pages/OpeningPage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import ForgotPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';
import ContactUs from './Pages/ContactUs';
import AboutUs from './Pages/AboutUs';
import Terms from './Pages/Terms';
import Privacy from './Pages/Privacy';

// 📚 Learning Flow
import Option from './Pages/Option';
import LevelSelectionPage from './Components/LevelSelectionPage';
import LearnPage from './Components/LearnPage';
import LessonPage from './Components/LessonPage';
import LearnLayout from './Components/LearnLayout';

// 🎯 Gamified Features
import DailyQuests from './Pages/DailyQuests';
import LeaderboardPage from './Pages/LeaderboardPage';
import QuestLayout from './Components/QuestLayout';

// 👤 User Profile & Settings
import ProfilePage from './Pages/ProfilePage';
import EditProfile from './Pages/EditProfile';
import SettingsPage from './Pages/SettingsPage';
import HelpPage from './Pages/HelpPage';
import NotificationPage from './Pages/NotificationPage'; // ✅

import AdminDashboard from './Admin/AdminDashboard';
import ManageUsers from './Admin/ManageUsers';
import ManageLesson from './Admin/ManageLesson';
import ManageQuest from './Admin/ManageQuest';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const setFromProfile = useProfileStore((state) => state.setFromProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const profile = await getProfile();
        setFromProfile(profile);
      } catch (err) {
        console.error('❌ Failed to load profile in App.js:', err);
      }
    };

    fetchProfile();
  }, [setFromProfile]);

  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<OpeningPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Learning Section */}
        <Route path="/option" element={<PrivateRoute><Option /></PrivateRoute>} />
        <Route path="/level-select" element={<PrivateRoute><LevelSelectionPage /></PrivateRoute>} />
        <Route path="/learn" element={
          <PrivateRoute>
            <LearnLayout><LearnPage /></LearnLayout>
          </PrivateRoute>
        } />
        <Route path="/lesson/:lessonId" element={
          <PrivateRoute>
            <LearnLayout><LessonPage /></LearnLayout>
          </PrivateRoute>
        } />

        {/* Gamified Features */}
        <Route path="/dailyquests" element={
          <PrivateRoute>
            <QuestLayout><DailyQuests /></QuestLayout>
          </PrivateRoute>
        } />
        <Route path="/leaderboard" element={
          <PrivateRoute>
            <QuestLayout><LeaderboardPage /></QuestLayout>
          </PrivateRoute>
        } />

        {/* User Section */}
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/settings/*" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/help" element={<PrivateRoute><HelpPage /></PrivateRoute>} />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          }
        />


        {/* Admin Section */}
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/manageusers" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
        <Route path="/managelessons" element={<PrivateRoute><ManageLesson /></PrivateRoute>} />
        <Route path="/managequests" element={<PrivateRoute><ManageQuest /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
