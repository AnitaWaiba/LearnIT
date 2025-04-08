import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaGraduationCap,
  FaTrophy,
  FaTasks,
  FaUser,
  FaEllipsisH,
  FaCog,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt
} from "react-icons/fa";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleMore = () => setIsMoreOpen(!isMoreOpen);
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsMoreOpen(false);
  };

  return (
    <aside className={`${styles.dashboardWrapper} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.toggleContainer}>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" onChange={handleToggleSidebar} checked={!isCollapsed} />
          <span className={styles.slider}></span>
        </label>
        {!isCollapsed && <span className={styles.toggleLabel}>Collapse</span>}
      </div>

      <h2 className={styles.logo}>{!isCollapsed && "LearnIT"}</h2>

      <nav className={styles.navMenu}>
        <NavLink to="/learn" className={styles.navItem}>
          <FaGraduationCap className={styles.icon} />
          {!isCollapsed && <span>LEARN</span>}
        </NavLink>

        <NavLink to="/leaderboards" className={styles.navItem}>
          <FaTrophy className={styles.icon} />
          {!isCollapsed && <span>LEADERBOARD</span>}
        </NavLink>

        <NavLink to="/dailyquests" className={styles.navItem}>
          <FaTasks className={styles.icon} />
          {!isCollapsed && <span>DAILY QUESTS</span>}
        </NavLink>

        <NavLink to="/profile" className={styles.navItem}>
          <FaUser className={styles.icon} />
          {!isCollapsed && <span>PROFILE</span>}
        </NavLink>

        <div className={`${styles.navItem} ${styles.moreToggle}`} onClick={handleToggleMore}>
          <FaEllipsisH className={styles.icon} />
          {!isCollapsed && (
            <>
              <span>MORE</span>
              {isMoreOpen ? <FaChevronUp className={styles.chevronIcon} /> : <FaChevronDown className={styles.chevronIcon} />}
            </>
          )}
        </div>

        {isMoreOpen && !isCollapsed && (
          <div className={styles.dropdownContent}>
            <NavLink to="/settings" className={styles.dropdownItem}>
              <FaCog className={styles.icon} />
              <span>Settings</span>
            </NavLink>
            <NavLink to="/help" className={styles.dropdownItem}>
              <FaQuestionCircle className={styles.icon} />
              <span>Help</span>
            </NavLink>
            <NavLink to="/" className={styles.dropdownItem}>
              <FaSignOutAlt className={styles.icon} />
              <span>Logout</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Dashboard;
