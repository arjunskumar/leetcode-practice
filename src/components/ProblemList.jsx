import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sun, Moon, ChevronDown, ChevronRight } from 'lucide-react';
import ProblemModal from './ProblemModal';
import SearchBar from './SearchBar';
import ProgressStats from './ProgressStats';
import ProblemCard from './ProblemCard';
import LandingPage from './LandingPage';
import useLocalStorage from '../hooks/useLocalStorage';
import useProblemData from '../hooks/useProblemData';
import Toast from './Toast';
import StudyPlanGenerator from './StudyPlanGenerator';

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
   // Add toast state
  const [toast, setToast] = useState({
  show: false,
  message: '',
  type: 'success'
  });
  const [showLanding, setShowLanding] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (pattern) => {
    setCollapsedSections(prev => ({
      ...prev,
      [pattern]: !prev[pattern]
    }));
  };

  // Show toast helper function
  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  
  const handleToggleCompletion = useCallback((id) => {
    setProblems(prevProblems => {
      const updatedProblems = prevProblems.map(p => {
        if (p.id === id) {
          const newCompleted = !p.completed;
          // Show appropriate toast message
          showToast(
            newCompleted ? 'Problem marked as completed! 🎉' : 'Problem marked as incomplete',
            'success'
          );
          return { ...p, completed: newCompleted };
        }
        return p;
      });
      
      const progress = updatedProblems.reduce((acc, p) => ({
        ...acc,
        [p.id]: { completed: p.completed, starred: p.starred }
      }), {});
      localStorage.setItem('userProgress', JSON.stringify(progress));
      
      return updatedProblems;
    });
  }, []);


  const handleToggleStarred = useCallback((id) => {
    setProblems(prevProblems => {
      const updatedProblems = prevProblems.map(p => {
        if (p.id === id) {
          const newStarred = !p.starred;
          showToast(
            newStarred ? 'Added to review list ⭐' : 'Removed from review list',
            'success'
          );
          return { ...p, starred: newStarred };
        }
        return p;
      });
      
      const progress = updatedProblems.reduce((acc, p) => ({
        ...acc,
        [p.id]: { completed: p.completed, starred: p.starred }
      }), {});
      localStorage.setItem('userProgress', JSON.stringify(progress));
      
      return updatedProblems;
    });
  }, []);

  const handleSaveNotes = useCallback((id, note) => {
    setNotes(prevNotes => {
      const updatedNotes = { ...prevNotes, [id]: note };
      localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
      showToast('Notes saved successfully 📝');
      return updatedNotes;
    });
  }, []);

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
      showToast(`Next review scheduled for ${nextReview.toLocaleDateString()} 📅`);
      return updatedReviewDates;
    });
  }, []);

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

  // Initialize collapsed state for new patterns
  useEffect(() => {
    const patterns = Object.keys(filteredAndGroupedProblems);
    const initialCollapsed = patterns.reduce((acc, pattern) => ({
      ...acc,
      [pattern]: true // Set to true for initially collapsed
    }), {});
    setCollapsedSections(prev => ({
      ...initialCollapsed,
      ...prev
    }));
  }, [filteredAndGroupedProblems]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <LandingPage 
        onGetStarted={() => setShowLanding(false)}
        problems={problems}
      />
    );
  }

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
        {/* Add the StudyPlanGenerator here */}
        <div className="mb-8">
          <StudyPlanGenerator 
            problems={problems}
            darkMode={darkMode}
          />
        </div>

        <div className="space-y-8">
          {Object.entries(filteredAndGroupedProblems).map(([pattern, patternProblems]) => {
            const completedCount = patternProblems.filter(p => p.completed).length;
            const progressPercent = (completedCount / patternProblems.length) * 100;
            
            let bgColor;
            if (progressPercent === 100) {
              bgColor = darkMode ? 'bg-green-700' : 'bg-green-100';
            } else if (progressPercent > 50) {
              bgColor = darkMode ? 'bg-yellow-700' : 'bg-yellow-100';
            } else {
              bgColor = darkMode ? 'bg-gray-700' : 'bg-blue-100';
            }

            return (
              <section key={pattern} aria-labelledby={`pattern-${pattern}`}>
                <div className="relative">
                  <div 
                    className={`absolute inset-0 ${darkMode ? 'bg-green-600' : 'bg-green-200'} rounded-lg transition-all duration-300`}
                    style={{ width: `${progressPercent}%` }}
                  />
                  <button 
                    onClick={() => toggleSection(pattern)}
                    className={`w-full flex items-center justify-between text-left px-4 py-2 rounded-lg shadow-md relative z-10 ${darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white bg-opacity-50'} hover:bg-opacity-75 transition-all duration-200`}
                  >
                    <h2 
                      id={`pattern-${pattern}`}
                      className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {pattern}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {completedCount}/{patternProblems.length}
                      </span>
                      <div className={`${darkMode ? 'text-white' : 'text-gray-600'}`}>
                        {collapsedSections[pattern] ? 
                          <ChevronRight className="h-6 w-6" /> : 
                          <ChevronDown className="h-6 w-6" />
                        }
                      </div>
                    </div>
                  </button>
                </div>
                
                {!collapsedSections[pattern] && (
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
                )}
              </section>
            );
          })}
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

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
      </div>
    </div>
  );
};

export default ProblemList;