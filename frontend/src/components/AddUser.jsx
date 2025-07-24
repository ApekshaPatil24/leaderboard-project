import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { FaPlus } from 'react-icons/fa';

// Input form + existing user list (Add new user to DB)
function AddUser() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(null); // ✅ New: for showing success/error messages

  // Adds a new user via POST request
  const handleAddUser = async () => {
    if (!name.trim()) {
      setStatus({ type: 'error', message: '⚠️ Please enter a name!' });
      return;
    }

    try {
      await axios.post('https://leaderboard-backend-lyr0.onrender.com/api/users', { name });
      setName('');
      setStatus({ type: 'success', message: `✅ "${name}" added successfully!` });
      fetchUsers();
    } catch (err) {
      setStatus({ type: 'error', message: '❌ Failed to add user. Try again later.' });
    }

    // Clear message after 3 seconds
    setTimeout(() => setStatus(null), 3000);
  };

  // Gets all users with their totalPoints
  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://leaderboard-backend-lyr0.onrender.com/api/claim/leaderboard'); // gets name + totalPoints
      setUsers(res.data.reverse()); // Reverse for recent-first
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers(); // Load users on initial mount
  }, []);

  return (
    <div className="add-user-container">
      {/* Banner */}
      <div className="winged-banner">
        <img src="https://cdn-icons-png.flaticon.com/512/616/616489.png" alt="banner" />
        <p className="settlement-time">🕒 Add a New Warrior to the Leaderboard</p>
      </div>

      {/* Add User Form */}
      <div className="add-user-card">
        <h2><FaPlus /> Add User</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="👤 Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleAddUser}>🚀 Add</button>
        </div>

        {/* ✅ Status Message */}
        {status && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>

      {/* User List */}
      <div className="user-list-section">
        <h3 className="user-list-title">📋 All Users</h3>
        <div className="user-list">
          {users.length === 0 ? (
            <p className="text-muted">No users yet.</p>
          ) : (
            users.map((user, index) => (
              <div key={user._id} className="user-card">
                <img
                  src={`https://i.pravatar.cc/150?img=${index + 10}`}
                  alt="avatar"
                  className="avatar"
                />
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-time">⭐ Points: {user.totalPoints ?? 0}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddUser;
