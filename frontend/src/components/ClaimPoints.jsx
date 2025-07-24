import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { v4 as uuidv4 } from 'uuid';
import { FaBullseye } from 'react-icons/fa';

// Claim random points for a selected user
function ClaimPoints() {
  const [users, setUsers] = useState([]);
  const [board, setBoard] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [claimedInfo, setClaimedInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

    // Load all users
  const fetchUsers = async () => {
    const res = await axios.get('https://leaderboard-backend-lyr0.onrender.com/api/users');
    setUsers(res.data);
  };

   // Load current leaderboard (sorted by total points)
  const fetchLeaderboard = async () => {
    const res = await axios.get('https://leaderboard-backend-lyr0.onrender.com/api/claim/leaderboard');
    setBoard(res.data);
  };

  useEffect(() => {
    Promise.all([fetchUsers(), fetchLeaderboard()]).catch(() =>
      setErrorMsg('🚫 Failed to load users / leaderboard')
    );
  }, []);

  // Get user's previous total points before new claim
  const getPrevTotalPoints = (id) => {
    const row = board.find((u) => u._id === id);
    return row?.totalPoints ?? 0;
  };

  // Get user's name by ID
  const getUserName = (id) => {
    const u = users.find((x) => x._id === id);
    return u?.name ?? 'Unknown';
  };

   // Handles the actual point-claim process
  const handleClaim = async () => {
    if (!selectedId) {
      setErrorMsg('⚠️ Please select a user.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const prevTotal = getPrevTotalPoints(selectedId);
    const name = getUserName(selectedId);

    try {
       // Claim API returns random points (1–10)
      const res = await axios.post(`https://leaderboard-backend-lyr0.onrender.com/api/claim/${selectedId}`);
      const gained = res.data.points;
      const newTotal = prevTotal + gained; 
      await fetchLeaderboard();// Update leaderboard after claim

      // Show latest claim info
      setClaimedInfo({
        name,
        gained,
        prev: prevTotal,
        total: newTotal,
      });

      // Add to local claim history (top 5 only)
      const time = new Date().toLocaleTimeString();
      setClaimHistory((prev) => [
        { id: uuidv4(), name, gained, prev: prevTotal, total: newTotal, time },
        ...prev.slice(0, 4),
      ]);

       // Confetti animation 🎉
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (e) {
      setErrorMsg('❌ Failed to claim points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-container">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <h2 className="claim-title"> <FaBullseye /> Claim Points</h2>

      <div className="claim-controls">
        <div className="dropdown-wrapper">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="custom-dropdown"
          >
            <option value="">🌟 Choose a Warrior</option>
            {users.map((user) => {
              const total = getPrevTotalPoints(user._id);
              return (
                <option key={user._id} value={user._id}>
                  {user.name} ({total}⭐)
                </option>
              );
            })}
          </select>
          <div className="dropdown-arrow">⬇️</div>
        </div>

        <button
          onClick={handleClaim}
          disabled={loading}
          className={`claim-button ${loading ? 'disabled' : ''}`}
        >
          {loading ? '⏳ Claiming...' : '🚀 Claim Points'}
        </button>
      </div>

      {claimedInfo && (
        <div className="claimed-banner">
          🎉 <strong>{claimedInfo.name}</strong> gained <strong>+{claimedInfo.gained}⭐</strong> → Total:{" "}
          <strong>{claimedInfo.total}⭐</strong> (was {claimedInfo.prev}⭐)
        </div>
      )}

      {errorMsg && <p className="error-message">⚠️ {errorMsg}</p>}

      {claimHistory.length > 0 && (
        <div className="history-section">
          <h3 className="history-title">🕘 Recent Claims</h3>
          <ul className="history-list">
            {claimHistory.map((item) => (
              <li key={item.id} className="history-card">
                <div className="user-info">
                  <img
                    src={`https://i.pravatar.cc/40?u=${item.name}`}
                    alt="avatar"
                    className="avatar"
                  />
                  <span className="user-name">{item.name}</span>
                </div>
                <div className="points-info">
                  <span className="old-new-points">
                    {item.prev}⭐ → {item.total}⭐
                  </span>
                  <span className="gain-text">(+{item.gained}⭐)</span>
                  <span className="claim-time">({item.time})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ClaimPoints;
