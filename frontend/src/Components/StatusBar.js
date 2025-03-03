import React from "react";
import "./StatusBar.css"; // ✅ Make sure this file exists

// ✅ Ensure all icons are imported
import { FaFire, FaHeart, FaLaptopCode } from "react-icons/fa"; 
import { GiHexagonalNut } from "react-icons/gi"; // Hexagon for XP

const StatusBar = () => {
  return (
    <div className="status-bar">
      {/* Programming Icon (Replaces Flag) */}
      <div className="status-item">
        <FaLaptopCode className="icon laptop-icon" />
      </div>

      {/* Streak Count (Faded if inactive) */}
      <div className="status-item streak inactive">
        <FaFire className="icon" />
        <span>264</span>
      </div>

      {/* XP Points */}
      <div className="status-item xp">
        <GiHexagonalNut className="icon" />
        <span>3782</span>
      </div>

      {/* Hearts (Lives) */}
      <div className="status-item hearts">
        <FaHeart className="icon" />
        <span>5</span>
      </div>
    </div>
  );
};

export default StatusBar;