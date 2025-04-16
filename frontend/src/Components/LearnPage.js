import React, { useEffect, useState } from 'react';
import styles from './LearnPage.module.css';
import { FaCheck, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getLessonsByCourse, getCompletedLessonsByCourse } from '../utils/api';
import { useCourseStore } from '../Store/courseStore';

const chunkLessons = (lessons, chunkSize = 5) => {
  const result = [];
  for (let i = 0; i < lessons.length; i += chunkSize) {
    result.push(lessons.slice(i, i + chunkSize));
  }
  return result;
};

const LearnPage = () => {
  const navigate = useNavigate();
  const selectedCourse = useCourseStore((state) => state.selectedCourse);

  const [lessons, setLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        if (!selectedCourse?.backendId) {
          setLessons([]);
          setCompletedLessonIds([]);
          return;
        }

        setLoading(true);

        // Fetch all lessons for this course
        const fetchedLessons = await getLessonsByCourse(selectedCourse.backendId);
        setLessons(fetchedLessons);

        // Fetch user's completed lessons from backend
        const completedIds = await getCompletedLessonsByCourse(selectedCourse.backendId);
        setCompletedLessonIds(completedIds);

      } catch (error) {
        console.error('❌ Failed to fetch lessons or progress:', error);
        setLessons([]);
        setCompletedLessonIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
  }, [selectedCourse]);

  const handleLessonClick = (lesson) => {
    const nextLessonId = Math.min(...lessons.map(l => l.id).filter(id => !completedLessonIds.includes(id)));
    if (lesson.id <= nextLessonId) {
      navigate(`/lesson/${lesson.id}`);
    }
  };

  const lessonChunks = chunkLessons(lessons);

  return (
    <div className={styles.centerContent}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading lessons...</div>
      ) : lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>No lessons found for this course.</div>
      ) : (
        <div className={styles.lessonScroll}>
          {lessonChunks.map((chunk, index) => (
            <div className={styles.unitBlock} key={index}>
              <div className={styles.banner}>
                ← Section 1, Unit {index + 1}
                <h2>{chunk[0]?.title || `Unit ${index + 1}`}</h2>
              </div>

              <div className={styles.lessonPath}>
                {chunk.map((lesson, idx) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const nextUnlockId = Math.min(...lessons.map(l => l.id).filter(id => !completedLessonIds.includes(id)));
                  const isUnlocked = lesson.id === nextUnlockId || isCompleted;

                  const buttonClass = isCompleted
                    ? styles.completed
                    : isUnlocked
                    ? styles.unlocked
                    : styles.locked;

                  return (
                    <div key={lesson.id} className={styles.lessonWrapper}>
                      <button
                        className={`${styles.lessonButton} ${buttonClass}`}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={!isUnlocked}
                      >
                        {isCompleted ? (
                          <FaCheck />
                        ) : isUnlocked ? (
                          <span className={styles.lessonNumber}>{lesson.id}</span>
                        ) : (
                          <FaLock />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearnPage;
