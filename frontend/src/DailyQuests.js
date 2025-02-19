import React from 'react';
import './DailyQuests.css';
import Dashboard from './Dashboard'; // ✅ Sidebar

const DailyQuests = () => {
  const quests = [
    { id: 1, icon: '⚡', title: 'Earn 20 XP', progress: 0, total: 20 },
    { id: 2, icon: '🤖', title: 'Get 5 in a row correct in 2 lessons', progress: 0, total: 2 },
    { id: 3, icon: '⏱️', title: 'Score 80% or higher in 5 lessons', progress: 0, total: 5 }
  ];

  return (
    <div className="home-container">
      <Dashboard /> {/* ✅ Fixed Left Sidebar */}

      <div className="quest-content">
        <h3 className="daily-quests-title">Daily Quests</h3>

        <div className="quest-list">
          {quests.map((quest) => (
            <div key={quest.id} className="quest-item">
              <div className="quest-header">
                <span className="quest-icon">{quest.icon}</span>
                <span className="quest-title">{quest.title}</span>
              </div>

              <div className="progress-bar-container">
                <progress
                  className="progress-bar"
                  value={quest.progress}
                  max={quest.total}
                ></progress>
                <div className="quest-progress-text">
                  {quest.progress} / {quest.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyQuests;
