import React, { useState } from 'react';
import { Trophy, Medal, Flame, Star, Crown, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('points');

  const leaderboardData = {
    points: [
      { id: 1, name: 'Axmed', points: 12450, streak: 12, avatar: 'A' },
      { id: 2, name: 'Faadumo', points: 11200, streak: 8, avatar: 'F' },
      { id: 3, name: 'Geedi', points: 10850, streak: 15, avatar: 'G' },
      { id: 4, name: 'Caasha', points: 9400, streak: 5, avatar: 'C' },
      { id: 5, name: 'Cali', points: 8900, streak: 3, avatar: 'C' },
    ],
    streaks: [
      { id: 3, name: 'Geedi', points: 10850, streak: 15, avatar: 'G' },
      { id: 1, name: 'Axmed', points: 12450, streak: 12, avatar: 'A' },
      { id: 2, name: 'Faadumo', points: 11200, streak: 8, avatar: 'F' },
      { id: 4, name: 'Caasha', points: 9400, streak: 5, avatar: 'C' },
      { id: 5, name: 'Cali', points: 8900, streak: 3, avatar: 'C' },
    ]
  };

  const currentData = leaderboardData[activeTab];

  return (
    <div className="px-4 section-padding max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Hogaanka Ciyaarta</h1>
        <p className="text-slate-800">Ciyaartoyda ugu sareysa. Waa la cusbooneysiiyaa waqtiga dhabta ah.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        {[
          { id: 'points', label: 'Dhibcaha', icon: <Star size={16} /> },
          { id: 'streaks', label: 'Joogtaynta', icon: <Flame size={16} /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.id ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-800 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="clean-card p-0 overflow-hidden bg-white">
        {currentData.map((player, i) => (
          <div 
            key={player.id}
            className={`flex items-center gap-4 p-4 sm:p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
              i === 0 ? 'bg-amber-50/30' : ''
            }`}
          >
            <div className={`font-bold text-lg w-8 text-center ${
              i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-600' : i === 2 ? 'text-orange-700' : 'text-slate-600'
            }`}>
              #{i + 1}
            </div>
            
            <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center font-bold text-sm">
              {player.avatar}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                {player.name}
                {i === 0 && <Crown size={14} className="text-amber-500" />}
              </div>
              <div className="text-xs text-slate-700 flex items-center gap-1 mt-0.5">
                <Flame size={12} className="text-orange-500" /> {player.streak} maalmood
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-brand-600 text-lg">
                {activeTab === 'points' ? player.points.toLocaleString() : player.streak}
              </div>
              <div className="text-[10px] text-slate-700 uppercase font-semibold">
                {activeTab === 'points' ? 'Dhibcood' : 'Maalmood'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Your Rank */}
      <div className="clean-card bg-brand-50 border-brand-200 flex items-center gap-4 p-5">
        <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold">
          Y
        </div>
        <div className="flex-1">
          <div className="text-xs text-brand-700 font-semibold uppercase">Booskaaga</div>
          <div className="text-lg font-bold text-slate-900">#42 ee 4,200</div>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-semibold text-sm bg-emerald-100 px-3 py-1 rounded-md">
          <TrendingUp size={14} /> +3
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
