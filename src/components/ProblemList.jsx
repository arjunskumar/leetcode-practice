import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Star, Check, X, Sun, Moon } from 'lucide-react';

const ProgressStats = ({ problems, darkMode }) => {
  const totalProblems = problems.length;
  const completedProblems = problems.filter(p => p.completed).length;
  const starredProblems = problems.filter(p => p.starred).length;

  return (
    <div className={`grid grid-cols-3 gap-4 mb-6 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
      <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold">Total Problems</h3>
        <p className="text-2xl font-bold text-blue-600">{totalProblems}</p>
      </div>
      <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold">Completed</h3>
        <p className="text-2xl font-bold text-green-600">{completedProblems}</p>
      </div>
      <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold">To Review</h3>
        <p className="text-2xl font-bold text-yellow-600">{starredProblems}</p>
      </div>
    </div>
  );
};

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState({});
  const [selectedTrack, setSelectedTrack] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const problemsRes = await fetch(`${import.meta.env.BASE_URL}problems.json`);
        const solutionsRes = await fetch(`${import.meta.env.BASE_URL}solutions.json`);

        if (!problemsRes.ok) throw new Error("Failed to load problems.json");
        if (!solutionsRes.ok) throw new Error("Failed to load solutions.json");

        const problemsData = await problemsRes.json();
        const solutionsData = await solutionsRes.json();

        const savedProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
        const savedNotes = JSON.parse(localStorage.getItem('userNotes')) || {};
        const updatedProblems = problemsData.map(p => ({
          ...p,
          completed: savedProgress[p.id]?.completed || false,
          starred: savedProgress[p.id]?.starred || false,
        }));

        setProblems(updatedProblems);
        setSolutions(solutionsData);
        setNotes(savedNotes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const saveProgress = () => {
    const progress = problems.reduce((acc, p) => {
      acc[p.id] = { completed: p.completed, starred: p.starred };
      return acc;
    }, {});
    localStorage.setItem('userProgress', JSON.stringify(progress));
  };

  const saveNotes = (id, note) => {
    const updatedNotes = { ...notes, [id]: note };
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
  };

  const toggleCompletion = (id) => {
    setProblems(problems.map(p => p.id === id ? { ...p, completed: !p.completed } : p));
    saveProgress();
  };

  const toggleStarred = (id) => {
    setProblems(problems.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
    saveProgress();
  };

  const groupedProblems = problems.reduce((acc, problem) => {
    acc[problem.pattern] = acc[problem.pattern] || [];
    acc[problem.pattern].push(problem);
    return acc;
  }, {});

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedMode !== null) {
      setDarkMode(savedMode);
    }
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesTrack = selectedTrack ? problem.track.includes(selectedTrack) : true;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const handleTrackChange = (e) => {
    setSelectedTrack(e.target.value);
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>LeetCode Tracker</h1>

      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        {darkMode ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-yellow-500" />}
      </button>

      <ProgressStats problems={filteredProblems} darkMode={darkMode} />
      
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search problems..."
            className={`pl-10 pr-4 py-2 w-full border rounded-lg ${darkMode ? 'bg-gray-800 text-white border-gray-600' : ''}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <select value={selectedTrack} onChange={handleTrackChange} className="bg-gray-200 p-2 rounded-md">
          <option value="">All Tracks</option>
          <option value="< 1 month">{"< 1 month"}</option>
          <option value="1-3 months">1-3 months</option>
          <option value="3+ months">3+ months</option>
        </select>
      </div>

      {Object.entries(groupedProblems).map(([pattern, problems]) => (
        <div key={pattern} className="mt-8">
          <h2 className={`text-2xl font-bold px-4 py-2 rounded-lg shadow-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'}`}>
            {pattern}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredProblems
              .filter(problem => problem.pattern === pattern)
              .map(problem => (
                <div key={problem.id} className={`border rounded-lg p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow hover:shadow-lg transition cursor-pointer`}>
                  <h3 className="text-lg font-semibold" onClick={() => setSelectedProblem(problem)}>{problem.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{problem.difficulty}</span>
                  <div className="flex justify-between mt-2">
                    <button className={problem.completed ? 'text-green-600' : 'text-gray-400'} onClick={() => toggleCompletion(problem.id)}>
                      <Check className="h-5 w-5" />
                    </button>
                    <button className="text-yellow-600" onClick={() => toggleStarred(problem.id)}>
                      <Star className={`h-5 w-5 ${problem.starred ? 'fill-yellow-500' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      {selectedProblem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`p-8 rounded-lg shadow-lg max-w-3xl w-full relative ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <button className="absolute top-2 right-2" onClick={() => setSelectedProblem(null)}>
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedProblem.title}</h2>
            <p className="mb-4"><strong>Pattern:</strong> {selectedProblem.pattern}</p>
            <p className="mb-4"><strong>Difficulty:</strong> {selectedProblem.difficulty}</p>
            {solutions[selectedProblem.id] && (
              <div>
                <div className="flex gap-4 mb-4">
                  <button 
                    className={`px-4 py-2 rounded-lg ${selectedLanguage === 'python' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedLanguage('python')}
                  >
                    Python
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg ${selectedLanguage === 'cpp' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedLanguage('cpp')}
                  >
                    C++
                  </button>
                </div>
                <pre className={`p-4 rounded-lg overflow-x-auto max-h-96 border ${
                  darkMode
                    ? 'bg-gray-800 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                  }`}>
                <code>{solutions[selectedProblem.id][selectedLanguage]}</code>
              </pre>
                <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  <strong>Explanation:</strong> {solutions[selectedProblem.id].explanation}
                </p>
                <div className="mt-4">
                  <textarea
                    className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} border`}
                    rows="4"
                    placeholder="Add your notes here..."
                    value={notes[selectedProblem.id] || ''}
                    onChange={(e) => saveNotes(selectedProblem.id, e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemList;
