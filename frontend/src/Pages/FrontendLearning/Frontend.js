import React, { useState } from "react";
import styles from "./Frontend.module.css";
import { FaCheck, FaLock } from "react-icons/fa";

const allLessons = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Lesson ${i + 1}`,
}));

const chunkLessons = (lessons, chunkSize = 5) => {
  const result = [];
  for (let i = 0; i < lessons.length; i += chunkSize) {
    result.push(lessons.slice(i, i + chunkSize));
  }
  return result;
};

const Frontend = () => {
  const [progress, setProgress] = useState(2);
  const lessonChunks = chunkLessons(allLessons);

  const handleLessonClick = (lesson) => {
    if (lesson.id <= progress + 1) {
      alert(`Starting ${lesson.title}`);
      setProgress(lesson.id);
    }
  };

  return (
    <div className={styles.learnGrid}>
      <div className={styles.leftSidebar}>{/* Dashboard */}</div>

      <div className={styles.centerContent}>
        <div className={styles.lessonScroll}>
          {lessonChunks.map((chunk, index) => (
            <div className={styles.unitBlock} key={index}>
              <div className={styles.banner}>
                ← Section 1, Unit {index + 1}
                <h2>{chunk[0]?.title}</h2>
              </div>

              <div className={styles.lessonPath}>
                {chunk.map((lesson) => {
                  const isCompleted = lesson.id < progress;
                  const isUnlocked = lesson.id <= progress + 1;
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
                        {isCompleted ? <FaCheck /> : isUnlocked ? lesson.id : <FaLock />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rightSidebar}>{/* StatusBar */}</div>
    </div>
  );
};

export default Frontend;
