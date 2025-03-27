import React, { useEffect, useState } from 'react';
import styles from './EditProfile.module.css';
import defaultAvatar from '../Image/avatar1.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfile, updateProfile } from '../utils/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function EditProfile() {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    joined: '',
    courses: [],
    avatar: ''
  });

  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUserData(response.data);
        setNewUsername(response.data.username);
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
      toast.success('✅ Avatar updated!');
    } catch (error) {
      toast.error('❌ Avatar upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        'http://localhost:8000/api/profile/update/',
        {
          username: newUsername,
          current_password: currentPassword,
          new_password: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('✅ Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Update failed.';
      toast.error(msg);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-center" autoClose={2500} />

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

      <form onSubmit={handleSubmit} className={styles.form}>
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
            <span onClick={() => setShowCurrent(!showCurrent)} className={styles.toggleIcon}>
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
            <span onClick={() => setShowNew(!showNew)} className={styles.toggleIcon}>
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
