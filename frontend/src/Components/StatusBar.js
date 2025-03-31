import React, { useState } from 'react';
import styles from './StatusBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../Store/profileStore';
import { FaFire, FaHeart, FaGem } from 'react-icons/fa';
import { MdComputer } from 'react-icons/md';

function StatusBar() {
  const navigate = useNavigate();
  const { courses, selectedCourse, setSelectedCourse } = useProfileStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCourseChange = (course) => {
    setSelectedCourse(course.name);
    setDropdownOpen(false);
    navigate(`/learn?course=${course.name}`);
  };

  return (
    <div className={styles.statusContainer}>
      <div className={styles.iconWrapper}>
        <MdComputer
          className={styles.courseIcon}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          title={selectedCourse}
        />
        {dropdownOpen && (
          <div className={styles.dropdown}>
            {courses.map(course => (
              <div
                key={course.name}
                className={styles.dropdownItem}
                onClick={() => handleCourseChange(course)}
              >
                <MdComputer className={styles.dropdownIcon} />
                <span>{course.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.statRow}>
        <div className={styles.stat}>
          <FaFire className={`${styles.statIcon} ${styles.fire}`} />
          <span>264</span>
        </div>
        <div className={styles.stat}>
          <FaGem className={`${styles.statIcon} ${styles.gem}`} />
          <span>3782</span>
        </div>
        <div className={styles.stat}>
          <FaHeart className={`${styles.statIcon} ${styles.heart}`} />
          <span>5</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
