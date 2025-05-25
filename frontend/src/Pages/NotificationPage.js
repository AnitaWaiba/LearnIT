import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead } from '../utils/api';
import styles from './NotificationPage.module.css';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  // ✅ Move this function ABOVE useEffect
  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      console.log("📥 Fetching notifications...");
      console.log("✅ Fetched data:", res.data);
      setNotifications(res.data);

    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };
  
  useEffect(() => {
    console.log("🔔 NotificationPage mounted"); // Add this
    const timer = setTimeout(() => {
    fetchNotifications();}, 500);

  return () => clearTimeout(timer);
}, []);


  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      <ul>
        {notifications.map(n => (
          <li key={n.id} className={n.is_read ? styles.read : styles.unread}>
            <p>{n.message}</p>
            {!n.is_read && <button onClick={() => handleMarkRead(n.id)}>Mark as read</button>}
            <small>{new Date(n.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
