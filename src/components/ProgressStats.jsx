import React from 'react';

const StatCard = ({ title, value, color, darkMode }) => (
  <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const ProgressStats = ({ problems, darkMode }) => {
  const stats = {
    total: problems.length,
    completed: problems.filter(p => p.completed).length,
    starred: problems.filter(p => p.starred).length
  };

  return (
    <div className={`grid grid-cols-3 gap-4 mb-6 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
      <StatCard title="Total Problems" value={stats.total} color="text-blue-600" darkMode={darkMode} />
      <StatCard title="Completed" value={stats.completed} color="text-green-600" darkMode={darkMode} />
      <StatCard title="To Review" value={stats.starred} color="text-yellow-600" darkMode={darkMode} />
    </div>
  );
};

export default ProgressStats;