import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar"; // Your fixed sidebar
import "./AdminDashboard.css"; // Styles

const AdminCard = ({ title, value }) => {
  return (
    <div className="admin-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/dashboard/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="main-content">
        <h2>Admin Overview</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Admin Cards */}
            <div className="admin-cards">
              <AdminCard title="Total Users" value={dashboardData?.totalUsers || "N/A"} />
              <AdminCard title="Total Courses" value={dashboardData?.totalCourses || "N/A"} />
              <AdminCard title="Total Enrollments" value={dashboardData?.totalEnrollments || "N/A"} />
              <AdminCard title="Completion Rate" value={`${dashboardData?.completionRate || "N/A"}%`} />
            </div>

            {/* Activity Logs */}
            <h2>Activity Logs</h2>
            <div className="activity-logs">
              <div className="log-header">
                <h4>Date</h4>
                <h4>Action</h4>
                <h4>User</h4>
              </div>
              {dashboardData?.activityLogs?.length > 0 ? (
                dashboardData.activityLogs.map((log, index) => (
                  <div className="log-row" key={index}>
                    <p>{log?.date || "N/A"}</p>
                    <p>{log?.action || "N/A"}</p>
                    <p>{log?.user || "N/A"}</p>
                  </div>
                ))
              ) : (
                <p>No recent activity logs</p>
              )}
            </div>

            {/* Latest Feedback & Reviews */}
            <h2>Latest Feedback & Reviews</h2>
            <div className="reviews">
              {dashboardData?.latestReviews?.length > 0 ? (
                dashboardData.latestReviews.map((review, index) => (
                  <div className="review-item" key={index}>
                    <h6>{review?.rating || "N/A"} Stars</h6>
                    <p>{review?.comment || "No Comment"}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;