import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import Dashboard from '../Components/Dashboard';
import EditProfile from './EditProfile';
import HelpPage from './HelpPage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('✅ You have been logged out!', {
      position: 'top-center',
      autoClose: 2000,
    });
    localStorage.removeItem('access'); // Clear auth token if stored
    setTimeout(() => navigate('/'), 2000);
  };

  const handleTabClick = (tab) => {
    if (tab === 'logout') {
      if (window.confirm('Are you sure you want to logout?')) {
        handleLogout();
      }
    } else {
      navigate(`/settings/${tab}`);
    }
  };

  return (
    <div className={styles.gridLayout}>
      <ToastContainer />

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Dashboard />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<EditProfile />} />
          <Route
            path="notifications"
            element={
              <div>
                <h2>🔔 Notifications</h2>
                <p>Manage your email and in-app notification preferences.</p>
              </div>
            }
          />
          <Route path="help" element={<HelpPage />} />
        </Routes>
      </main>

      {/* Right Panel */}
      <aside className={styles.actionPanel}>
        <div className={styles.card} onClick={() => handleTabClick('profile')}>
          👤 Profile
        </div>
        <div className={styles.card} onClick={() => handleTabClick('notifications')}>
          🔔 Notifications
        </div>
        <div className={styles.card} onClick={() => handleTabClick('help')}>
          ❓ Help Center
        </div>
        <div className={styles.card} onClick={() => handleTabClick('logout')}>
          🚪 Log Out
        </div>
      </aside>
    </div>
  );
};

export default SettingsPage;
