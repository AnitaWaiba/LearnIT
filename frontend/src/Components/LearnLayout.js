import React from 'react';
import Dashboard from '../Components/Dashboard';
import StatusBar from '../Components/StatusBar';
import DailyQuests from '../Pages/DailyQuests'; // shown as a widget on right
import styles from './LearnLayout.module.css';

const LearnLayout = ({ children }) => {
  return (
    <div className={styles.learnGrid}>
      <aside className={styles.left}>
        <Dashboard />
      </aside>
      <main className={styles.center}>
        {children}
      </main>
      <aside className={styles.right}>
        <StatusBar />
        <div className={styles.questWidget}>
          <DailyQuests />
        </div>
      </aside>
    </div>
  );
};

export default LearnLayout;
