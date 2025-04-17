import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManageUsers.module.css';
import Modal from 'react-modal';
import AdminSidebar from './AdminSidebar';
import { FaSearch, FaUserEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

Modal.setAppElement('#root');

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      is_staff: false,
    });
    setModalIsOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      is_staff: user.is_staff,
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      is_staff: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      if (editingUser) {
        await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${editingUser.id}/update/`,
          formData,
          config
        );
        setMessage('✅ User updated successfully!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/users/create/', formData, config);
        setMessage('✅ User created successfully!');
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      setMessage('❌ Error saving user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage('❌ Error deleting user.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className={styles.gridLayout}>
      <aside className={styles.sidebar}>
        <AdminSidebar />
      </aside>

      <main className={styles.content}>
        <h2 className={styles.title}>Manage Users</h2>

        <div className={styles.header}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by username or email"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            className={styles.iconButton}
            title="Add User"
            onClick={openAddModal}
          >
            <FaPlus />
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.tableWrapper}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.is_staff ? 'Yes' : 'No'}</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.iconButton}
                        title="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <FaUserEdit />
                      </button>
                      <button
                        className={styles.iconButtonRed}
                        title="Delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noUsers}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleFormChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleFormChange}
              required={!editingUser}
            />
            <label>
              <input
                type="checkbox"
                name="is_staff"
                checked={formData.is_staff}
                onChange={handleFormChange}
              />{' '}
              Is Admin?
            </label>

            <div className={styles.modalButtons}>
              <button type="submit">{editingUser ? 'Update' : 'Create'}</button>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default ManageUsers;
