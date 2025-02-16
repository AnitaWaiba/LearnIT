import React, { useState, useEffect } from "react";
import "./Home.css";
import { FaCheck, FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Dashboard from "./Dashboard"; // Left Sidebar
import DailyQuests from "./DailyQuests"; // Right Sidebar
import StatusBar from "./StatusBar"; // Top Right Status Bar

const Home = () => {
  const [progress, setProgress] = useState(2); // Tracks which lessons are unlocked
  const [showUpArrow, setShowUpArrow] = useState(false); // Tracks scroll direction

  const lessons = [
    { id: 1, completed: true },
    { id: 2, completed: true },
    { id: 3, completed: false },
    { id: 4, completed: false },
    { id: 5, completed: false },
  ];

  // Handle lesson button click
  const handleLessonClick = (id) => {
    if (id <= progress) {
      alert(`Starting Lesson ${id}`);
      setProgress(id + 1); // Unlock the next lesson
    }
  };

  // Handle scroll to toggle up/down arrow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowUpArrow(true);
      } else {
        setShowUpArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top/bottom when clicking arrow
  const handleScrollTo = () => {
    if (showUpArrow) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      {/* Left Sidebar (Fixed) */}
      <Dashboard />

      {/* Top Right Status Bar */}
      <StatusBar />

      {/* Main Lesson Content */}
      <div className="lesson-content">
        {/* Section Header */}
        <div className="section-header">
          <span>← SECTION 1, UNIT 1</span>
          <h2>History of Computer</h2>
        </div>

        {/* Lesson Path */}
        <div className="path">
          {lessons.map((lesson) => {
            const isUnlocked = lesson.id <= progress;
            const buttonClass = lesson.completed
              ? "completed"
              : isUnlocked
              ? "unlocked"
              : "locked";

            return (
              <button
                key={lesson.id}
                className={`lesson-button ${buttonClass}`}
                onClick={() => handleLessonClick(lesson.id)}
                disabled={!isUnlocked}
              >
                {lesson.completed ? (
                  <FaCheck className="icon" />
                ) : isUnlocked ? (
                  lesson.id
                ) : (
                  <FaLock className="icon" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Scroll Arrow */}
      <button className="scroll-arrow" onClick={handleScrollTo}>
        {showUpArrow ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <DailyQuests />
      </div>
    </div>
  );
};

export default Home;
