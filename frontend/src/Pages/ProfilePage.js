import React, { useEffect, useState } from 'react';
import styles from './ProfilePage.module.css';
import defaultAvatar from '../Image/avatar1.png';
import Dashboard from '../Components/Dashboard';
import { getProfile, updateProfile } from '../utils/api';

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    joined: '',
    courses: [],
    avatar: ''
  });

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarSelect = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const response = await updateProfile(formData);
      setUserData((prev) => ({
        ...prev,
        avatar: response.data.avatar,
      }));
    } catch (error) {
      console.error('Avatar upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.gridLayout}>
      <aside className={styles.sidebar}>
        <Dashboard />
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.banner}>
          <img
            src={userData.avatar || defaultAvatar}
            alt="Profile Avatar"
            className={styles.avatar}
          />
          <button
            className={styles.editBtn}
            onClick={() => setEditingAvatar(!editingAvatar)}
          >
            ✎
          </button>
        </div>

        {editingAvatar && (
          <div className={styles.avatarUpload}>
            <label className={styles.uploadLabel}>
              Upload Avatar
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleAvatarSelect(e.target.files[0]);
                  }
                }}
                className={styles.hiddenInput}
              />
            </label>
            {uploading && <div className={styles.spinner}>Uploading...</div>}
          </div>
        )}

        <div className={styles.profileInfo}>
          <h1>{userData.name}</h1>
          <p className={styles.username}>@{userData.username}</p>
          <p className={styles.joined}>Joined <strong>{userData.joined}</strong></p>

          <div className={styles.courseIcons}>
            {userData.courses.map((course) =>
              course.icon ? (
                <img
                  key={course.title}
                  src={course.icon}
                  alt={course.title}
                  title={course.title}
                  className={styles.courseIcon}
                />
              ) : null
            )}
          </div>
        </div>

        <div className={styles.statistics}>
          <h2>Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              🔥<strong>302</strong>
              <p>Day streak</p>
            </div>
            <div className={styles.statBox}>
              ⚡<strong>54721</strong>
              <p>Total XP</p>
            </div>
            <div className={styles.statBox}>
              💎<strong>Emerald</strong>
              <p>Current league</p>
            </div>
            <div className={styles.statBox}>
              🏅<strong>5</strong>
              <p>Top 3 finishes</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
