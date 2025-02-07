import React from 'react';

const PatternProgress = ({ problems, darkMode }) => {
  const stats = {
    completed: problems.filter(p => p.completed).length,
    total: problems.length,
    percentage: (problems.filter(p => p.completed).length / problems.length) * 100
  };

  return (
    <div className="mt-2 mb-4">
      <div className="flex justify-between mb-1">
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Progress: {stats.completed}/{stats.total}
        </span>
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {stats.percentage.toFixed(1)}%
        </span>
      </div>
      <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default PatternProgress;