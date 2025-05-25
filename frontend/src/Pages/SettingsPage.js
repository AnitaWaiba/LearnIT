import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import Dashboard from '../Components/Dashboard';
import EditProfile from './EditProfile';
import HelpPage from './HelpPage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your API call to fetch notifications
import { getNotifications } from '../utils/api';  // Adjust path if needed

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    toast.success('✅ You have been logged out!', {
      position: 'top-center',
      autoClose: 2000,
    });
    localStorage.removeItem('access_token'); // fixed key for token removal
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

  // Use useLocation to track path changes safely
  useEffect(() => {
    if (location.pathname.endsWith('/notifications')) {
      setLoadingNotifications(true);
      getNotifications()
        .then((data) => {
          setNotifications(data);
          setLoadingNotifications(false);
        })
        .catch(() => {
          setError('Failed to load notifications');
          setLoadingNotifications(false);
        });
    }
  }, [location.pathname]);  // track location.pathname changes properly

  return (
    <div className={styles.gridLayout}>
      <ToastContainer />

      {/* ☰ Hamburger Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setSidebarOpen(prev => !prev)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
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

                {loadingNotifications && <p>Loading notifications...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loadingNotifications && !error && notifications.length === 0 && (
                  <p>No new notifications.</p>
                )}

                {!loadingNotifications && !error && notifications.length > 0 && (
                  <ul className={styles.notificationsList}>
                    {notifications.map(notification => (
                      <li key={notification.id} className={styles.notificationItem}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.timestamp).toLocaleString()}</small>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            }
          />
          <Route path="help" element={<HelpPage />} />
        </Routes>
      </main>

      {/* Action Panel */}
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
