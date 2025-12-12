import React, { useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useWeatherData } from './hooks/useWeatherData';
import { globalStyles } from './styles/globalStyles';
import SearchBar from './components/SearchBar';
import HeroCard from './components/HeroCard';
import StatCards from './components/StatCards';
import ChartContainer from './components/ChartContainer';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

export default function WeatherApp() {
  const { weatherData, loading, error, city, fetchWeather } = useWeatherData();

  useEffect(() => {
    fetchWeather(city);
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => fetchWeather(city)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <style>{globalStyles}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-indigo-600">Z.F</h1>
          <div className="flex items-center gap-4">
            <SearchBar onSearch={fetchWeather} />
            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Menu size={24} className="text-indigo-500" />
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <HeroCard weatherData={weatherData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <StatCards weatherData={weatherData} />

          {/* Chart Card */}
          <ChartContainer weatherData={weatherData} />
        </div>
      </div>
    </div>
  );
}