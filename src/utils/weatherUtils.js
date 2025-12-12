export const processHourlyForecast = (forecastList) => {
  return forecastList.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }),
    hour: new Date(item.dt * 1000).getHours(),
    icon: item.weather[0].main,
    temp: Math.round(item.main.temp),
    precip: item.rain ? item.rain['3h'] || 0 : 0,
    wind: Math.round(item.wind.speed),
    humidity: item.main.humidity
  }));
};

export const processDailyForecast = (forecastList) => {
  const dailyData = {};
  
  forecastList.forEach(item => {
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
  
  return Object.keys(dailyData).slice(0, 7).map((dayKey, index) => {
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
};

export const formatTime = (timestamp, format = 'time') => {
  const date = new Date(timestamp * 1000);
  
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  }
  
  if (format === 'date') {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  }
  
  return date;
};