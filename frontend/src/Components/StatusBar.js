import React, { useEffect, useState } from 'react';
import styles from './StatusBar.module.css';
import { useNavigate } from 'react-router-dom';
import { enrollInCourse, getProfile } from '../utils/api';
import { useCourseStore } from '../Store/courseStore';
import { useProfileStore } from '../Store/profileStore';

import introIcon from '../Image/intro.png';
import frontendIcon from '../Image/frontend1.png';
import backendIcon from '../Image/backend1.png';

const courseIconMap = {
  'Introduction to Computer': introIcon,
  'Frontend Development': frontendIcon,
  'Backend Development': backendIcon,
};

const COURSES = [
  { id: 'intro', backendId: 1, name: 'Introduction to Computer', path: '/learn' },
  { id: 'frontend', backendId: 2, name: 'Frontend Development', path: '/learn' },
  { id: 'backend', backendId: 3, name: 'Backend Development', path: '/learn' },
];

const StatusBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  const selectedCourse = useCourseStore((s) => s.selectedCourse);
  const setSelectedCourse = useCourseStore((s) => s.setSelectedCourse);

  const xp = useProfileStore((s) => s.xp);
  const hearts = useProfileStore((s) => s.hearts);
  const streak = useProfileStore((s) => s.currentStreak);
  const setProfileFromData = useProfileStore((s) => s.setFromProfile);

  // 🔁 Refresh profile on mount
  useEffect(() => {
    getProfile()
      .then(setProfileFromData)
      .catch((err) => console.error('❌ Failed to load status bar profile:', err));
  }, [setProfileFromData]);

  const handleCourseChange = async (course) => {
    try {
      setEnrollingCourseId(course.id);
      await enrollInCourse(course.backendId);
      setSelectedCourse(course);
      const profile = await getProfile();
      setProfileFromData(profile);
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
        {/* Course Icon */}
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

        {/* Live Stats */}
        <div className={styles.stat}>🔥 <span>{streak ?? 0}</span></div>
        <div className={styles.stat}>💎 <span>{xp ?? 0}</span></div>
        <div className={styles.stat}>❤️ <span>{hearts ?? 5}</span></div>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className={styles.dropdown}>
          <h4 className={styles.dropdownTitle}>MY COURSES</h4>
          {COURSES.map((course) => (
            <div
              key={course.id}
              className={`${styles.dropdownItem} ${selectedCourse?.id === course.id ? styles.active : ''}`}
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
