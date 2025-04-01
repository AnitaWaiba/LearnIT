import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { FaCheck, FaLock, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Home = () => {
  const [progress, setProgress] = useState(2);
  const [showUpArrow, setShowUpArrow] = useState(false);

  const lessons = [
    { id: 1, completed: true },
    { id: 2, completed: true },
    { id: 3, completed: false },
    { id: 4, completed: false },
    { id: 5, completed: false },
  ];

  useEffect(() => {
    const handleScroll = () => setShowUpArrow(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = () => {
    window.scrollTo({
      top: showUpArrow ? 0 : document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleLessonClick = (id) => {
    if (id <= progress) {
      alert(`Starting Lesson ${id}`);
      setProgress(id + 1);
    }
  };

  return (
    <div className={styles.learnSection}>
      <div className={styles.sectionHeader}>
        ← SECTION 1, UNIT 1
        <h2>History of Computer</h2>
      </div>

      <div className={styles.path}>
        {lessons.map((lesson) => {
          const isUnlocked = lesson.id <= progress;
          const buttonClass = lesson.completed
            ? styles.completed
            : isUnlocked
            ? styles.unlocked
            : styles.locked;

          return (
            <button
              key={lesson.id}
              className={`${styles.lessonButton} ${buttonClass}`}
              onClick={() => handleLessonClick(lesson.id)}
              disabled={!isUnlocked}
            >
              {lesson.completed ? <FaCheck /> : isUnlocked ? lesson.id : <FaLock />}
            </button>
          );
        })}
      </div>

      <button className={styles.scrollArrow} onClick={handleScrollTo}>
        {showUpArrow ? <FaChevronUp /> : <FaChevronDown />}
      </button>
    </div>
  );
};

export default Home;
