// Modules for LeetCode Tracker
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import ProblemModal from './ProblemModal';
import SearchBar from './SearchBar';
import PatternProgress from './PatternProgress';
import ProgressStats from './ProgressStats';
import ProblemCard from './ProblemCard';
import useLocalStorage from '../hooks/useLocalStorage'; 
import useProblemData from '../hooks/useProblemData';


// Main Component
const ProblemList = () => {
  const { problems, setProblems, solutions, notes, setNotes, reviewDates, setReviewDates } = useProblemData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [selectedTrack, setSelectedTrack] = useState('');

  const handleToggleCompletion = (id) => {
    const updatedProblems = problems.map(p => 
      p.id === id ? { ...p, completed: !p.completed } : p
    );
    setProblems(updatedProblems);
    localStorage.setItem('userProgress', JSON.stringify(
      updatedProblems.reduce((acc, p) => ({
        ...acc,
        [p.id]: { completed: p.completed, starred: p.starred }
      }), {})
    ));
  };

  const handleToggleStarred = (id) => {
    const updatedProblems = problems.map(p => 
      p.id === id ? { ...p, starred: !p.starred } : p
    );
    setProblems(updatedProblems);
    localStorage.setItem('userProgress', JSON.stringify(
      updatedProblems.reduce((acc, p) => ({
        ...acc,
        [p.id]: { completed: p.completed, starred: p.starred }
      }), {})
    ));
  };

  const handleSaveNotes = (id, note) => {
    const updatedNotes = { ...notes, [id]: note };
    setNotes(updatedNotes);
    localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
  };

  const handleScheduleReview = (problemId, rating) => {
    const now = new Date();
    const currentInterval = reviewDates[problemId]?.interval || 1;
    const nextInterval = rating >= 4 ? Math.min(currentInterval * 2, 60) :
                        rating >= 2 ? currentInterval :
                        Math.max(1, Math.floor(currentInterval / 2));
    
    const nextReview = new Date(now.getTime() + (nextInterval * 24 * 60 * 60 * 1000));
    const updatedReviewDates = {
      ...reviewDates,
      [problemId]: {
        nextReview: nextReview.toISOString(),
        interval: nextInterval
      }
    };
    
    setReviewDates(updatedReviewDates);
    localStorage.setItem('reviewDates', JSON.stringify(updatedReviewDates));
  };

  const filteredProblems = problems.filter(problem => {
    const matchesTrack = selectedTrack ? problem.track.includes(selectedTrack) : true;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const groupedProblems = filteredProblems.reduce((acc, problem) => {
    acc[problem.pattern] = acc[problem.pattern] || [];
    acc[problem.pattern].push(problem);
    return acc;
  }, {});

  return (
    <div className={`max-w-6xl mx-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        LeetCode Tracker
      </h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        {darkMode ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-yellow-500" />}
      </button>

      <ProgressStats problems={filteredProblems} darkMode={darkMode} />
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTrack={selectedTrack}
        onTrackChange={setSelectedTrack}
        darkMode={darkMode}
      />

      {Object.entries(groupedProblems).map(([pattern, problems]) => (
        <div key={pattern}>
          <h2 className={`text-2xl font-bold px-4 py-2 rounded-lg shadow-md ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'
          }`}>
            {pattern}
          </h2>
          <PatternProgress 
            problems={problems}
            darkMode={darkMode}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {problems.map(problem => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onToggleCompletion={handleToggleCompletion}
                onToggleStarred={handleToggleStarred}
                onSelect={setSelectedProblem}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedProblem && (
        <ProblemModal
          problem={selectedProblem}
          solution={solutions[selectedProblem.id]}
          language={selectedLanguage}
          notes={notes[selectedProblem.id]}
          darkMode={darkMode}
          onClose={() => setSelectedProblem(null)}
          onLanguageChange={setSelectedLanguage}
          onSaveNotes={handleSaveNotes}
          onRating={handleScheduleReview}
        />
      )}
    </div>
  );
};

export default ProblemList;