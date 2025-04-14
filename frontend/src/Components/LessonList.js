import React, { useEffect, useState } from 'react';
import styles from './LessonList.module.css';
import { getAllLessons } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [unlockedIndex, setUnlockedIndex] = useState(0); // For progression logic
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessons();
        setLessons(data);
        // TODO: Replace with actual progress from user profile
        setUnlockedIndex(0); // For now, only first lesson is unlocked
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  const handleLessonClick = (id, index) => {
    if (index <= unlockedIndex) {
      navigate(`/lesson/${id}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.header}>Choose a Lesson</h1>
      <div className={styles.grid}>
        {lessons.map((lesson, idx) => {
          const isUnlocked = idx <= unlockedIndex;
          return (
            <div
              key={lesson.id}
              className={`${styles.card} ${!isUnlocked ? styles.locked : ''}`}
              onClick={() => handleLessonClick(lesson.id, idx)}
            >
              <div className={styles.title}>
                {lesson.title}
              </div>
              <div className={styles.status}>
                {isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LessonList;
