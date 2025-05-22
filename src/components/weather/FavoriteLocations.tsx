import { useState, useEffect } from 'react';
import { weatherService, type WeatherData } from '../../services/weatherService';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Star, Heart, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface FavoriteLocationsProps {
  onLocationSelect: (location: string) => void;
  currentLocation: string;
}

const FavoriteLocations = ({ onLocationSelect, currentLocation }: FavoriteLocationsProps) => {
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [favoriteWeatherData, setFavoriteWeatherData] = useState<WeatherData[]>([]);
  const { isAuthenticated } = useAuth();

  // Load favorite locations on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadFavorites = () => {
      const favorites = weatherService.getFavoriteLocations();
      setFavoriteLocations(favorites);
      
      // Fetch weather data for favorites
      const weatherData = favorites.map(location => weatherService.getWeatherData(location));
      setFavoriteWeatherData(weatherData);
    };
    
    loadFavorites();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(loadFavorites, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Toggle favorite status
  const handleToggleFavorite = (location: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent button onClick
    const isNowFavorite = weatherService.toggleFavorite(location);
    
    if (isNowFavorite) {
      // Add to favorites
      setFavoriteLocations(prev => [...prev, location]);
      setFavoriteWeatherData(prev => [
        ...prev,
        weatherService.getWeatherData(location)
      ]);
    } else {
      // Remove from favorites
      setFavoriteLocations(prev => prev.filter(loc => loc !== location));
      setFavoriteWeatherData(prev => prev.filter(data => data.location !== location));
    }
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, className: string = 'w-6 h-6') => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Sun className={className} />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRain className={className} />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className={className} />;
    } else if (lowerCondition.includes('thunder')) {
      return <CloudLightning className={className} />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className={className} />;
    } else {
      return <Sun className={className} />;
    }
  };

  // Get background color based on weather condition for list items
  const getBackgroundClass = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return 'from-sky-400 to-blue-500';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return 'from-blue-600 to-blue-800';
    } else if (lowerCondition.includes('snow')) {
      return 'from-blue-300 to-blue-500';
    } else if (lowerCondition.includes('thunder')) {
      return 'from-slate-600 to-indigo-800';
    } else if (lowerCondition.includes('cloud')) {
      return 'from-gray-400 to-gray-600';
    } else {
      return 'from-blue-400 to-blue-600';
    }
  };

  // Get rank based on temperature and conditions
  const getRank = (weather: WeatherData): number => {
    let score = 0;
    
    // Ideal temperature range (20-25°C)
    const idealTemp = 22.5;
    const tempDiff = Math.abs(weather.temperature - idealTemp);
    score += Math.max(0, 10 - tempDiff);
    
    // Weather condition score
    const condition = weather.condition.toLowerCase();
    if (condition.includes('clear') || condition.includes('sunny')) {
      score += 10;
    } else if (condition.includes('cloud') && !condition.includes('overcast')) {
      score += 8;
    } else if (condition.includes('overcast')) {
      score += 6;
    } else if (condition.includes('rain')) {
      score += 4;
    } else if (condition.includes('thunder')) {
      score += 2;
    } else if (condition.includes('snow')) {
      score += 5;
    }
    
    // Low humidity is better
    score += Math.max(0, 10 - (weather.humidity / 10));
    
    return Math.round(score);
  };

  // Sort weather data by ranking
  const sortedWeatherData = [...favoriteWeatherData].sort((a, b) => {
    return getRank(b) - getRank(a);
  });
  
  // Login prompt for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="mt-5 bg-white/5 backdrop-blur-sm p-5 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-white">Favorite Locations</h2>
          <div className="text-yellow-400">
            <Star className="w-5 h-5 fill-yellow-400" />
          </div>
        </div>
        
        <div className="text-center py-10 px-5 bg-white/5 rounded-xl">
          <LogIn className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h3 className="text-xl font-medium mb-3">Login Required</h3>
          <p className="text-white/70 mb-6">Please log in to view and manage your favorite locations</p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/login" 
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 bg-white/5 backdrop-blur-sm p-5 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white">Favorite Locations</h2>
        <div className="text-yellow-400">
          <Star className="w-5 h-5 fill-yellow-400" />
        </div>
      </div>
      
      {sortedWeatherData.length === 0 ? (
        <div className="text-center py-8 text-white/70">
          <Heart className="w-12 h-12 mx-auto mb-3 text-white/50" />
          <p>No favorite locations yet</p>
          <p className="text-sm mt-2">Add locations to your favorites to see them here</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-3 max-h-80 overflow-y-auto hide-scrollbar">
          {sortedWeatherData.map(weather => {
            const rank = getRank(weather);
            const isCurrentLocation = weather.location === currentLocation;
            
            return (
              <button
                key={weather.location}
                onClick={() => onLocationSelect(weather.location)}
                className={`flex items-center p-4 rounded-xl bg-gradient-to-r ${getBackgroundClass(weather.condition)} 
                  ${isCurrentLocation ? 'ring-2 ring-yellow-400' : ''}
                  hover:scale-[1.02] transition-all duration-200`}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg text-white">{weather.location}</span>
                    <span className="text-sm text-white/80">{weather.localTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{weather.condition}</span>
                    <div className="flex items-center gap-1">
                      <div className="text-xs text-white/70 bg-white/20 rounded-full px-2 py-0.5">
                        {rank}/10
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div>{getWeatherIcon(weather.condition)}</div>
                  <span className="text-2xl font-bold text-white">{weather.temperature}°</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteLocations; 