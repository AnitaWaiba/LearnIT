import React, { useEffect, useState, useCallback } from 'react';
import styles from './LearnPage.module.css';
import { FaCheck, FaLock } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getLessonsByCourse,
  getCompletedLessonsByCourse,
  getProfile,
} from '../utils/api';
import { useCourseStore } from '../Store/courseStore';
import { useProfileStore } from '../Store/profileStore';

const chunkLessons = (lessons, chunkSize = 5) => {
  const result = [];
  for (let i = 0; i < lessons.length; i += chunkSize) {
    result.push(lessons.slice(i, i + chunkSize));
  }
  return result;
};

function LearnPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCourse = useCourseStore((s) => s.selectedCourse);
  const setFromProfile = useProfileStore((s) => s.setFromProfile);
  const hearts = useProfileStore((s) => s.hearts);

  const [lessons, setLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeartModal, setShowHeartModal] = useState(false);

  const fetchLessonsAndProgress = useCallback(async () => {
    if (!selectedCourse?.backendId) return;
    try {
      setLoading(true);
      const [lessonData, completedData] = await Promise.all([
        getLessonsByCourse(selectedCourse.backendId),
        getCompletedLessonsByCourse(selectedCourse.backendId),
      ]);
      setLessons(lessonData);
      setCompletedLessonIds(completedData);
    } catch (err) {
      console.error('❌ Error loading lessons:', err);
      setLessons([]);
      setCompletedLessonIds([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setFromProfile(data);
    } catch (err) {
      console.error('❌ Failed to refresh profile:', err);
    }
  }, [setFromProfile]);

  useEffect(() => {
    fetchLessonsAndProgress();
    refreshProfile();
  }, [fetchLessonsAndProgress, refreshProfile]);

  useEffect(() => {
    if (location.state?.reload) {
      fetchLessonsAndProgress();
      refreshProfile();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, fetchLessonsAndProgress, refreshProfile, navigate]);

  const handleLessonClick = (lessonId) => {
    if (hearts <= 0) {
      setShowHeartModal(true);
    } else {
      navigate(`/lesson/${lessonId}`);
    }
  };

  const getNextUnlockId = () => {
    const allIds = lessons.map((l) => l.id);
    const notCompleted = allIds.filter((id) => !completedLessonIds.includes(id));
    return notCompleted.length > 0 ? Math.min(...notCompleted) : null;
  };

  const nextUnlockId = getNextUnlockId();
  const lessonChunks = chunkLessons(lessons, 5);

  return (
    <div className={styles.centerContent}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading lessons...</div>
      ) : lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          No lessons available for this course and level.
        </div>
      ) : (
        <div className={styles.lessonScroll}>
          {lessonChunks.map((chunk, unitIndex) => (
            <div className={styles.unitBlock} key={unitIndex}>
              <div className={styles.banner}>
                Section 1, Unit {unitIndex + 1}
                <h2>{chunk[0]?.title || `Unit ${unitIndex + 1}`}</h2>
              </div>
              <div className={styles.lessonPath}>
                {chunk.map((lesson, index) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isUnlocked = isCompleted || lesson.id === nextUnlockId;
                  const lessonNumber = unitIndex * chunk.length + index + 1;

                  const statusClass = isCompleted
                    ? styles.completed
                    : isUnlocked
                    ? styles.unlocked
                    : styles.locked;

                  return (
                    <div key={lesson.id} className={styles.lessonWrapper}>
                      <button
                        className={`${styles.lessonButton} ${statusClass}`}
                        onClick={() => handleLessonClick(lesson.id)}
                        disabled={!isUnlocked}
                      >
                        {isCompleted ? <FaCheck /> : isUnlocked ? lessonNumber : <FaLock />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Heart Modal */}
      {showHeartModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Out of Hearts ❤️</h3>
            <p>You’ve used all your hearts. Try again tomorrow!</p>
            <button onClick={() => setShowHeartModal(false)} className={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearnPage;
