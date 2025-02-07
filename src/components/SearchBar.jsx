import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange, selectedTrack, onTrackChange, darkMode }) => (
  <div className="mb-8 flex gap-4">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search problems..."
        className={`pl-10 pr-4 py-2 w-full border rounded-lg ${
          darkMode ? 'bg-gray-800 text-white border-gray-600' : ''
        }`}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    
    <select 
      value={selectedTrack} 
      onChange={(e) => onTrackChange(e.target.value)}
      className="bg-gray-200 p-2 rounded-md"
    >
      <option value="">All Tracks</option>
      <option value="< 1 month">{"< 1 month"}</option>
      <option value="1-3 months">1-3 months</option>
      <option value="3+ months">3+ months</option>
    </select>
  </div>
);

export default SearchBar;