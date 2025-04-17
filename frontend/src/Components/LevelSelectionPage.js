// src/pages/LevelSelectionPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../Store/courseStore';
import { enrollInCourse } from '../utils/api';
import styles from './LevelSelectionPage.module.css';

const LevelSelectionPage = () => {
  const navigate = useNavigate();
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  useEffect(() => {
    if (!selectedCourse?.backendId) {
      navigate('/');
    }
  }, [selectedCourse, navigate]);

  const handleSelectLevel = async (level) => {
    try {
      await enrollInCourse(selectedCourse.backendId, level);
      navigate('/learn');
    } catch (err) {
      console.error('❌ Enrollment failed:', err);
      alert('Failed to enroll. Try again.');
    }
  };

  return (
    <div className={styles.levelPage}>
      <div className={styles.box}>
        <h2>What’s your experience level in this course?</h2>
        <div className={styles.buttons}>
          <button onClick={() => handleSelectLevel('beginner')}>Beginner</button>
          <button onClick={() => handleSelectLevel('intermediate')}>Some Knowledge</button>
          <button onClick={() => handleSelectLevel('advanced')}>Professional</button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelectionPage;
