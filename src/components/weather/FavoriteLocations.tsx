import { useState, useEffect, useRef } from 'react';
import { weatherService, type WeatherData } from '../../services/weatherService';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Star, Heart, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface FavoriteLocationsProps {
  onLocationSelect: (location: string) => void;
  currentLocation: string;
}

const FavoriteLocations = ({ onLocationSelect, currentLocation }: FavoriteLocationsProps) => {
  const [favoriteWeatherData, setFavoriteWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const { isAuthenticated } = useAuth();
  const favoritesRef = useRef<HTMLDivElement>(null);

  // Load favorite locations on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        // Get favorite locations
        const favorites = await weatherService.getFavoriteLocations();
        
        // Fetch weather data for all favorites in parallel
        const weatherDataPromises = favorites.map(location => 
          weatherService.getWeatherData(location)
        );
        
        const weatherData = await Promise.all(weatherDataPromises);
        setFavoriteWeatherData(weatherData);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(loadFavorites, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Handle location selection with scroll
  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    
    // Scroll to the top of favorites section
    if (favoritesRef.current) {
      setTimeout(() => {
        favoritesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
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

  // Split the data for display
  const initialLocations = sortedWeatherData.slice(0, 10); // First 10 locations always visible
  const additionalLocations = sortedWeatherData.slice(10); // Locations beyond 10
  
  // Login prompt for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div ref={favoritesRef} className="mt-5 bg-white/5 backdrop-blur-sm p-5 rounded-xl w-full">
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
          <div className="flex justify-center">
            <Link 
              to="/login" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderLocationItem = (weather: WeatherData) => {
    const rank = getRank(weather);
    const isCurrentLocation = weather.location === currentLocation;
    
    return (
      <button
        key={weather.location}
        onClick={() => handleLocationSelect(weather.location)}
        className={`flex items-center p-4 rounded-xl bg-gradient-to-r ${getBackgroundClass(weather.condition)} 
          ${isCurrentLocation ? 'ring-2 ring-yellow-400' : ''}
          hover:scale-[1.02] transition-all duration-200 min-h-[88px] w-full`}
      >
        <div className="flex-1 flex flex-col justify-between h-full min-w-0 mr-3">
          <div className="flex justify-between items-center w-full gap-2">
            <span className="font-semibold text-lg text-white truncate">{weather.location}</span>
            <span className="text-sm text-white/80 whitespace-nowrap shrink-0">{weather.localTime}</span>
          </div>
          <div className="flex items-center justify-between w-full gap-2 mt-1">
            <span className="text-sm text-white/80 truncate">{weather.condition}</span>
            <div className="flex items-center shrink-0">
              <div className="text-xs text-white/70 bg-white/20 rounded-full px-2 py-0.5">
                {rank}/10
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div>{getWeatherIcon(weather.condition)}</div>
          <span className="text-2xl font-bold text-white">{weather.temperature}°</span>
        </div>
      </button>
    );
  };

  return (
    <div ref={favoritesRef} className="mt-5 bg-white/5 backdrop-blur-sm p-5 rounded-xl w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-white">Favorite Locations</h2>
        <div className="text-yellow-400">
          <Star className="w-5 h-5 fill-yellow-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : favoriteWeatherData.length === 0 ? (
        <div className="text-center py-8 px-4">
          <Star className="w-12 h-12 mx-auto mb-3 text-white/40" />
          <p className="text-white/70">No favorite locations yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {initialLocations.map(renderLocationItem)}
          
          {additionalLocations.length > 0 && (
            <>
              {showAllLocations && (
                <div className="space-y-3 mt-3">
                  {additionalLocations.map(renderLocationItem)}
                </div>
              )}
              
              <button
                onClick={() => setShowAllLocations(!showAllLocations)}
                className="w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-white/80"
              >
                <span>{showAllLocations ? 'Show Less' : `Show ${additionalLocations.length} More`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAllLocations ? 'rotate-180' : ''}`} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteLocations; 