import React from 'react';
import { X } from 'lucide-react';

const ProblemModal = ({ problem, solution, language, notes, darkMode, onClose, onLanguageChange, onSaveNotes, onRating }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className={`p-8 rounded-lg shadow-lg max-w-3xl w-full relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <button className="absolute top-2 right-2" onClick={onClose}>
        <X className="h-6 w-6 text-gray-600" />
      </button>
      <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
      <p className="mb-4"><strong>Pattern:</strong> {problem.pattern}</p>
      <p className="mb-4"><strong>Difficulty:</strong> {problem.difficulty}</p>
      
      {solution && (
        <div>
          <div className="flex gap-4 mb-4">
            <button 
              onClick={() => onLanguageChange('python')}
              className={`px-4 py-2 rounded-lg ${language === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              python
            </button>
            <button 
              onClick={() => onLanguageChange('cpp')}
              className={`px-4 py-2 rounded-lg ${language === 'cpp' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              cpp
            </button>
          </div>
          
          <pre className={`p-4 rounded-lg overflow-x-auto max-h-96 border ${
            darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'
          }`}>
            <code>{solution[language]}</code>
          </pre>
          
          <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            <strong>Explanation:</strong> {solution.explanation}
          </p>
          
          <textarea
            className={`w-full p-2 rounded-lg mt-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} border`}
            rows="4"
            placeholder="Add your notes here..."
            value={notes || ''}
            onChange={(e) => onSaveNotes(problem.id, e.target.value)}
          />
          
          <div className="mt-4">
            <p className="mb-2">Rate your understanding:</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => onRating(problem.id, rating)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default ProblemModal;