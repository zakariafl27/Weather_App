import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog, Droplets, Wind, Sunrise, Sunset } from 'lucide-react';
import * as d3 from 'd3';

export default function WeatherApp(){
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Stockholm');
  const [searchCity, setSearchCity] = useState('');
  const [chartMode, setChartMode] = useState('temperature');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chartRef = useRef(null);
  const searchRef = useRef(null);
  
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  
  const popularCities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney',
    'Dubai', 'Singapore', 'Los Angeles', 'Barcelona', 'Rome',
    'Amsterdam', 'Berlin', 'Madrid', 'Istanbul', 'Bangkok',
    'Hong Kong', 'Toronto', 'Chicago', 'San Francisco', 'Miami',
    'Stockholm', 'Copenhagen', 'Oslo', 'Helsinki', 'Vienna',
    'Prague', 'Budapest', 'Warsaw', 'Athens', 'Lisbon',
    'Dublin', 'Brussels', 'Zurich', 'Munich', 'Hamburg',
    'Moscow', 'Seoul', 'Beijing', 'Shanghai', 'Mumbai',
    'Delhi', 'Bangalore', 'Melbourne', 'Vancouver', 'Montreal',
    'Rio de Janeiro', 'Buenos Aires', 'Mexico City', 'Cairo', 'Cape Town'
  ];
  
  useEffect(() => {
    fetchWeather(city);
  }, []);

  useEffect(() => {
    if (weatherData && chartRef.current) {
      renderChart();
    }
  }, [weatherData, chartMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      
      const hourlyForecast = forecastData.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        hour: new Date(item.dt * 1000).getHours(),
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
          day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          icon: mostCommon,
          temp: maxTemp,
          wind: Math.round(dayData.winds.reduce((a, b) => a + b, 0) / dayData.winds.length),
          humidity: Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length),
          precip: dayData.precip.reduce((a, b) => a + b, 0)
        };
      });
      
      const sunrise = new Date(currentData.sys.sunrise * 1000);
      const sunset = new Date(currentData.sys.sunset * 1000);
      
      setWeatherData({
        date: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        current: {
          temp: Math.round(currentData.main.temp),
          icon: currentData.weather[0].main,
          precipitation: currentData.rain ? currentData.rain['1h'] || 0 : 0,
          wind: Math.round(currentData.wind.speed),
          humidity: currentData.main.humidity,
          uvIndex: 0
        },
        sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        sunsetTime: sunset,
        hourly: hourlyForecast,
        daily: dailyForecast,
        location: `${currentData.name}, ${currentData.sys.country}`,
        monthlyRainfall: Math.round(Math.random() * 100)
      });
      
      setCity(currentData.name);
      
    } catch (err) {
      setError(err.message);
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartRef.current || !weatherData) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = chartRef.current.offsetWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = weatherData.hourly.map((d, i) => ({
      index: i,
      time: d.time,
      value: chartMode === 'temperature' ? d.temp : 
             chartMode === 'precipitation' ? d.precip : 
             d.wind
    }));

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.value) - 2,
        d3.max(data, d => d.value) + 2
      ])
      .range([height, 0]);

    const area = d3.area()
      .x((d, i) => x(i))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveCardinal.tension(0.5));

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d.value))
      .curve(d3.curveCardinal.tension(0.5));

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "areaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#8B9FE8")
      .attr("stop-opacity", 0.3);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#E8EBFA")
      .attr("stop-opacity", 0.1);

    svg.append("path")
      .datum(data)
      .attr("fill", "url(#areaGradient)")
      .attr("d", area);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#5B6FB8")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    data.forEach((d, i) => {
      svg.append("circle")
        .attr("cx", x(i))
        .attr("cy", y(d.value))
        .attr("r", 0)
        .attr("fill", "#5B6FB8")
        .transition()
        .delay(i * 50)
        .duration(500)
        .attr("r", 4);

      svg.append("text")
        .attr("x", x(i))
        .attr("y", y(d.value) - 12)
        .attr("text-anchor", "middle")
        .attr("fill", "#2C3E50")
        .attr("font-size", "13px")
        .attr("font-weight", "500")
        .attr("opacity", 0)
        .text(Math.round(d.value))
        .transition()
        .delay(i * 50)
        .duration(500)
        .attr("opacity", 1);
    });

    const xAxis = d3.axisBottom(x)
      .tickValues(d3.range(data.length))
      .tickFormat((d, i) => {
        const time = data[i].time;
        return time.split(' ')[0];
      });

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove())
      .call(g => g.selectAll("text")
        .attr("fill", "#6B7280")
        .attr("font-size", "11px")
        .attr("font-family", "'Outfit', sans-serif"));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
      setSearchCity('');
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchCity(value);
    
    if (value.trim().length > 0) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setSearchCity(cityName);
    setShowSuggestions(false);
    fetchWeather(cityName);
    setSearchCity('');
  };

  const getWeatherIcon = (condition, size = 24) => {
    const iconProps = { size, strokeWidth: 2 };
    
    switch(condition) {
      case 'Clear':
        return <Sun {...iconProps} className="text-yellow-500" />;
      case 'Clouds':
        return <Cloud {...iconProps} className="text-gray-400" />;
      case 'Rain':
        return <CloudRain {...iconProps} className="text-blue-500" />;
      case 'Drizzle':
        return <CloudDrizzle {...iconProps} className="text-blue-400" />;
      case 'Thunderstorm':
        return <CloudLightning {...iconProps} className="text-purple-500" />;
      case 'Snow':
        return <CloudSnow {...iconProps} className="text-blue-200" />;
      case 'Mist':
      case 'Fog':
        return <CloudFog {...iconProps} className="text-gray-300" />;
      default:
        return <Cloud {...iconProps} className="text-gray-400" />;
    }
  };

  const isNightTime = () => {
    if (!weatherData) return false;
    const now = new Date();
    return now > weatherData.sunsetTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Cloud className="animate-pulse text-indigo-400" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{error}</p>
          <button 
            onClick={() => fetchWeather(city)}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Outfit', sans-serif;
        }
        
        /* Custom Scrollbar for Suggestions */
        .max-h-80::-webkit-scrollbar {
          width: 6px;
        }
        
        .max-h-80::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .max-h-80::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        
        .max-h-80::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
        
        .hero-card {
          background: linear-gradient(135deg, #A8B5E8 0%, #C5AADE 50%, #E8C5D8 100%);
          position: relative;
          overflow: hidden;
        }
        
        .hero-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(ellipse 800px 400px at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%),
            radial-gradient(circle 300px at 70% 60%, rgba(255,255,255,0.15) 0%, transparent 50%);
        }
        
        .mountain-layer-1 {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to bottom, transparent 0%, rgba(107, 114, 176, 0.3) 100%);
          clip-path: polygon(0% 100%, 0% 60%, 15% 55%, 30% 45%, 45% 50%, 60% 40%, 75% 55%, 85% 50%, 100% 60%, 100% 100%);
          filter: blur(1px);
        }
        
        .mountain-layer-2 {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 45%;
          background: linear-gradient(to bottom, rgba(91, 111, 184, 0.4) 0%, rgba(91, 111, 184, 0.6) 100%);
          clip-path: polygon(0% 100%, 0% 70%, 20% 55%, 35% 40%, 50% 50%, 65% 35%, 80% 50%, 95% 60%, 100% 70%, 100% 100%);
        }
        
        .grass-layer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
        }
        
        .grass-blade {
          position: absolute;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to top, rgba(75, 85, 150, 0.4), transparent);
          transform-origin: bottom;
        }
        
        .sun {
          position: absolute;
          top: 30%;
          right: 20%;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(255, 253, 240, 0.8) 0%, rgba(255, 240, 200, 0.3) 50%, transparent 70%);
          border-radius: 50%;
          filter: blur(2px);
        }
        
        .moon {
          position: absolute;
          top: 25%;
          right: 15%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle at 30% 30%, #FFF9E6 0%, #E8E0D0 100%);
          border-radius: 50%;
          box-shadow: inset -20px -10px 0px rgba(200, 195, 180, 0.3);
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .stat-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        
        .chart-tab {
          position: relative;
          padding: 8px 0;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #6B7280;
          font-weight: 500;
        }
        
        .chart-tab.active {
          color: #5B6FB8;
        }
        
        .chart-tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #5B6FB8;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        
        .chart-tab.active::after {
          transform: scaleX(1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold text-indigo-600">Z.F</h1>
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchCity}
                onChange={handleSearchChange}
                onFocus={() => searchCity.trim().length > 0 && setShowSuggestions(true)}
                placeholder="Enter city name..."
                className="w-64 px-4 py-2 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/80 backdrop-blur-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </button>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
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
                </div>
              )}
            </form>
            
          </div>
        </div>

        {/* Hero Card */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
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

          {/* Chart Card */}
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
            
            <div ref={chartRef} className="w-full"></div>

            {/* Weekly Forecast */}
            <div className="grid grid-cols-7 gap-2 mt-8">
              {weatherData.daily.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs font-medium text-gray-500 mb-2">{day.day}</p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.icon, 32)}
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{day.temp}°</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

