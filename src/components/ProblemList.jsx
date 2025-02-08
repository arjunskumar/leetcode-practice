import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import ProblemModal from './ProblemModal';
import SearchBar from './SearchBar';
import PatternProgress from './PatternProgress';
import ProgressStats from './ProgressStats';
import ProblemCard from './ProblemCard';
import LandingPage from './LandingPage';
import useLocalStorage from '../hooks/useLocalStorage';
import useProblemData from '../hooks/useProblemData';

const ProblemList = () => {
  const { 
    problems, 
    setProblems, 
    solutions, 
    notes, 
    setNotes, 
    reviewDates, 
    setReviewDates,
    isLoading,
    error 
  } = useProblemData();
  
  const [showLanding, setShowLanding] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [selectedTrack, setSelectedTrack] = useState('');

  // Memoized handlers
  const handleToggleCompletion = useCallback((id) => {
    setProblems(prevProblems => {
      const updatedProblems = prevProblems.map(p => 
        p.id === id ? { ...p, completed: !p.completed } : p
      );
      
      // Update localStorage
      const progress = updatedProblems.reduce((acc, p) => ({
        ...acc,
        [p.id]: { completed: p.completed, starred: p.starred }
      }), {});
      localStorage.setItem('userProgress', JSON.stringify(progress));
      
      return updatedProblems;
    });
  }, [setProblems]);

  const handleToggleStarred = useCallback((id) => {
    setProblems(prevProblems => {
      const updatedProblems = prevProblems.map(p => 
        p.id === id ? { ...p, starred: !p.starred } : p
      );
      
      const progress = updatedProblems.reduce((acc, p) => ({
        ...acc,
        [p.id]: { completed: p.completed, starred: p.starred }
      }), {});
      localStorage.setItem('userProgress', JSON.stringify(progress));
      
      return updatedProblems;
    });
  }, [setProblems]);

  const handleSaveNotes = useCallback((id, note) => {
    setNotes(prevNotes => {
      const updatedNotes = { ...prevNotes, [id]: note };
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
      return updatedNotes;
    });
  }, [setNotes]);

  const handleScheduleReview = useCallback((problemId, rating) => {
    const now = new Date();
    setReviewDates(prevDates => {
      const currentInterval = prevDates[problemId]?.interval || 1;
      const nextInterval = rating >= 4 ? Math.min(currentInterval * 2, 60) :
                          rating >= 2 ? currentInterval :
                          Math.max(1, Math.floor(currentInterval / 2));
      
      const nextReview = new Date(now.getTime() + (nextInterval * 24 * 60 * 60 * 1000));
      const updatedReviewDates = {
        ...prevDates,
        [problemId]: {
          nextReview: nextReview.toISOString(),
          interval: nextInterval
        }
      };
      
      localStorage.setItem('reviewDates', JSON.stringify(updatedReviewDates));
      return updatedReviewDates;
    });
  }, [setReviewDates]);

  // Memoized filtered and grouped problems
  const filteredAndGroupedProblems = useMemo(() => {
    const filtered = problems.filter(problem => {
      const matchesTrack = selectedTrack ? problem.track.includes(selectedTrack) : true;
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTrack && matchesSearch;
    });

    return filtered.reduce((acc, problem) => {
      acc[problem.pattern] = acc[problem.pattern] || [];
      acc[problem.pattern].push(problem);
      return acc;
    }, {});
  }, [problems, selectedTrack, searchQuery]);

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Problems</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show landing page
  if (showLanding) {
    return (
      <LandingPage 
        onGetStarted={() => setShowLanding(false)}
        problems={problems}
      />
    );
  }

  // Main app content
  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            LeetCode Tracker
          </h1>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? 
              <Moon className="h-5 w-5 text-white" /> : 
              <Sun className="h-5 w-5 text-yellow-500" />
            }
          </button>
        </header>

        <ProgressStats 
          problems={Object.values(filteredAndGroupedProblems).flat()} 
          darkMode={darkMode} 
        />
        
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTrack={selectedTrack}
          onTrackChange={setSelectedTrack}
          darkMode={darkMode}
        />

        <div className="space-y-8">
          {Object.entries(filteredAndGroupedProblems).map(([pattern, patternProblems]) => (
            <section key={pattern} aria-labelledby={`pattern-${pattern}`}>
              <h2 
                id={`pattern-${pattern}`}
                className={`text-2xl font-bold px-4 py-2 rounded-lg shadow-md ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {pattern}
              </h2>
              
              <PatternProgress 
                problems={patternProblems}
                darkMode={darkMode}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {patternProblems.map(problem => (
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
            </section>
          ))}
        </div>

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
    </div>
  );
};

export default ProblemList;