import React from 'react';
import { ChevronRight, CheckCircle2, Star, Clock, BarChart2, Book, GitCommit } from 'lucide-react';

const LandingPage = ({ onGetStarted, problems }) => {
  // Calculate real statistics
  const stats = {
    completedCount: problems?.filter(p => p.completed)?.length || 0,
    starredCount: problems?.filter(p => p.starred)?.length || 0,
    totalCount: problems?.length || 0,
    // Get the next 3 starred problems for review
    nextReview: problems
      ?.filter(p => p.starred)
      ?.slice(0, 3)
      || []
  };

  // Calculate completion percentage
  const completionRate = ((stats.completedCount / stats.totalCount) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to LeetCode Tracker
          </h1>
          <p className="text-xl mb-8 text-gray-100">
            Your personal companion for mastering data structures and algorithms
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
          >
            Get Started
            <ChevronRight className="ml-2 h-6 w-6" />
          </button>
        </div>

        {/* Progress Dashboard */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* Stats Cards */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-8">Your Progress Dashboard</h2>
            
            {/* Completion Rate */}
            <div className="flex items-center gap-4 bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <div className="p-3 bg-white/20 rounded-full">
                <BarChart2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Completion Rate</h3>
                <p className="text-gray-200">{completionRate}% of total problems</p>
              </div>
            </div>

            {/* Problems Solved */}
            <div className="flex items-center gap-4 bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <div className="p-3 bg-white/20 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Problems Solved</h3>
                <p className="text-gray-200">{stats.completedCount} out of {stats.totalCount} completed</p>
              </div>
            </div>

            {/* Problems to Review */}
            <div className="flex items-center gap-4 bg-white/10 p-6 rounded-xl backdrop-blur-lg">
              <div className="p-3 bg-white/20 rounded-full">
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">To Review</h3>
                <p className="text-gray-200">{stats.starredCount} problems marked for review</p>
              </div>
            </div>
          </div>

          {/* Next Review Session Card */}
          <div className="bg-white/10 p-8 rounded-xl backdrop-blur-lg">
            <h3 className="text-2xl font-semibold mb-6">Next Review Session</h3>
            <div className="space-y-4">
              {stats.nextReview.length > 0 ? (
                stats.nextReview.map(problem => (
                  <div key={problem.id} className="p-4 bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-semibold">{problem.title}</h4>
                    </div>
                    <p className="text-gray-200">{problem.pattern}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-gray-200">No problems marked for review</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10" />}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed statistics and visual progress indicators"
            />
            <FeatureCard
              icon={<Book className="h-10 w-10" />}
              title="Personal Notes"
              description="Create and maintain detailed notes for each problem to reinforce your understanding"
            />
            <FeatureCard
              icon={<GitCommit className="h-10 w-10" />}
              title="Spaced Repetition"
              description="Optimize your learning with our built-in spaced repetition system"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-200">{description}</p>
  </div>
);

export default LandingPage;