import React from 'react';
import Dashboard from '../Components/Dashboard';
import styles from './QuestLayout.module.css';

const QuestLayout = ({ children }) => {
  return (
    <div className={styles.questGrid}>
      <aside className={styles.left}>
        <Dashboard />
      </aside>
      <main className={styles.center}>
        {children}
      </main>
    </div>
  );
};

export default QuestLayout;
