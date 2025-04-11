import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManageUsers.module.css';
import AdminSidebar from './AdminSidebar';
import { FaSearch, FaUserEdit, FaTrashAlt } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

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
        headers: { Authorization: `Bearer ${token}` }
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
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage('Error deleting user.');
    }
  };

  const handleEdit = (userId) => {
    alert(`Redirect to edit user ${userId}`);
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
          <button className={styles.addBtn} onClick={() => alert("Redirect to add user")}>
            + Add User
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
                      <button className={styles.editBtn} onClick={() => handleEdit(user.id)}>
                        <FaUserEdit /> Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)}>
                        <FaTrashAlt /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noUsers}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;
