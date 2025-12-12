import React, { useState, useEffect, useRef } from 'react';
import { Search, Cloud } from 'lucide-react';
import { POPULAR_CITIES } from '../data/constants';

export default function SearchBar({ onSearch }){
  const [searchCity, setSearchCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      onSearch(searchCity.trim());
      setSearchCity('');
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);
    
    if (value.trim().length > 0) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions(POPULAR_CITIES.slice(0, 10));
      setShowSuggestions(true);
    }
  };

  const handleInputFocus = () => {
    if (searchCity.trim().length === 0) {
      setSuggestions(POPULAR_CITIES.slice(0, 10));
    }
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (cityName) => {
    setSearchCity(cityName);
    setShowSuggestions(false);
    onSearch(cityName);
    setSearchCity('');
  };

  return (
    <form onSubmit={handleSearch} className="relative" ref={searchRef}>
      <input
        type="text"
        value={searchCity}
        onChange={handleSearchChange}
        onFocus={handleInputFocus}
        placeholder="Enter city name..."
        className="w-64 px-4 py-2 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 backdrop-blur-sm"
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </button>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {searchCity.trim().length === 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Popular Cities</p>
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Cloud size={16} className="text-indigo-500" />
              </div>
              <span className="text-gray-700 font-medium">{suggestion}</span>
            </button>
          ))}
          {searchCity.trim().length === 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">Total {POPULAR_CITIES.length} cities available</p>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

