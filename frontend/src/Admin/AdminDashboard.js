import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import AdminSidebar from "./AdminSidebar";
import { getAdminDashboard } from "../utils/api";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getAdminDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      }
    };
    fetchDashboard();
  }, []);

  if (!dashboardData) {
    return <p style={{ padding: "40px" }}>Loading dashboard...</p>;
  }

  const barData = {
    labels: ["Users", "Courses", "Enrollments"],
    datasets: [
      {
        label: "Count",
        data: [
          dashboardData.totalUsers,
          dashboardData.totalCourses,
          dashboardData.totalEnrollments,
        ],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
        borderRadius: 5,
      },
    ],
  };

  const pieData = {
    labels: dashboardData.courseStats?.labels || [],
    datasets: [
      {
        data: dashboardData.courseStats?.counts || [],
        backgroundColor: [
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#A78BFA",
          "#F87171",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.gridLayout}>
      <div className={styles.sidebar}>
        <AdminSidebar />
      </div>

      <div className={styles.content}>
        <h2 className={styles.pageTitle}>📊 Admin Dashboard</h2>

        {/* Top Stats Row */}
        <div className={styles.cardGridRow}>
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

        {/* Chart Row */}
        <div className={styles.chartRow}>
          <div className={styles.chartContainer}>
            <h3>System Overview</h3>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
              height={300}
            />
          </div>

          {dashboardData.courseStats?.counts?.length > 0 && (
            <div className={styles.chartContainer}>
              <h3>Enrollments by Course</h3>
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { boxWidth: 16 },
                    },
                  },
                }}
                height={300}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
