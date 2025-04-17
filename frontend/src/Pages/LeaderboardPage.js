import React, { useEffect, useState } from 'react';
import styles from './LeaderboardPage.module.css';
import { getLeaderboard } from '../utils/api';
import defaultAvatar from '../Image/avatar1.png';

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getLeaderboard().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🏆 Leaderboard</h1>

      <div className={styles.table}>
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`${styles.row} ${
              index === 0 ? styles.gold : index === 1 ? styles.silver : index === 2 ? styles.bronze : ''
            }`}
          >
            <div className={styles.rank}>{index + 1}</div>
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"
              className={styles.avatar}
            />
            <div className={styles.name}>{user.username}</div>
            <div className={styles.xp}>{user.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
