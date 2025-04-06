import React from 'react';
import styles from './DailyQuests.module.css';

const DailyQuests = () => {
  const quests = [
    { id: 1, icon: '⚡', title: 'Earn 20 XP', progress: 0, total: 20 },
    { id: 2, icon: '🤖', title: 'Get 5 in a row correct in 2 lessons', progress: 0, total: 2 },
    { id: 3, icon: '⏱️', title: 'Score 80% or higher in 5 lessons', progress: 0, total: 5 },
  ];

  return (
    <div className={styles.questContainer}>
      <h2 className={styles.title}>Daily Quests</h2>

      <div className={styles.questList}>
        {quests.map((quest) => (
          <div key={quest.id} className={styles.questCard}>
            <div className={styles.questHeader}>
              <span className={styles.icon}>{quest.icon}</span>
              <span className={styles.questTitle}>{quest.title}</span>
            </div>
            <progress
              className={styles.progressBar}
              value={quest.progress}
              max={quest.total}
            />
            <div className={styles.questProgressText}>
              {quest.progress} / {quest.total}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyQuests;
