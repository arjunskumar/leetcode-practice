// src/components/ModeSelector.jsx
import React from 'react';
import { BookOpen, Calendar } from 'lucide-react';

const ModeSelector = ({ selectedMode, onModeSelect, darkMode }) => {
  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Choose Your Learning Mode
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onModeSelect('self-paced')}
          className={`p-6 rounded-lg border transition-all flex items-center gap-4 ${
            selectedMode === 'self-paced'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
              : darkMode
              ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className={`p-3 rounded-full ${
            selectedMode === 'self-paced'
              ? 'bg-blue-100 dark:bg-blue-800'
              : darkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}>
            <BookOpen className={`h-6 w-6 ${
              selectedMode === 'self-paced'
                ? 'text-blue-500'
                : darkMode
                ? 'text-gray-300'
                : 'text-gray-600'
            }`} />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Self-Paced Learning
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose and solve problems at your own pace
            </p>
          </div>
        </button>

        <button
          onClick={() => onModeSelect('guided')}
          className={`p-6 rounded-lg border transition-all flex items-center gap-4 ${
            selectedMode === 'guided'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
              : darkMode
              ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className={`p-3 rounded-full ${
            selectedMode === 'guided'
              ? 'bg-blue-100 dark:bg-blue-800'
              : darkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
          }`}>
            <Calendar className={`h-6 w-6 ${
              selectedMode === 'guided'
                ? 'text-blue-500'
                : darkMode
                ? 'text-gray-300'
                : 'text-gray-600'
            }`} />
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Guided Study Plan
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Follow a personalized study schedule
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;