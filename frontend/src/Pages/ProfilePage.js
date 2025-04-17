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
    avatar: '',
    xp: 0,
    current_streak: 0,
  });

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUserData(profile);
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
      setUploadMessage('');
      const res = await updateProfile(formData);

      if (res.avatar) {
        setUserData((prev) => ({
          ...prev,
          avatar: res.avatar,
        }));
        setUploadMessage('✅ Profile image uploaded successfully!');
      } else {
        setUploadMessage('✅ Upload completed, please refresh.');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      setUploadMessage('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.gridLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Dashboard />
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Avatar Section */}
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
            {uploadMessage && (
              <div className={styles.uploadMessage}>{uploadMessage}</div>
            )}
          </div>
        )}

        {/* Profile Info */}
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

        {/* Live Statistics */}
        <div className={styles.statistics}>
          <h2>Statistics</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              🔥<strong>{userData.current_streak ?? 0}</strong>
              <p>Day Streak</p>
            </div>
            <div className={styles.statBox}>
              ⚡<strong>{userData.xp ?? 0}</strong>
              <p>Total XP</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
