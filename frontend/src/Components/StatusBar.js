import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatusBar.module.css';
import { useCourseStore } from '../Store/courseStore';
import { enrollInCourse } from '../utils/api';

// 📦 Icons
import introIcon from '../Image/intro.png';
import frontendIcon from '../Image/frontend1.png';
import backendIcon from '../Image/backend1.png';

// 🎓 Local Course List (with backend IDs)
const courseIconMap = {
  'Introduction to Computer': introIcon,
  'Frontend Development': frontendIcon,
  'Backend Development': backendIcon,
};

const defaultCourses = [
  { id: 'intro', backendId: 1, name: 'Introduction to Computer', path: '/home' },
  { id: 'frontend', backendId: 2, name: 'Frontend Development', path: '/frontend' },
  { id: 'backend', backendId: 3, name: 'Backend Development', path: '/backend' },
];

const StatusBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Zustand state
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);

  const handleSelectCourse = async (course) => {
    try {
      setEnrolling(true);
      await enrollInCourse(course.backendId);
      setSelectedCourse(course);
      setDropdownOpen(false);
      navigate(course.path);
    } catch (error) {
      console.error('❌ Enrollment failed:', error.response?.data || error.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className={styles.statusContainer}>
      <div className={styles.statusBar}>
        <div
          className={styles.courseSelector}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title="Switch Course"
        >
          <img
            src={courseIconMap[selectedCourse?.name] || introIcon}
            alt={selectedCourse?.name}
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
              className={`${styles.dropdownItem} ${course.id === selectedCourse?.id ? styles.active : ''}`}
              onClick={() => handleSelectCourse(course)}
            >
              <img
                src={courseIconMap[course.name]}
                alt={course.name}
                className={styles.dropdownIcon}
              />
              <span>{course.name}</span>
              {enrolling && course.id === selectedCourse?.id && <span className={styles.enrolling}>...</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
