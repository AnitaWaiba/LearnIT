import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import AdminSidebar from "./AdminSidebar";
import { getAdminDashboard } from "../utils/api";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    completionRate: 0,
    activityLogs: [],
    latestReviews: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className={styles.gridLayout}>
      <div className={styles.sidebar}>
        <AdminSidebar />
      </div>

      <div className={styles.content}>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h4>Total Users</h4>
            <p>{dashboardData.totalUsers}</p>
          </div>
          <div className={styles.card}>
            <h4>Total Courses</h4>
            <p>{dashboardData.totalCourses}</p>
          </div>
          <div className={styles.card}>
            <h4>Enrollments</h4>
            <p>{dashboardData.totalEnrollments}</p>
          </div>
          <div className={styles.card}>
            <h4>Completion Rate</h4>
            <p>{dashboardData.completionRate}%</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2>📋 Activity Logs</h2>
          {dashboardData.activityLogs.map((log, idx) => (
            <div key={idx} className={styles.logItem}>
              <span>{log.date}</span>
              <span>{log.action}</span>
              <span>{log.user}</span>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h2>📝 Latest Reviews</h2>
          {dashboardData.latestReviews.map((r, i) => (
            <div key={i} className={styles.reviewItem}>
              <strong>⭐ {r.rating}</strong>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
