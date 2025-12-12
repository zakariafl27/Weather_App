import React from 'react';
import { Droplets, Wind, Sun, Cloud, Sunrise, Sunset } from 'lucide-react';

export default function StatCards ({ weatherData }){
  return (
    <div className="lg:col-span-1 space-y-4">
      <div className="stat-card rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Droplets className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="text-2xl font-semibold text-gray-800">{weatherData.current.humidity}%</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Sunset className="text-orange-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sunset</p>
                <p className="text-2xl font-semibold text-gray-800">{weatherData.sunset}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Sun className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">UV Index</p>
                <p className="text-2xl font-semibold text-gray-800">{weatherData.current.uvIndex} of 10</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Sunrise className="text-amber-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sunrise</p>
                <p className="text-2xl font-semibold text-gray-800">{weatherData.sunrise}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center">
              <Wind className="text-cyan-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wind Speed</p>
              <p className="text-2xl font-semibold text-gray-800">{weatherData.current.wind} m/s</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Cloud className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pressure</p>
              <p className="text-2xl font-semibold text-gray-800">1013 hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

