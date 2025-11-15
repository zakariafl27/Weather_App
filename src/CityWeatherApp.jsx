import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, CloudLightning, X, Plus, CloudSnow, CloudDrizzle, Search } from 'lucide-react';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Stockholm');
  const [searchCity, setSearchCity] = useState('');
  
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  
  useEffect(() => {
    fetchWeather(city);
  }, []);
  
  const fetchWeather = async (cityName = 'Stockholm') => {
    setLoading(true);
    setError(null);
    
    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`City "${cityName}" not found`);
      }
      
      const currentData = await currentResponse.json();
      
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const forecastData = await forecastResponse.json();
      
      const hourlyForecast = forecastData.list.slice(0, 9).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        icon: item.weather[0].main,
        temp: Math.round(item.main.temp),
        precip: item.rain ? item.rain['3h'] || 0 : 0,
        wind: Math.round(item.wind.speed),
        humidity: item.main.humidity
      }));
      
      const dailyData = {};
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = {
            temps: [],
            conditions: [],
            winds: [],
            humidity: [],
            precip: []
          };
        }
        
        dailyData[dayKey].temps.push(item.main.temp);
        dailyData[dayKey].conditions.push(item.weather[0].main);
        dailyData[dayKey].winds.push(item.wind.speed);
        dailyData[dayKey].humidity.push(item.main.humidity);
        dailyData[dayKey].precip.push(item.rain ? item.rain['3h'] || 0 : 0);
      });
      
      const dailyForecast = Object.keys(dailyData).slice(0, 7).map((dayKey, index) => {
        const date = new Date(dayKey);
        const dayData = dailyData[dayKey];
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));
        
        const conditionCounts = {};
        dayData.conditions.forEach(cond => {
          conditionCounts[cond] = (conditionCounts[cond] || 0) + 1;
        });
        const mostCommon = Object.keys(conditionCounts).reduce((a, b) => 
          conditionCounts[a] > conditionCounts[b] ? a : b
        );
        
        return {
          day: index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          icon: mostCommon,
          maxTemp,
          minTemp,
          wind: Math.round(dayData.winds.reduce((a, b) => a + b, 0) / dayData.winds.length),
          humidity: Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length),
          precip: dayData.precip.reduce((a, b) => a + b, 0)
        };
      });
      
      const sunrise = new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const sunset = new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      setWeatherData({
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }),
        current: {
          temp: Math.round(currentData.main.temp),
          icon: currentData.weather[0].main,
          precipitation: currentData.rain ? currentData.rain['1h'] || 0 : 0,
          wind: Math.round(currentData.wind.speed),
          humidity: currentData.main.humidity
        },
        sunrise: sunrise,
        sunset: sunset,
        hourly: hourlyForecast,
        daily: dailyForecast,
        location: currentData.name
      });
      
      setCity(currentData.name);
      
    } catch (err) {
      setError(err.message);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity('');
    }
  };

  const WeatherIcon = ({ type, size = 24 }) => {
    const iconProps = { size, className: 'text-white' };
    
    switch(type) {
      case 'Thunderstorm':
        return (
          <div className="relative inline-block">
            <Cloud {...iconProps} size={size * 1.5} />
            <Sun {...iconProps} className="absolute -top-2 -right-2" size={size * 0.8} />
            <CloudLightning {...iconProps} className="absolute top-4 left-2" size={size * 0.8} />
          </div>
        );
      case 'Clouds':
        return (
          <div className="relative inline-block">
            <Cloud {...iconProps} size={size} />
            <Sun {...iconProps} className="absolute -top-1 -right-1" size={size * 0.6} />
          </div>
        );
      case 'Clear':
        return <Sun {...iconProps} size={size} />;
      case 'Rain':
        return <CloudRain {...iconProps} size={size} />;
      case 'Drizzle':
        return <CloudDrizzle {...iconProps} size={size} />;
      case 'Snow':
        return <CloudSnow {...iconProps} size={size} />;
      default:
        return <Cloud {...iconProps} size={size} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center text-white text-center p-4">
        <div>
          <p className="text-lg font-semibold">Error loading weather data</p>
          <p className="text-sm mt-2 opacity-80">{error}</p>
          <button 
            onClick={() => fetchWeather(city)}
            className="mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 p-8">
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl shadow-2xl p-8 border-4 border-amber-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-light text-white">
            Weather in {city} <span className="text-red-400">📍</span>
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => fetchWeather('Stockholm')}
              className="w-12 h-12 rounded-full border-2 border-red-400 flex items-center justify-center hover:bg-red-400/20 transition"
            >
              <X className="text-red-400" size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search for a city..."
              className="w-full bg-slate-600/30 backdrop-blur-sm rounded-full py-3 px-5 pr-12 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-400/30 hover:bg-teal-400/50 rounded-full p-2 transition-all duration-200"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </form>

        {/* Current Weather */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-white/90 mb-8">{weatherData.date}</h2>
          
          <div className="flex items-center justify-center gap-8 mb-8">
            <WeatherIcon type={weatherData.current.icon} size={80} />
            
            <div className="text-9xl font-light text-white flex items-start">
              <span className="text-red-400 text-5xl mr-2 mt-4">
                {weatherData.current.temp > 0 ? '+' : ''}
              </span>
              {weatherData.current.temp}°
            </div>
            
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <Droplets className="text-blue-300" size={24} />
                <span className="text-white text-2xl">{weatherData.current.precipitation.toFixed(1)} mm</span>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="text-red-300" size={24} />
                <span className="text-white text-2xl">{weatherData.current.wind} m/s</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1 h-6 bg-white/60"></div>
                  <div className="w-1 h-6 bg-white/60"></div>
                  <div className="w-1 h-6 bg-white/60"></div>
                </div>
                <span className="text-white text-2xl">{weatherData.current.humidity}%</span>
              </div>
            </div>
          </div>

          {/* Sunrise/Sunset */}
          <div className="flex justify-between items-center max-w-2xl mx-auto text-white/80 text-xl">
            <div className="flex items-center gap-2">
              <Sun size={28} className="text-yellow-300" />
              <span>{weatherData.sunrise}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{weatherData.sunset}</span>
              <Sun size={28} className="text-orange-300" />
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="mb-12">
          <h3 className="text-2xl text-white/90 mb-4">Hourly Forecast</h3>
          <div className="grid grid-cols-9 gap-2">
            {weatherData.hourly.map((hour, index) => (
              <div key={index} className="bg-slate-600/30 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-white/70 text-sm mb-3">{hour.time}</div>
                
                <div className="flex justify-center mb-3">
                  <WeatherIcon type={hour.icon} size={32} />
                </div>
                
                <div className="text-white text-xl font-light mb-3">
                  {hour.temp > weatherData.current.temp ? '+' : ''}{hour.temp}°
                </div>
                
                <div className="text-white/60 text-xs mb-1">{hour.precip.toFixed(1)}</div>
                <div className="text-white/50 text-xs mb-1">mm</div>
                
                <div className="text-white/60 text-sm mb-1">{hour.wind}</div>
                <div className="text-white/50 text-xs mb-1">m/s</div>
                
                <div className="text-white/60 text-sm mb-1">{hour.humidity}</div>
                <div className="text-white/50 text-xs">%</div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div>
          <h3 className="text-2xl text-white/90 mb-4">7-Day Forecast</h3>
          <div className="grid grid-cols-7 gap-3">
            {weatherData.daily.map((day, index) => (
              <div key={index} className={`${day.day === 'Today' ? 'bg-teal-600/40' : 'bg-slate-600/30'} rounded-xl p-4 text-center backdrop-blur-sm hover:bg-slate-600/50 transition-all duration-200 cursor-pointer`}>
                <div className="text-white font-medium mb-2">{day.day}</div>
                <div className="text-white/70 text-sm mb-3">{day.date}</div>
                
                <div className="flex justify-center mb-3">
                  <WeatherIcon type={day.icon} size={40} />
                </div>
                
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-white text-xl font-light">{day.maxTemp}°</span>
                  <span className="text-white/50 text-lg">{day.minTemp}°</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className="text-blue-300" size={14} />
                    <span className="text-white/60 text-xs">{day.precip.toFixed(1)} mm</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Wind className="text-red-300" size={14} />
                    <span className="text-white/60 text-xs">{day.wind} m/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;