import React from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

export default function HeroCard({ weatherData }) {
  const isNightTime = () => {
    if (!weatherData) return false;
    const now = new Date();
    return now > weatherData.sunsetTime;
  };

  return (
    <div className="hero-card rounded-3xl p-8 sm:p-12 mb-6 relative overflow-hidden" style={{ minHeight: '400px' }}>
      {isNightTime() ? (
        <>
          <div className="moon"></div>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </>
      ) : (
        <div className="sun"></div>
      )}
      
      <div className="mountain-layer-1"></div>
      <div className="mountain-layer-2"></div>
      
      <div className="grass-layer">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="grass-blade"
            style={{
              left: `${(i / 40) * 100}%`,
              height: `${30 + Math.random() * 50}px`,
              opacity: 0.3 + Math.random() * 0.4,
              transform: `rotate(${-5 + Math.random() * 10}deg)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline mb-2">
              <span className="text-8xl sm:text-9xl font-light text-white tracking-tight">
                {weatherData.current.temp}°
              </span>
              <div className="ml-6">
                {getWeatherIcon(weatherData.current.icon, 64)}
              </div>
            </div>
            <p className="text-xl text-white/90 font-light">{weatherData.location}</p>
          </div>
          
          <div className="text-right">
            <p className="text-lg text-white/90 font-medium">{weatherData.sunset}</p>
            <p className="text-sm text-white/80">Sunset time, {weatherData.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

