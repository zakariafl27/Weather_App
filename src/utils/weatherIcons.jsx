import React from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';

export const getWeatherIcon = (condition, size = 24) => {
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