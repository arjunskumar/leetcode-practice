import React from 'react';
import { Star, Check } from 'lucide-react';

const ProblemCard = ({ problem, onToggleCompletion, onToggleStarred, onSelect, darkMode }) => (
  <div className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow hover:shadow-lg transition cursor-pointer`}>
    <h3 className="text-lg font-semibold" onClick={() => onSelect(problem)}>{problem.title}</h3>
    <span className={`px-2 py-1 rounded text-sm ${
      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
      'bg-red-100 text-red-800'
    }`}>{problem.difficulty}</span>
    <div className="flex justify-between mt-2">
      <button onClick={() => onToggleCompletion(problem.id)} className={problem.completed ? 'text-green-600' : 'text-gray-400'}>
        <Check className="h-5 w-5" />
      </button>
      <button onClick={() => onToggleStarred(problem.id)} className="text-yellow-600">
        <Star className={`h-5 w-5 ${problem.starred ? 'fill-yellow-500' : ''}`} />
      </button>
    </div>
  </div>
);

export default ProblemCard;