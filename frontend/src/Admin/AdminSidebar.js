import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminSidebar.module.css";

const AdminSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/managelessons">Manage Lessons</Link></li>
        <li><Link to="/manageusers">Manage Users</Link></li>
        <li><Link to="/managequest">Manage Quest</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
