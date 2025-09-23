import React from 'react';
import { Search, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

// Weather Icons Component
const WeatherIcon = ({ type, size = "w-12 h-12" }) => {
  const icons = {
    heavyRain: (
      <div className={`${size} relative`}>
        <div className="w-full h-6 bg-gray-300 rounded-full mb-1"></div>
        <div className="flex justify-center space-x-0.5">
          <div className="w-0.5 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-0.5 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-0.5 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-0.5 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-0.5 h-4 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    ),
    partlyCloudy: (
      <div className={`${size} relative flex items-center justify-center`}>
        <div className="w-6 h-6 bg-yellow-400 rounded-full absolute -top-1 -right-1 z-10"></div>
        <div className="w-8 h-5 bg-gray-300 rounded-full"></div>
      </div>
    ),
    thunderstorm: (
      <div className={`${size} relative`}>
        <div className="w-full h-6 bg-gray-300 rounded-full mb-1"></div>
        <div className="flex justify-center items-end space-x-0.5">
          <div className="w-0.5 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-4 bg-yellow-400 transform rotate-12" style={{clipPath: 'polygon(20% 0%, 80% 0%, 60% 100%, 40% 100%)'}}></div>
          <div className="w-0.5 h-3 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    )
  };

  return icons[type] || icons.partlyCloudy;
};

// Sun Icon for sunrise/sunset
const SunIcon = () => (
  <div className="w-10 h-10 relative flex items-center justify-center">
    <div className="w-6 h-6 bg-yellow-400 rounded-full relative">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-2 bg-yellow-400 rounded-full"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-12px)`,
            transformOrigin: 'center 12px'
          }}
        ></div>
      ))}
    </div>
  </div>
);

// Wind Icon
const WindIcon = () => (
  <div className="w-10 h-10 flex items-center justify-center">
    <div className="relative">
      <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
      <div className="absolute -right-1 -top-0.5 w-2 h-2 border-r-2 border-t-2 border-gray-400 transform rotate-45"></div>
    </div>
  </div>
);

// Humidity Icon
const HumidityIcon = () => (
  <div className="w-10 h-10 flex items-center justify-center">
    <div className="w-4 h-6 rounded-full border-2 border-blue-400 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-blue-400 rounded-full"></div>
    </div>
  </div>
);

// Visibility Icon
const VisibilityIcon = () => (
  <div className="w-10 h-10 flex items-center justify-center">
    <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    </div>
  </div>
);

// Header Component
const Header = () => (
  <div className="flex items-center justify-between mb-8">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input 
        type="text" 
        placeholder="Search location..."
        className="bg-slate-700 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
      />
    </div>
    <h2 className="text-xl font-medium text-white">10 Days Forecast</h2>
    <div className="flex space-x-2">
      <button className="bg-slate-700 rounded-full p-2 hover:bg-slate-600 transition-colors">
        <ChevronLeft className="w-5 h-5 text-gray-300" />
      </button>
      <button className="bg-slate-700 rounded-full p-2 hover:bg-slate-600 transition-colors">
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  </div>
);

// Main Weather Card Component
const MainWeatherCard = () => (
  <div className="bg-slate-800 rounded-3xl p-6 h-fit">
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-6xl font-light text-white mb-2">25°C</h1>
        <p className="text-lg text-white mb-2">Heavy Rain</p>
        <div className="flex items-center text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">Florida, US</span>
        </div>
      </div>
      <div className="mt-4">
        <WeatherIcon type="heavyRain" size="w-16 h-16" />
      </div>
    </div>
  </div>
);

// Forecast Days Component  
const ForecastDays = () => {
  const days = [
    { day: 'Today', temp: '25°C', icon: 'heavyRain' },
    { day: 'Mon', temp: '28°C', icon: 'partlyCloudy' },
    { day: 'Tue', temp: '24°C', icon: 'heavyRain' },
    { day: 'Wed', temp: '23°C', icon: 'thunderstorm' },
    { day: 'Thu', temp: '32°C', icon: 'partlyCloudy' }
  ];

  return (
    <div className="flex space-x-3 mb-6">
      {days.map((day, index) => (
        <div key={index} className={`${index === 0 ? 'bg-slate-600' : 'bg-slate-800'} rounded-2xl p-4 flex-1 text-center min-w-0`}>
          <p className="text-gray-400 text-sm mb-3">{day.day}</p>
          <div className="flex justify-center mb-3">
            <WeatherIcon type={day.icon} size="w-8 h-8" />
          </div>
          <p className="text-white font-medium text-sm">{day.temp}</p>
        </div>
      ))}
    </div>
  );
};

