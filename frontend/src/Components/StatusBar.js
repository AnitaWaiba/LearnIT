import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatusBar.module.css';
import { useCourseStore } from '../Store/courseStore';

// 📦 Course Icons from /src/Image
import introIcon from '../Image/intro.png';
import frontendIcon from '../Image/frontend1.png';
import backendIcon from '../Image/backend1.png';

const courseIconMap = {
  'Introduction to Computer': introIcon,
  'Frontend Development': frontendIcon,
  'Backend Development': backendIcon,
};

const defaultCourses = [
  { id: 'intro', name: 'Introduction to Computer', path: '/home' },
  { id: 'frontend', name: 'Frontend Development', path: '/frontend' },
  { id: 'backend', name: 'Backend Development', path: '/backend' },
];

const StatusBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🧠 Zustand global store usage
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setDropdownOpen(false);
    navigate(course.path);
  };

  return (
    <div className={styles.statusContainer}>
      <div className={styles.statusBar}>
        <div className={styles.courseSelector} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img
            src={courseIconMap[selectedCourse.name]}
            alt={selectedCourse.name}
            className={styles.courseIcon}
          />
        </div>

        <div className={styles.stat}>🔥 <span>264</span></div>
        <div className={styles.stat}>💎 <span>3782</span></div>
        <div className={styles.stat}>❤️ <span>5</span></div>
      </div>

      {dropdownOpen && (
        <div className={styles.dropdown}>
          <h4 className={styles.dropdownTitle}>MY COURSES</h4>
          {defaultCourses.map((course) => (
            <div
              key={course.id}
              className={`${styles.dropdownItem} ${
                course.id === selectedCourse.id ? styles.active : ''
              }`}
              onClick={() => handleSelectCourse(course)}
            >
              <img
                src={courseIconMap[course.name]}
                alt={course.name}
                className={styles.dropdownIcon}
              />
              <span>{course.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
