import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CodeHighlighter = ({ code, language, darkMode }) => {
  // Basic syntax highlighting rules
  const highlightCode = (code) => {
    if (!code) return '';
    
    // Common keywords for both Python and C++
    const keywords = [
      'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'break', 
      'continue', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is',
      'void', 'int', 'float', 'double', 'string', 'bool', 'struct', 'const',
      'public', 'private', 'protected', 'template', 'typename'
    ];

    // Split code into lines for better handling
    return code.split('\n').map((line, i) => {
      // Handle comments
      if (language === 'python' && line.trim().startsWith('#')) {
        return `<span class="text-green-400">${line}</span>`;
      }
      if (language === 'cpp' && (line.trim().startsWith('//') || line.trim().startsWith('/*'))) {
        return `<span class="text-green-400">${line}</span>`;
      }

      // Handle strings
      line = line.replace(
        /("[^"]*"|'[^']*')/g,
        '<span class="text-yellow-400">$1</span>'
      );

      // Handle numbers
      line = line.replace(
        /\b(\d+(\.\d+)?)\b/g,
        '<span class="text-purple-400">$1</span>'
      );

      // Handle keywords
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        line = line.replace(
          regex,
          `<span class="text-blue-400">${keyword}</span>`
        );
      });

      // Handle function calls
      line = line.replace(
        /\b(\w+)\(/g,
        '<span class="text-yellow-200">$1</span>('
      );

      return line;
    }).join('\n');
  };

  return (
    <pre 
      className={`p-4 overflow-x-auto max-h-96 font-mono text-sm ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div 
        dangerouslySetInnerHTML={{ 
          __html: highlightCode(code)
        }} 
        className={darkMode ? 'text-gray-300' : 'text-gray-800'}
      />
    </pre>
  );
};

const ProblemModal = ({ problem, solution, language, notes, darkMode, onClose, onLanguageChange, onSaveNotes, onRating }) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className={`p-8 rounded-lg shadow-lg max-w-4xl w-full relative ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button 
          className="absolute top-2 right-2 text-sm hover:opacity-75 transition-opacity" 
          onClick={onClose} 
          aria-label="Close modal (ESC)"
        >
          ESC
        </button>
        
        <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <p><strong>Pattern:</strong> {problem.pattern}</p>
          <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        </div>
        
        {solution && (
          <div>
            <div className="flex gap-4 mb-4">
              <button 
                onClick={() => onLanguageChange('python')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  language === 'python' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Python
              </button>
              <button 
                onClick={() => onLanguageChange('cpp')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  language === 'cpp' 
                    ? 'bg-blue-600 text-white' 
                    : darkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                C++
              </button>
            </div>
            
            <div className={`rounded-lg overflow-hidden ${
              darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
              <CodeHighlighter 
                code={solution[language]} 
                language={language}
                darkMode={darkMode}
              />
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Solution Explanation</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {solution.explanation}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Notes</h3>
                <textarea
                  className={`w-full p-4 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                  } border focus:ring-2 focus:ring-blue-500 outline-none`}
                  rows="4"
                  placeholder="Add your notes here..."
                  value={notes || ''}
                  onChange={(e) => onSaveNotes(problem.id, e.target.value)}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Rate Your Understanding</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => onRating(problem.id, rating)}
                      className={`px-4 py-2 rounded-lg text-white transition-colors ${
                        rating === 1 ? 'bg-red-600 hover:bg-red-500' :
                        rating === 2 ? 'bg-orange-500 hover:bg-orange-400' :
                        rating === 3 ? 'bg-yellow-500 hover:bg-yellow-400' :
                        rating === 4 ? 'bg-lime-500 hover:bg-lime-400' :
                        'bg-green-600 hover:bg-green-500'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemModal;