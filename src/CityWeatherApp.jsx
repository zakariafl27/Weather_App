import React, { useState, useEffect } from 'react';
import { Menu, Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, Zap, Search, ArrowLeft } from 'lucide-react';

export default function WeatherApp (){
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchCity, setSearchCity] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [detailedForecast, setDetailedForecast] = useState([]);
  
  // Your OpenWeatherMap API key
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (city = 'Casablanca') => {
    setLoading(true);
    setError(null);
    
    try {
      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`City "${city}" not found`);
      }
      
      const currentData = await currentResponse.json();
      
      // 5-day forecast (3-hour intervals)
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const forecastData = await forecastResponse.json();
      
      // Store all forecast data for detailed view
      setDetailedForecast(forecastData.list);
      
      // Process forecast data to get daily averages
      const dailyForecast = [];
      const dailyData = {};
      
      // Group forecast data by day
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = {
            temps: [],
            conditions: [],
            winds: [],
            humidity: [],
            items: []
          };
        }
        
        dailyData[dayKey].temps.push(item.main.temp);
        dailyData[dayKey].conditions.push(item.weather[0]);
        dailyData[dayKey].winds.push(item.wind.speed);
        dailyData[dayKey].humidity.push(item.main.humidity);
        dailyData[dayKey].items.push(item);
      });
      
      // Create daily forecast array
      Object.keys(dailyData).slice(0, 6).forEach((dayKey, index) => {
        const date = new Date(dayKey);
        const dayData = dailyData[dayKey];
        const avgTemp = Math.round(dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length);
        const mostCommonCondition = dayData.conditions[0]; // Use first condition for simplicity
        
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        
        dailyForecast.push({
          day: isToday ? 'Today' : date.toLocaleDateString('en', { weekday: 'short' }),
          fullDate: date,
          temp: avgTemp,
          icon: mostCommonCondition.main,
          description: mostCommonCondition.description,
          isToday: isToday,
          dayKey: dayKey,
          detailedItems: dayData.items,
          avgWind: Math.round(dayData.winds.reduce((a, b) => a + b, 0) / dayData.winds.length * 3.6),
          avgHumidity: Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length)
        });
      });
      
      setWeatherData({
        current: {
          temp: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          description: currentData.weather[0].description,
          windSpeed: Math.round(currentData.wind.speed * 3.6),
          humidity: currentData.main.humidity,
          feelsLike: Math.round(currentData.main.feels_like)
        },
        forecast: dailyForecast,
        location: currentData.name,
        country: currentData.sys.country
      });
      
    } catch (err) {
      setError(err.message);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (condition, size = 'w-8 h-8') => {
    const iconClass = `${size} text-white`;
    
    switch (condition) {
      case 'Clear':
        return <Sun className={iconClass} />;
      case 'Clouds':
        return <Cloud className={iconClass} />;
      case 'Rain':
        return <CloudRain className={iconClass} />;
      case 'Drizzle':
        return <CloudDrizzle className={iconClass} />;
      case 'Snow':
        return <CloudSnow className={iconClass} />;
      case 'Thunderstorm':
        return <Zap className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = () => {
    const options = { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return currentTime.toLocaleDateString('en-US', options);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchCity.trim()) {
      console.log('Searching for:', searchCity.trim());
      fetchWeather(searchCity.trim());
      setSearchCity('');
      setShowSearch(false);
      setSelectedDay(null); // Reset selected day when searching
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const handleBackToMain = () => {
    setSelectedDay(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center text-white text-center p-4">
        <div>
          <p className="text-lg font-semibold">Error loading weather data</p>
          <p className="text-sm mt-2 opacity-80">{error}</p>
          <button 
            onClick={() => fetchWeather()}
            className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show detailed day view
  if (selectedDay) {
    return (
      <div className="min-h-screen bg-blue-500 text-white">
        {/* Header */}
        <div className="flex justify-between items-center p-4 pt-8">
          <button onClick={handleBackToMain} className="flex items-center">
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <div className="text-base font-medium">{formatTime(currentTime)}</div>
            <div className="text-sm opacity-90">{selectedDay.fullDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className="w-16"></div> {/* Spacer */}
        </div>

        {/* Day Weather Detail */}
        <div className="flex flex-col items-center justify-center px-4 mt-8">
          <div className="flex items-center justify-center mb-8">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="text-lg">{weatherData.location}</span>
          </div>
          
          {/* Temperature and Icon */}
          <div className="flex items-center justify-center mb-6 space-x-4">
            <div className="text-8xl font-thin">
              {selectedDay.temp}°
            </div>
            {getWeatherIcon(selectedDay.icon, 'w-20 h-20')}
          </div>
          
          {/* Weather Description */}
          <div className="text-xl capitalize mb-6">
            {selectedDay.description}
          </div>
          
          {/* Weather Stats */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm opacity-75">Wind Speed</span>
              <span className="text-lg">{selectedDay.avgWind} km/h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Humidity</span>
              <span className="text-lg">{selectedDay.avgHumidity}%</span>
            </div>
          </div>

          {/* Hourly forecast for the selected day */}
          <div className="w-full max-w-md">
            <h3 className="text-lg font-medium mb-4 text-center">Hourly Forecast</h3>
            <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedDay.detailedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">
                      {new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getWeatherIcon(item.weather[0].main, 'w-5 h-5')}
                      <span className="text-sm">{Math.round(item.main.temp)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main weather view
  return (
    <div className="min-h-screen bg-blue-500 relative overflow-hidden">
      <div className="flex justify-between items-center p-4 pt-8 text-white">
        <Menu className="w-6 h-6" />
        <div className="text-center">
          <div className="text-base font-medium">{formatTime(currentTime)}</div>
          <div className="text-sm opacity-90">{formatDate()}</div>
        </div>
        <div className="w-6 h-6"></div> {/* Spacer */}
      </div>

      {/* Centered Search Bar */}
      <div className="flex justify-center px-4 mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a city..."
            className="w-full bg-white bg-opacity-20 backdrop-blur-md rounded-full py-3 px-4 pr-12 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:bg-opacity-30"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all duration-200"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Current Weather - Centered */}
      <div className="flex flex-col items-center justify-center text-white px-4" style={{marginTop: '10vh'}}>
        {/* Location */}
        <div className="flex items-center justify-center mb-8">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="text-lg">{weatherData.location}</span>
        </div>
        
        {/* Temperature and Icon */}
        <div className="flex items-center justify-center mb-6 space-x-4">
          <div className="text-8xl font-thin">
            {weatherData.current.temp}°
          </div>
          {getWeatherIcon(weatherData.current.condition, 'w-20 h-20')}
        </div>
        
        {/* Weather Description */}
        <div className="text-xl capitalize mb-2">
          {weatherData.current.description}
        </div>
        
        {/* Wind Speed */}
        <div className="text-lg opacity-90">
          {weatherData.current.windSpeed} km/h
        </div>
      </div>

      {/* 6-day forecast */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-20 backdrop-blur-md rounded-t-3xl p-4">
        <div className="flex justify-between space-x-2">
          {weatherData.forecast.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={`text-center flex-1 ${day.isToday ? 'bg-blue-600' : 'bg-white bg-opacity-10'} rounded-2xl py-4 px-2 text-white hover:bg-opacity-20 transition-all duration-200 cursor-pointer hover:scale-105`}
            >
              <div className="text-sm font-medium mb-1">{day.day}</div>
              <div className="text-xs opacity-75 mb-3">
                {day.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="mb-3">
                {getWeatherIcon(day.icon, 'w-6 h-6 mx-auto')}
              </div>
              <div className="text-lg font-semibold">
                {day.temp}°
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

