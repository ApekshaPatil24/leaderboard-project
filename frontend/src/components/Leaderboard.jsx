import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

// Dynamic leaderboard - ranks users by points in real-time
function Leaderboard() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    fetchLeaderboard(); // Initial fetch
    const interval = setInterval(fetchLeaderboard, 3000);// Refresh every 3s
    return () => clearInterval(interval);
  }, []);

   // Gets sorted user ranking data
  const fetchLeaderboard = async () => {
    const res = await axios.get('http://localhost:5000/api/claim/leaderboard');
    setRankings(res.data);
  };

  // Return emoji for top 3
  const getMedal = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return null;
  };

  const topThree = rankings.slice(0, 3);// Top 3
  const rest = rankings.slice(3);// Others

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">👑 Wealth Leaderboard</h2>

      <img
        src="/crown-icon.png"
        alt="clock"
        className="leaderboard-crown"
      />
      <p className="settlement-time">Settlement Time: 00:45:34</p>

      <div className="top-three-container">
  {[1, 0, 2].map((i) => {
    const user = topThree[i];
    if (!user) return null;
    return (
      <div key={user._id} className={`top-user card rank-${i + 1}`}>
        <div
          className="avatar"
          style={{ backgroundImage: `url(https://i.pravatar.cc/150?img=${i + 4})` }}
        ></div>
        <h5 className="username">{user.name || 'Mystery User'}</h5>
        <p className="points">{user.totalPoints} 🔥</p>
        <div className="medal">{getMedal(i)}</div>
      </div>
    );
  })}
</div>

      <div className="rest-container">
        {rest.map((user, index) => (
          <div key={user._id} className="rest-user">
            <div className="rest-info">
              <div
                className="avatar small"
                style={{ backgroundImage: `url(https://i.pravatar.cc/150?img=${index + 10})` }}
              ></div>
              <div className="name">{user.name}</div>
            </div>
            <div className="rest-points">{user.totalPoints} 🔥</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
