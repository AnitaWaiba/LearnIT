import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';
import Dashboard from '../Components/Dashboard';
import EditProfile from './EditProfile';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
  const navigate = useNavigate();

  const showLogoutToast = () => {
    const toastId = toast(
      ({ closeToast }) => (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '10px' }}>Are you sure you want to logout?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                toast.dismiss(toastId);
                toast.success('You have been logged out!');
                setTimeout(() => navigate('/'), 1500);
              }}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              OK
            </button>
            <button
              onClick={() => toast.dismiss(toastId)}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#111827',
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const handleTabClick = (tab) => {
    if (tab === 'logout') {
      showLogoutToast();
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
          <Route
            path="help"
            element={
              <div>
                <h2>❓ Help Center</h2>
                <p>Need assistance? Visit the help center for FAQs and support.</p>
              </div>
            }
          />
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
