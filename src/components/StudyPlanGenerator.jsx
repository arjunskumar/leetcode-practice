// src/components/StudyPlanGenerator.jsx

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const StudyPlanGenerator = ({ problems, darkMode }) => {
  const [targetDate, setTargetDate] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [showPlan, setShowPlan] = useState(false);

  // Get unique patterns from problems
  const patterns = useMemo(() => {
    return [...new Set(problems.map(p => p.pattern))];
  }, [problems]);

  // Calculate weeks until target date
  const weeksUntilTarget = useMemo(() => {
    if (!targetDate) return 0;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = Math.abs(target - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }, [targetDate]);

  // Generate study plan
  const studyPlan = useMemo(() => {
    if (!targetDate || selectedPatterns.length === 0) return [];

    const filteredProblems = problems.filter(p => 
      selectedPatterns.includes(p.pattern) && !p.completed
    );

    // Sort problems by difficulty
    const sortedProblems = [...filteredProblems].sort((a, b) => {
      const difficultyScore = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyScore[a.difficulty] - difficultyScore[b.difficulty];
    });

    // Estimate time per difficulty
    const timeEstimates = {
      'Easy': 30,    // 30 minutes
      'Medium': 45,  // 45 minutes
      'Hard': 60     // 60 minutes
    };

    // Calculate problems per week based on time commitment
    const minutesPerWeek = weeklyHours * 60;
    const problemsPerWeek = Math.floor(minutesPerWeek / 45); // Average time per problem

    // Distribute problems across weeks
    const weeks = [];
    let problemIndex = 0;

    for (let week = 0; week < weeksUntilTarget && problemIndex < sortedProblems.length; week++) {
      const weekProblems = [];
      let weekMinutes = 0;

      while (weekMinutes < minutesPerWeek && problemIndex < sortedProblems.length) {
        const problem = sortedProblems[problemIndex];
        const problemTime = timeEstimates[problem.difficulty];

        if (weekMinutes + problemTime <= minutesPerWeek) {
          weekProblems.push(problem);
          weekMinutes += problemTime;
          problemIndex++;
        } else {
          break;
        }
      }

      weeks.push({
        weekNumber: week + 1,
        problems: weekProblems,
        totalTime: weekMinutes
      });
    }

    return weeks;
  }, [problems, selectedPatterns, targetDate, weeklyHours, weeksUntilTarget]);

  const togglePattern = (pattern) => {
    setSelectedPatterns(prev => 
      prev.includes(pattern)
        ? prev.filter(p => p !== pattern)
        : [...prev, pattern]
    );
  };

  return (
    <div className={`w-full rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Study Plan Generator</h2>
          <button
            onClick={() => setShowPlan(!showPlan)}
            className="text-sm hover:opacity-80 transition-opacity"
          >
            {showPlan ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {showPlan && (
        <div className="p-6">
          <div className="space-y-6">
            {/* Target Date Input */}
            <div>
              <label className="block mb-2 font-medium">Target Completion Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className={`pl-10 w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Weekly Hours Input */}
            <div>
              <label className="block mb-2 font-medium">Weekly Time Commitment (hours)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className={`pl-10 w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Pattern Selection */}
            <div>
              <label className="block mb-2 font-medium">Select Patterns to Focus On</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {patterns.map(pattern => (
                  <button
                    key={pattern}
                    onClick={() => togglePattern(pattern)}
                    className={`p-2 rounded-lg border transition-colors ${
                      selectedPatterns.includes(pattern)
                        ? 'bg-blue-500 text-white border-blue-600'
                        : darkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Plan */}
            {studyPlan.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Your Study Plan</h3>
                <div className="space-y-4">
                  {studyPlan.map(week => (
                    <div
                      key={week.weekNumber}
                      className={`p-4 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <h4 className="font-semibold mb-2">
                        Week {week.weekNumber} ({Math.round(week.totalTime / 60)} hours)
                      </h4>
                      <ul className="space-y-2">
                        {week.problems.map(problem => (
                          <li
                            key={problem.id}
                            className="flex items-center justify-between"
                          >
                            <span>
                              {problem.title}
                              <span className={`ml-2 text-sm px-2 py-0.5 rounded ${
                                problem.difficulty === 'Easy'
                                  ? 'bg-green-100 text-green-800'
                                  : problem.difficulty === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </span>
                            <span className="text-sm text-gray-500">
                              {problem.pattern}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanGenerator;