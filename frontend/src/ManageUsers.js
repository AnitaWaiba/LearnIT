import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import './ManageUsers.css';
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

  // Fetch users from backend
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

  // Handle search filter
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

  // Handle delete user
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('access_token');

    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('User deleted successfully!');
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while deleting the user.');
    }
  };

  // Handle edit user (this can open a modal or navigate to another page)
  const handleEdit = (userId) => {
    alert(`Redirecting to Edit User ID: ${userId}`);
    // Example: navigate(`/admin/users/${userId}/edit`);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <main className="manage-users-wrapper">
        <h2 className="manage-users-title">Manage Users</h2>

        <div className="manage-users-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <button className="add-user-btn" onClick={() => alert('Redirect to Add User Page')}>
            + Add User
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="user-table-container">
          <table className="user-table">
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
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => handleEdit(user.id)}>
                        <FaUserEdit className="btn-icon" /> Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                        <FaTrashAlt className="btn-icon" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-users-text">
                    No users found
                  </td>
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