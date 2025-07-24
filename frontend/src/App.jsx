// App.jsx
import React, { useState } from 'react';
import AddUser from './components/AddUser';
import ClaimPoints from './components/ClaimPoints';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus, FaTrophy, FaBullseye, FaHistory } from 'react-icons/fa';

function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const renderSection = () => {
    switch (activeTab) {
      case 'add':
        return <AddUser />;
      case 'claim':
        return <ClaimPoints />;
      case 'history':
        return <History />;
      case 'leaderboard':
      default:
        return <Leaderboard />;
    }
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation Bar */}
      <div className="navbar-custom">
        <div className="nav-items">
          <button onClick={() => setActiveTab('leaderboard')} className={activeTab === 'leaderboard' ? 'active' : ''}>
            <FaTrophy /> Leaderboard
          </button>
          <button onClick={() => setActiveTab('add')} className={activeTab === 'add' ? 'active' : ''}>
            <FaPlus /> Add User
          </button>
          <button onClick={() => setActiveTab('claim')} className={activeTab === 'claim' ? 'active' : ''}>
            <FaBullseye /> Claim Points
          </button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'active' : ''}>
            <FaHistory /> History
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="main-content">{renderSection()}</div>
    </div>
  );
}

export default App;
