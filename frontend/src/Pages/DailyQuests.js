import React, { useEffect, useState } from 'react';
import { getDailyQuests } from '../utils/api';
import styles from './DailyQuests.module.css';

const icons = {
  xp: '⚡',
  streak: '🔥',
  accuracy: '🎯',
};

function DailyQuests() {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    getDailyQuests().then(setQuests).catch(console.error);
  }, []);

  return (
    <div className={styles.questContainer}>
      <h2 className={styles.heading}>Daily Quests</h2>
      <div className={styles.questList}>
        {quests.map((q) => (
          <div key={q.id} className={styles.questCard}>
            <div className={styles.iconCircle}>{icons[q.type]}</div>

            <div className={styles.questDetails}>
              <div className={styles.questTitle}>{q.title}</div>
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(q.progress / q.target) * 100}%` }}
                />
              </div>
              <div className={styles.progressText}>
                {q.progress} / {q.target}
              </div>
            </div>

            <div className={styles.rewardIcon}>🎁</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyQuests;
