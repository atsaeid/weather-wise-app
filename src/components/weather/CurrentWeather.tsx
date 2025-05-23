import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, CloudSun, Moon, Sun, Wind, Clock, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { weatherService } from '../../services/weatherService';
import { formatWeatherDateTime } from '../../utils/dateFormatter';
import { roundNumber } from '../../utils/numberFormatter';

interface CurrentWeatherProps {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  localTime?: string;
  timezone?: string;
}

// Weather icon mapping
const getWeatherIcon = (condition: string, isNight: boolean) => {
  const className = "animate-pulse-slow text-yellow-300";
  const size = 64;
  
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return isNight ? <Moon size={size} className={className} /> : <Sun size={size} className={className} />;
    case 'few clouds':
    case 'scattered clouds':
    case 'broken clouds':
    case 'overcast clouds':
      return isNight ? <Moon size={size} className={className} /> : <CloudSun size={size} className={className} />;
    case 'shower rain':
    case 'rain':
    case 'thunderstorm':
      return <CloudRain size={size} className={`${className} animate-bounce-slow`} />;
    case 'snow':
      return <CloudSnow size={size} className={`${className} animate-fall-slow`} />;
    case 'mist':
    case 'fog':
    default:
      return <Cloud size={size} className={`${className} animate-pulse`} />;
  }
};

const CurrentWeather = ({ 
  location, 
  temperature, 
  condition, 
  feelsLike, 
  humidity, 
  windSpeed,
  localTime,
  timezone
}: CurrentWeatherProps) => {
  const [isNight, setIsNight] = useState(false);
  const [currentLocalTime, setCurrentLocalTime] = useState(localTime || '');
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if it's night based on local time
    const hours = new Date().getHours();
    setIsNight(hours < 6 || hours >= 19);
    
    // Set initial local time
    if (localTime) {
      setCurrentLocalTime(localTime);
    }
    
    // Update local time if timezone is provided
    let intervalId: number;
    if (timezone) {
      intervalId = window.setInterval(() => {
        try {
          const time = new Date().toLocaleTimeString('en-US', { 
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
          setCurrentLocalTime(time);
        } catch (error) {
          console.error('Error updating time:', error);
        }
      }, 30000); // Update every 30 seconds
    }
    
    // Check if location is in favorites
    if (isAuthenticated) {
      const favorites = weatherService.getFavoriteLocations();
      setIsFavorite(favorites.includes(location));
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [localTime, timezone, location, isAuthenticated]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) return;
    
    const isNowFavorite = weatherService.toggleFavorite(location);
    setIsFavorite(isNowFavorite);
  };

  return (
    <div className={`w-full rounded-2xl p-6 overflow-hidden relative transition-all duration-500 ${
      isNight ? 'bg-gradient-to-br from-blue-900/90 to-indigo-900/90' : 'bg-gradient-to-br from-blue-500/80 to-sky-500/80'
    }`}>
      {/* Decorative background patterns */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-float" />
        <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-white animate-float-delay-1" />
        <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white animate-float-delay-2" />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Location and date */}
          <div>
            <div className="flex items-center mb-1">
              {isAuthenticated && (
                <button 
                  onClick={handleToggleFavorite}
                  className={`mr-2 p-2 rounded-full ${
                    isFavorite ? 'bg-red-500/30' : 'bg-white/20 hover:bg-white/30'
                  } transition-all duration-200`}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    size={20} 
                    className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} transition-colors`} 
                  />
                </button>
              )}
              <h2 className="text-2xl font-bold text-white flex items-center">
                {location}
                <span className="animate-pulse ml-2">📍</span>
              </h2>
            </div>
            <p className="text-white/80 text-sm">
              {new Date().toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Temperature */}
          <div className="mt-4 md:mt-0 flex items-center justify-start">
            <div className="mr-4">{getWeatherIcon(condition, isNight)}</div>
            <div>
              <div className="text-5xl font-bold text-white tracking-tight relative group">
                {temperature}
                <span className="absolute text-2xl top-0 -right-4 group-hover:animate-bounce">°C</span>
              </div>
              <p className="text-white/80">{condition}</p>
              {localTime && (
                <p className="text-white/70 flex items-center mt-1 text-sm">
                  <Clock size={14} className="inline mr-1" />
                  <span>{formatWeatherDateTime(localTime)}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="flex flex-wrap gap-4 mt-6 text-sm text-white">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-2">
              <span role="img" aria-label="feels like" className="text-lg">🌡️</span>
            </div>
            <div>
              <p className="text-white/70">Feels like</p>
              <p className="font-semibold">{feelsLike}°C</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-2">
              <span role="img" aria-label="humidity" className="text-lg">💧</span>
            </div>
            <div>
              <p className="text-white/70">Humidity</p>
              <p className="font-semibold">{roundNumber(humidity)}%</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mr-2">
              <Wind size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white/70">Wind</p>
              <p className="font-semibold">{windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather; 