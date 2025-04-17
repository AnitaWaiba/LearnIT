import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import defaultAvatar from '../Image/avatar1.png';
import { getProfile, updateProfile } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setUserData(profile);
        setNewUsername(profile.username);
      } catch (err) {
        console.error('❌ Failed to load profile:', err);
        toast.error('Failed to load profile.');
      }
    };
    loadProfile();
  }, []);

  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      setUploading(true);
      const res = await updateProfile(formData);
      setUserData((prev) => ({
        ...prev,
        avatar: res.avatar,
      }));
      toast.success('✅ Avatar updated!');
    } catch (err) {
      toast.error('❌ Failed to update avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        username: newUsername,
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('✅ Profile updated!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Update failed.';
      toast.error(msg);
    }
  };

  if (!userData) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" autoClose={2500} />

      {/* Avatar Section */}
      <div className={styles.avatarContainer}>
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
              onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              className={styles.hiddenInput}
            />
          </label>
          {uploading && <p className={styles.spinner}>Uploading...</p>}
        </div>
      )}

      {/* Profile Info */}
      <div className={styles.profileInfo}>
        <h1>{userData.name}</h1>
        <p className={styles.username}>@{userData.username}</p>
        <p className={styles.joined}>Joined <strong>{userData.joined}</strong></p>
      </div>

      {/* Edit Credentials */}
      <form onSubmit={handleCredentialSubmit} className={styles.form}>
        <h2>Edit Credentials</h2>

        <label>
          Username
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Current Password
          <div className={styles.passwordInput}>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowCurrent(!showCurrent)}
              className={styles.toggleIcon}
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>

        <label>
          New Password
          <div className={styles.passwordInput}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowNew(!showNew)}
              className={styles.toggleIcon}
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>

        <button type="submit" className={styles.submitBtn}>Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
