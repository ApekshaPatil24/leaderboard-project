import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; 

function History() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/claim/history');
      
      // ✅ Sort by createdAt descending (latest first)
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistory(sorted);

    } catch (error) {
      console.error('Failed to fetch claim history');
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">📜 Recent Claim History</h2>
      {history.length === 0 ? (
        <p className="history-empty">No claims yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((record) => (
            <li key={record._id} className="history-item">
              <div className="history-info">
                <p className="history-name">{record.userId?.name || 'Unknown User'}</p>
                <p className="history-time">{new Date(record.createdAt).toLocaleString()}</p>
              </div>
              <span className="history-points">+{record.points}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
