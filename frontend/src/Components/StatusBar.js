import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StatusBar.module.css';
import { useCourseStore } from '../Store/courseStore';
import { enrollInCourse } from '../utils/api';

// 📦 Course Icons
import introIcon from '../Image/intro.png';
import frontendIcon from '../Image/frontend1.png';
import backendIcon from '../Image/backend1.png';

// 🔗 Course Config
const courseIconMap = {
  'Introduction to Computer': introIcon,
  'Frontend Development': frontendIcon,
  'Backend Development': backendIcon,
};

const COURSES = [
  { id: 'intro', backendId: 1, name: 'Introduction to Computer', path: '/learn' },
  { id: 'frontend', backendId: 2, name: 'Frontend Development', path: '/frontend' },
  { id: 'backend', backendId: 3, name: 'Backend Development', path: '/backend' },
];

const StatusBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const setSelectedCourse = useCourseStore((state) => state.setSelectedCourse);

  const handleCourseChange = async (course) => {
    try {
      setEnrollingCourseId(course.id);
      await enrollInCourse(course.backendId); // API call to enroll user
      setSelectedCourse(course);
      navigate(course.path);
    } catch (err) {
      console.error('❌ Failed to enroll:', err.response?.data || err.message);
    } finally {
      setEnrollingCourseId(null);
      setDropdownOpen(false);
    }
  };

  return (
    <div className={styles.statusContainer}>
      <div className={styles.statusBar}>
        <div
          className={styles.courseSelector}
          title="Click to switch course"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={courseIconMap[selectedCourse?.name] || introIcon}
            alt={selectedCourse?.name || 'Course'}
            className={styles.courseIcon}
          />
        </div>

        {/* Stats (you can replace with actual values) */}
        <div className={styles.stat}>🔥 <span>264</span></div>
        <div className={styles.stat}>💎 <span>3782</span></div>
        <div className={styles.stat}>❤️ <span>5</span></div>
      </div>

      {dropdownOpen && (
        <div className={styles.dropdown}>
          <h4 className={styles.dropdownTitle}>MY COURSES</h4>
          {COURSES.map((course) => (
            <div
              key={course.id}
              className={`${styles.dropdownItem} ${
                selectedCourse?.id === course.id ? styles.active : ''
              }`}
              onClick={() => handleCourseChange(course)}
            >
              <img
                src={courseIconMap[course.name]}
                alt={course.name}
                className={styles.dropdownIcon}
              />
              <span>{course.name}</span>
              {enrollingCourseId === course.id && <span className={styles.enrolling}>...</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
