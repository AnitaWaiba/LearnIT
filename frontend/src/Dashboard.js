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

import "./Dashboard.css";

const Dashboard = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleToggleMore = () => {
    setIsMoreOpen(!isMoreOpen);
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">LearnIT</h2>

      <nav className="nav-menu">
        <NavLink to="/home" className="nav-item" activeclassname="active">
          <FaGraduationCap className="icon" /> LEARN
        </NavLink>

        <NavLink to="/leaderboards" className="nav-item" activeclassname="active">
          <FaTrophy className="icon" /> LEADERBOARD
        </NavLink>

        <NavLink to="/dailyquests" className="nav-item" activeclassname="active">
          <FaTasks className="icon" /> DAILY QUESTS
        </NavLink>

        <NavLink to="/profile" className="nav-item" activeclassname="active">
          <FaUser className="icon" /> PROFILE
        </NavLink>

        {/* MORE - Dropdown Toggle */}
        <div
          className="nav-item more-toggle"
          onClick={handleToggleMore}
          style={{ cursor: "pointer" }}
        >
          <FaEllipsisH className="icon" />
          MORE
          {isMoreOpen ? (
            <FaChevronUp className="chevron-icon" />
          ) : (
            <FaChevronDown className="chevron-icon" />
          )}
        </div>

        {isMoreOpen && (
          <div className="dropdown-content">
            <NavLink to="/settings" className="dropdown-item" activeclassname="active">
              <FaCog className="icon" /> Settings
            </NavLink>
            <NavLink to="/help" className="dropdown-item" activeclassname="active">
              <FaQuestionCircle className="icon" /> Help
            </NavLink>
            <NavLink to="/" className="dropdown-item" activeclassname="active">
              <FaSignOutAlt className="icon" /> Logout
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Dashboard;
