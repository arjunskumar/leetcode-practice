import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const CodeHighlighter = ({ code, language, darkMode }) => {
  const highlightCode = (code) => {
    if (!code) return '';
    
    const keywords = [
      'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'break', 
      'continue', 'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is',
      'void', 'int', 'float', 'double', 'string', 'bool', 'struct', 'const',
      'public', 'private', 'protected', 'template', 'typename'
    ];

    // Create a temporary element to safely escape HTML
    const escapeHTML = (str) => {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    };

    return code.split('\n').map((line, i) => {
      // Escape HTML first to prevent XSS
      let processedLine = escapeHTML(line);

      // Handle comments first
      if (language === 'python' && processedLine.trim().startsWith('#')) {
        return `<span class="text-green-400">${processedLine}</span>`;
      }
      if (language === 'cpp' && (processedLine.trim().startsWith('//') || processedLine.trim().startsWith('/*'))) {
        return `<span class="text-green-400">${processedLine}</span>`;
      }

      // Store already highlighted portions to prevent re-processing
      const highlightedSegments = [];
      let currentIndex = 0;

      // Function to add a highlighted segment
      const addHighlight = (start, end, className, content) => {
        if (start > currentIndex) {
          highlightedSegments.push(processedLine.substring(currentIndex, start));
        }
        highlightedSegments.push(`<span class="${className}">${content}</span>`);
        currentIndex = end;
      };

      // Handle string literals
      const stringRegex = language === 'python' 
        ? /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g
        : /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;

      let match;
      while ((match = stringRegex.exec(processedLine)) !== null) {
        addHighlight(match.index, match.index + match[0].length, 'text-yellow-400', match[0]);
      }

      // Reset currentIndex for next pass if no strings were found
      if (currentIndex === 0) {
        currentIndex = 0;
      }

      // Handle numbers
      const numberRegex = /\b(\d*\.?\d+([eE][+-]?\d+)?[fFlL]?|\d+[uUlL]*|0x[0-9a-fA-F]+|0b[01]+)\b/g;
      while ((match = numberRegex.exec(processedLine)) !== null) {
        // Skip if this part is already inside a string highlight
        if (!highlightedSegments.some(seg => seg.includes(match.index))) {
          addHighlight(match.index, match.index + match[0].length, 'text-purple-400', match[0]);
        }
      }

      // Handle keywords
      keywords.forEach(keyword => {
        const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'g');
        while ((match = keywordRegex.exec(processedLine)) !== null) {
          // Skip if this part is already highlighted
          if (!highlightedSegments.some(seg => seg.includes(match.index))) {
            addHighlight(match.index, match.index + keyword.length, 'text-blue-400', keyword);
          }
        }
      });

      // Handle function calls
      const functionRegex = /\b(\w+)(?=\()/g;
      while ((match = functionRegex.exec(processedLine)) !== null) {
        // Skip if this part is already highlighted
        if (!highlightedSegments.some(seg => seg.includes(match.index))) {
          addHighlight(match.index, match.index + match[0].length, 'text-yellow-200', match[0]);
        }
      }

      // Add any remaining unhighlighted text
      if (currentIndex < processedLine.length) {
        highlightedSegments.push(processedLine.substring(currentIndex));
      }

      return highlightedSegments.join('');
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

const ProblemModal = ({ 
  problem, 
  solution, 
  language, 
  notes, 
  darkMode, 
  onClose, 
  onLanguageChange, 
  onSaveNotes, 
  onRating 
}) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  if (!problem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div 
        className={`p-8 rounded-lg shadow-lg max-w-4xl w-full relative ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-opacity-80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <p><strong>Pattern:</strong> {problem.pattern}</p>
          <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        </div>
        
        {solution && (
          <div className="space-y-6">
            <div className="flex gap-4">
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
            
            <div className={`rounded-lg overflow-hidden border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <CodeHighlighter 
                code={solution[language]} 
                language={language}
                darkMode={darkMode}
              />
            </div>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2">Solution Explanation</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {solution.explanation}
                </p>
              </section>
              
              <section>
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
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-2">Rate Your Understanding</h3>
                <div className="flex flex-wrap gap-2">
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
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemModal;