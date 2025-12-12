import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

export default function WeeklyForecast({ dailyForecast }){
  return (
    <div className="grid grid-cols-7 gap-2 mt-8">
      {dailyForecast.map((day, index) => (
        <div key={index} className="text-center">
          <p className="text-xs font-medium text-gray-500 mb-2">{day.day}</p>
          <div className="flex justify-center mb-2">
            {getWeatherIcon(day.icon, 32)}
          </div>
          <p className="text-lg font-semibold text-gray-800">{day.temp}°</p>
        </div>
      ))}
    </div>
  );
};

