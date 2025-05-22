import { useState, useEffect } from 'react';
import { Clock, Trash2, Cloud, CloudRain, CloudSnow, CloudLightning, Heart } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { recentService } from '../services/recentService';
import { weatherService, type WeatherData } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RecentPage = () => {
  const [recentWeatherData, setRecentWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load recent locations on mount
  useEffect(() => {
    const loadRecentLocations = () => {
      setIsLoading(true);
      const weatherData = recentService.getRecentLocationsWeather();
      setRecentWeatherData(weatherData);
      setIsLoading(false);
    };
    
    loadRecentLocations();
    
    // Refresh data periodically
    const intervalId = setInterval(loadRecentLocations, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, className: string = 'w-6 h-6') => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Cloud className={className} />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRain className={className} />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className={className} />;
    } else if (lowerCondition.includes('thunder')) {
      return <CloudLightning className={className} />;
    } else {
      return <Cloud className={className} />;
    }
  };
  
  // Get background color based on temperature
  const getTemperatureClass = (temp: number): string => {
    if (temp < 0) return 'from-blue-900 to-indigo-800'; // Very cold
    if (temp < 10) return 'from-blue-600 to-blue-900'; // Cold
    if (temp < 20) return 'from-blue-500 to-indigo-600'; // Cool
    if (temp < 25) return 'from-sky-400 to-blue-500'; // Mild
    if (temp < 30) return 'from-yellow-500 to-orange-500'; // Warm
    return 'from-orange-500 to-red-600'; // Hot
  };

  // Handle removing a location from recent list
  const handleRemoveRecent = (e: React.MouseEvent, location: string) => {
    e.stopPropagation();
    recentService.removeFromRecent(location);
    setRecentWeatherData(prev => prev.filter(data => data.location !== location));
  };

  // Handle selecting a location to view
  const handleSelectLocation = (location: string) => {
    // Store the location in sessionStorage for the home page to use
    sessionStorage.setItem('selected_location', location);
    navigate('/');
  };
  
  // Handle clearing all recent locations
  const handleClearAll = () => {
    recentService.clearRecentLocations();
    setRecentWeatherData([]);
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = (e: React.MouseEvent, location: string) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    
    weatherService.toggleFavorite(location);
    // Refresh the data to update favorite status
    setRecentWeatherData(prev => 
      prev.map(item => 
        item.location === location 
          ? { ...item, isFavorite: !item.isFavorite } 
          : item
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900 to-slate-900">
      <Header />
      
      <main className="flex-grow px-6 md:px-8 pt-6 pb-24 mx-auto max-w-7xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-7 h-7" />
            Recent Locations
            <span className="text-sm font-normal text-white/70 ml-1">({recentWeatherData.length}/20)</span>
          </h1>
          
          {recentWeatherData.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="flex items-center gap-1 text-sm text-white/80 bg-slate-800/80 hover:bg-slate-700/80 py-2 px-3 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : recentWeatherData.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-10 text-center">
            <Clock className="w-16 h-16 mx-auto text-white/40 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Recent Locations</h2>
            <p className="text-white/70 mb-6">Your recently viewed locations will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentWeatherData.map(weather => (
              <div 
                key={weather.location}
                onClick={() => handleSelectLocation(weather.location)}
                className={`bg-gradient-to-r ${getTemperatureClass(weather.temperature)} rounded-xl p-5 cursor-pointer transform hover:scale-[1.02] transition-all duration-200 relative overflow-hidden shadow-lg`}
              >
                {/* Pattern background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-5 left-10 w-16 h-16 rounded-full bg-white"></div>
                  <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{weather.location}</h3>
                    <div className="flex items-center gap-2">
                      {isAuthenticated && (
                        <button 
                          onClick={(e) => handleToggleFavorite(e, weather.location)}
                          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <Heart 
                            size={16} 
                            className={`${weather.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                          />
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleRemoveRecent(e, weather.location)}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Trash2 size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/80 text-sm mb-1">{weather.condition}</p>
                      <p className="text-white/60 text-xs">{weather.localTime}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(weather.condition)}
                      <span className="text-3xl font-bold text-white">{weather.temperature}°</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default RecentPage; 