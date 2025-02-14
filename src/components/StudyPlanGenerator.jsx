import React, { useState, useMemo } from 'react';
import { Calendar, Clock, BookOpen, ChevronDown, ChevronUp, Brain, Target, BarChart2 } from 'lucide-react';

const StudyPlanGenerator = ({ problems, darkMode }) => {
  const [targetDate, setTargetDate] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [showPlan, setShowPlan] = useState(false);
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [learningStyle, setLearningStyle] = useState('balanced');
  const [dailyGoal, setDailyGoal] = useState(2);
  const [selectedDifficulties, setSelectedDifficulties] = useState({
    Easy: true,
    Medium: true,
    Hard: false
  });

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

  // Generate study plan based on preferences
  const studyPlan = useMemo(() => {
    if (!targetDate || selectedPatterns.length === 0) return [];

    // Filter problems based on selected patterns and difficulties
    const filteredProblems = problems.filter(p => 
      selectedPatterns.includes(p.pattern) && 
      !p.completed &&
      selectedDifficulties[p.difficulty]
    );

    // Adjust problem selection based on skill level and learning style
    const sortedProblems = [...filteredProblems].sort((a, b) => {
      const difficultyScore = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      
      // Adjust scores based on skill level
      let aScore = difficultyScore[a.difficulty];
      let bScore = difficultyScore[b.difficulty];
      
      if (skillLevel === 'beginner') {
        aScore *= a.difficulty === 'Easy' ? 0.8 : 1.2;
        bScore *= b.difficulty === 'Easy' ? 0.8 : 1.2;
      } else if (skillLevel === 'advanced') {
        aScore *= a.difficulty === 'Hard' ? 0.8 : 1.2;
        bScore *= b.difficulty === 'Hard' ? 0.8 : 1.2;
      }

      return aScore - bScore;
    });

    // Estimate time per difficulty and learning style
    const baseTimeEstimates = {
      'Easy': 30,
      'Medium': 45,
      'Hard': 60
    };

    const timeEstimates = Object.entries(baseTimeEstimates).reduce((acc, [diff, time]) => {
      let adjustedTime = time;
      if (learningStyle === 'theory-focused') {
        adjustedTime *= 1.2; // More time for theoretical understanding
      } else if (learningStyle === 'practice-focused') {
        adjustedTime *= 0.8; // Less time, more problems
      }
      acc[diff] = adjustedTime;
      return acc;
    }, {});

    // Calculate problems per week based on daily goal
    const problemsPerWeek = dailyGoal * 7;
    const weeks = [];
    let problemIndex = 0;

    for (let week = 0; week < weeksUntilTarget && problemIndex < sortedProblems.length; week++) {
      const weekProblems = [];
      let weekMinutes = 0;
      let problemCount = 0;

      while (problemCount < problemsPerWeek && problemIndex < sortedProblems.length) {
        const problem = sortedProblems[problemIndex];
        const problemTime = timeEstimates[problem.difficulty];

        if (weekMinutes + problemTime <= weeklyHours * 60) {
          weekProblems.push({
            ...problem,
            estimatedTime: problemTime,
            learningFocus: learningStyle === 'theory-focused' ? 'Understand the concept deeply' :
                          learningStyle === 'practice-focused' ? 'Focus on implementation' :
                          'Balance theory and practice'
          });
          weekMinutes += problemTime;
          problemCount++;
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
  }, [problems, selectedPatterns, targetDate, weeklyHours, skillLevel, learningStyle, dailyGoal, selectedDifficulties]);

  const toggleDifficulty = (difficulty) => {
    setSelectedDifficulties(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };

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
          <h2 className="text-2xl font-bold">Personalized Study Plan Generator</h2>
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
            {/* Skill Level Selection */}
            <div>
              <label className="block mb-2 font-medium">Your Skill Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSkillLevel(level)}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      skillLevel === level
                        ? 'bg-blue-500 text-white border-blue-600'
                        : darkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <Brain className="h-4 w-4" />
                    <span className="capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Style Selection */}
            <div>
              <label className="block mb-2 font-medium">Learning Style Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {['theory-focused', 'balanced', 'practice-focused'].map(style => (
                  <button
                    key={style}
                    onClick={() => setLearningStyle(style)}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                      learningStyle === style
                        ? 'bg-blue-500 text-white border-blue-600'
                        : darkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="capitalize">{style.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block mb-2 font-medium">Problem Difficulties</label>
              <div className="flex gap-2">
                {Object.entries(selectedDifficulties).map(([difficulty, isSelected]) => (
                  <button
                    key={difficulty}
                    onClick={() => toggleDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      isSelected
                        ? difficulty === 'Easy'
                          ? 'bg-green-500 text-white border-green-600'
                          : difficulty === 'Medium'
                            ? 'bg-yellow-500 text-white border-yellow-600'
                            : 'bg-red-500 text-white border-red-600'
                        : darkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Goal Setting */}
            <div>
              <label className="block mb-2 font-medium">Daily Problem Goal</label>
              <div className="relative">
                <Target className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className={`pl-10 w-full p-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>
            </div>

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
                <h3 className="text-xl font-bold mb-4">Your Personalized Study Plan</h3>
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
                            className="flex flex-col gap-1 p-2 rounded bg-opacity-50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{problem.title}</span>
                              <span className={`text-sm px-2 py-0.5 rounded ${
                                problem.difficulty === 'Easy'
                                  ? 'bg-green-100 text-green-800'
                                  : problem.difficulty === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{problem.pattern}</span>
                              <span>~{problem.estimatedTime} mins</span>
                            </div>
                            <span className="text-sm text-gray-500">{problem.learningFocus}</span>
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