// Today's Highlight Card
const TodaysHighlight = () => (
  <div className="bg-slate-800 rounded-3xl p-6">
    <h3 className="text-white text-xl font-medium mb-6">Today's Highlight</h3>
    
    <div className="grid grid-cols-2 gap-6">
      {/* Sunrise */}
      <div className="flex flex-col items-center text-center">
        <SunIcon />
        <p className="text-gray-400 text-sm mt-2 mb-1">Sunrise</p>
        <p className="text-white text-lg font-medium">6:41 AM</p>
        <p className="text-gray-500 text-xs">9:00 AM</p>
      </div>
      
      {/* Wind Status */}
      <div className="flex flex-col items-center text-center">
        <WindIcon />
        <p className="text-gray-400 text-sm mt-2 mb-1">Wind Status</p>
        <p className="text-white text-lg font-medium">7.9 <span className="text-sm font-normal">km/h</span></p>
      </div>
      
      {/* Sunset */}
      <div className="flex flex-col items-center text-center">
        <SunIcon />
        <p className="text-gray-400 text-sm mt-2 mb-1">Sunset</p>
        <p className="text-white text-lg font-medium">6:35 AM</p>
        <p className="text-gray-500 text-xs">Moderate UV</p>
      </div>
      
      {/* Humidity */}
      <div className="flex flex-col items-center text-center">
        <HumidityIcon />
        <p className="text-gray-400 text-sm mt-2 mb-1">Humidity</p>
        <p className="text-white text-lg font-medium">85 <span className="text-sm font-normal">%</span></p>
        <p className="text-gray-500 text-xs">Humidity is good</p>
      </div>
      
      {/* UV Index */}
      <div className="flex flex-col items-center text-center">
        <SunIcon />
        <p className="text-gray-400 text-sm mt-2 mb-1">UV Index</p>
        <p className="text-white text-lg font-medium">4 <span className="text-sm font-normal">UV</span></p>
      </div>
      
      {/* Visibility */}
      <div className="flex flex-col items-center text-center">
        <VisibilityIcon />
        <p className="text-gray-400 text-sm mt-2 mb-1">Visibility</p>
        <p className="text-white text-lg font-medium">5.6 <span className="text-sm font-normal">km</span></p>
        <p className="text-gray-500 text-xs">9:00 AM</p>
      </div>
    </div>
  </div>
);

// Monthly Rainfall Component
const MonthlyRainfall = () => (
  <div className="bg-slate-800 rounded-3xl p-6">
    <h3 className="text-white text-xl font-medium mb-6">Monthly Rainfall</h3>
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1e293b"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${30 * 2.51}, 251`}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#f97316"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${70 * 2.51}, 251`}
            strokeDashoffset={`-${30 * 2.51}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-orange-500">70%</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-gray-400 text-sm">Sun</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-400 text-sm">Rain</span>
        </div>
      </div>
    </div>
  </div>
);

// Other Countries Component
const OtherCountries = () => {
  const countries = [
    { 
      country: 'Australia', 
      city: 'Canberra', 
      temp: '26°C', 
      condition: 'Clear',
      gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800'
    },
    { 
      country: 'Japan', 
      city: 'Tokyo', 
      temp: '30°C', 
      condition: 'Mostly Sunny',
      gradient: 'bg-gradient-to-r from-blue-600 to-blue-800'
    },
    { 
      country: 'Russia', 
      city: 'Moscow', 
      temp: '-4°C', 
      condition: 'Cloudy',
      gradient: 'bg-gradient-to-r from-purple-600 to-pink-600'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-xl font-medium">Others Countries</h3>
        <button className="text-blue-400 text-sm hover:text-blue-300">See more</button>
      </div>
      <div className="space-y-3">
        {countries.map((country, index) => (
          <div key={index} className={`${country.gradient} rounded-2xl p-4 text-white relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-200 opacity-90">{country.country}</p>
                <p className="text-xl font-medium mb-1">{country.city}</p>
                <p className="text-sm text-gray-200 opacity-90">{country.condition}</p>
              </div>
              <p className="text-2xl font-light">{country.temp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const WeatherApp = () => {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main weather and highlights */}
          <div className="col-span-4 space-y-6">
            <MainWeatherCard />
            <TodaysHighlight />
          </div>
          
          {/* Middle Column - Forecast and rainfall */}
          <div className="col-span-4 space-y-6">
            <ForecastDays />
            <MonthlyRainfall />
          </div>
          
          {/* Right Column - Other countries */}
          <div className="col-span-4">
            <OtherCountries />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;