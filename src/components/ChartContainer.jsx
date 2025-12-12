import React, { useState } from 'react';
import WeatherChart from './WeatherChart';
import WeeklyForecast from './WeeklyForecast';

export default function ChartContainer ({ weatherData }){
  const [chartMode, setChartMode] = useState('temperature');

  return (
    <div className="lg:col-span-2 stat-card rounded-2xl p-6">
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button 
          className={`chart-tab ${chartMode === 'temperature' ? 'active' : ''}`}
          onClick={() => setChartMode('temperature')}
        >
          Temperature
        </button>
        <button 
          className={`chart-tab ${chartMode === 'precipitation' ? 'active' : ''}`}
          onClick={() => setChartMode('precipitation')}
        >
          Precipitation
        </button>
        <button 
          className={`chart-tab ${chartMode === 'wind' ? 'active' : ''}`}
          onClick={() => setChartMode('wind')}
        >
          Wind
        </button>
      </div>
      
      <WeatherChart weatherData={weatherData} chartMode={chartMode} />
      
      <WeeklyForecast dailyForecast={weatherData.daily} />
    </div>
  );
};

