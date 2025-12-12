import { useState } from 'react';
import { API_CONFIG } from '../data/constants';
import { processHourlyForecast, processDailyForecast, formatTime } from '../utils/weatherUtils';

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Stockholm');
  
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  
  const fetchWeather = async (cityName = 'Stockholm') => {
    setLoading(true);
    setError(null);
    
    try {
      const currentResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.WEATHER_ENDPOINT}?q=${cityName}&appid=${API_KEY}&units=${API_CONFIG.UNITS}`
      );
      
      if (!currentResponse.ok) {
        throw new Error(`City "${cityName}" not found`);
      }
      
      const currentData = await currentResponse.json();
      
      const forecastResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.FORECAST_ENDPOINT}?q=${cityName}&appid=${API_KEY}&units=${API_CONFIG.UNITS}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Forecast data not available');
      }
      
      const forecastData = await forecastResponse.json();
      
      const hourlyForecast = processHourlyForecast(forecastData.list);
      const dailyForecast = processDailyForecast(forecastData.list);
      
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
        sunrise: formatTime(currentData.sys.sunrise),
        sunset: formatTime(currentData.sys.sunset),
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

  return {
    weatherData,
    loading,
    error,
    city,
    fetchWeather
  };
};