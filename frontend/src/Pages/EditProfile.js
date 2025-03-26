import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import defaultAvatar from '../Image/avatar1.png';
import { getProfile, updateProfile } from '../utils/api';

function EditProfile() {
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
    <div className={styles.editContainer}>
      <div className={styles.banner}>
        <img
          src={userData.avatar || defaultAvatar}
          alt="Avatar"
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
      </div>
    </div>
  );
}

export default EditProfile;
