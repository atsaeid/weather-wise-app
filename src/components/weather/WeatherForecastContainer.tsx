import { useState, useEffect, useCallback } from 'react';
import CurrentWeather from './CurrentWeather';
import AirConditions from './AirConditions';
import TodaysForecast from './TodaysForecast';
import WeeklyForecast from './WeeklyForecast';
import MapComponent from './MapComponent';
import FavoriteLocations from './FavoriteLocations';
import LocationDetail from './LocationDetail';
import { weatherService, type WeatherData } from '../../services/weatherService';
import { recentService } from '../../services/recentService';
import { useAuth } from '../../context/AuthContext';

// Props interface
interface WeatherForecastContainerProps {
  onConditionChange?: (condition: string) => void;
  initialLocation?: string | null;
}

const WeatherForecastContainer = ({ onConditionChange, initialLocation }: WeatherForecastContainerProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || 'Tehran');
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationDetail, setShowLocationDetail] = useState(false);
  const [selectedDetailLocation, setSelectedDetailLocation] = useState<WeatherData | null>(null);
  const { isAuthenticated } = useAuth();
  const [favoritesUpdateCounter, setFavoritesUpdateCounter] = useState(0);

  // Update selected location when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  // Force refresh when favorites change
  const refreshFavorites = useCallback(() => {
    setFavoritesUpdateCounter(prev => prev + 1);
  }, []);

  // Attach a global event listener for favorites changes
  useEffect(() => {
    // Create a custom event for favorites updates
    window.addEventListener('favorites-updated', refreshFavorites);
    
    return () => {
      window.removeEventListener('favorites-updated', refreshFavorites);
    };
  }, [refreshFavorites]);

  // Fetch weather data on mount and when location changes
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true);
        // Get weather data for the selected location
        const data =await weatherService.getWeatherData(selectedLocation);
        setWeatherData(data);
        
        // Add to recent locations
        recentService.addToRecent(selectedLocation);
        
        // Notify parent about condition change
        if (onConditionChange) {
          onConditionChange(data.condition);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeatherData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchWeatherData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedLocation, onConditionChange]);

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDetail(false);
  };
  
  // Handle location selection from favorites
  const handleFavoriteLocationSelect = async (location: string) => {
    // If it's the same as current location, just update main view
    if (location === selectedLocation) {
      setShowLocationDetail(false);
      return;
    }
    
    // Get weather data for selected favorite location
    const locationData =await weatherService.getWeatherData(location);
    setSelectedDetailLocation(locationData);
    setShowLocationDetail(true);
  };
  
  // Close detail view and switch to that location
  const handleSwitchToLocation = () => {
    if (selectedDetailLocation) {
      setSelectedLocation(selectedDetailLocation.location);
      setShowLocationDetail(false);
    }
  };
  
  if (isLoading && !weatherData) {
    return (
      <div className="w-full p-8 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!weatherData) {
    return (
      <div className="w-full p-8 rounded-xl bg-white/10 backdrop-blur">
        <p className="text-white text-center">Unable to load weather data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Current Weather - Full Width Top Row */}
      <div className="w-full">
        <CurrentWeather
          location={weatherData.location}
          temperature={weatherData.temperature}
          condition={weatherData.condition}
          feelsLike={weatherData.feelsLike}
          humidity={weatherData.humidity}
          windSpeed={weatherData.windSpeed}
          localTime={weatherData.localTime}
          timezone={weatherData.timezone}
        />
      </div>

      {/* Content Row with Left and Right Columns */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Column - Weather Info (8/12) */}
        <div className="lg:w-8/12 space-y-5">
          <AirConditions
            feelsLike={weatherData.feelsLike}
            humidity={weatherData.humidity}
            windSpeed={weatherData.windSpeed}
            uvIndex={weatherData.uvIndex}
            pressure={weatherData.pressure}
          />

          <TodaysForecast hourlyForecasts={weatherData.hourlyForecasts} />

          <WeeklyForecast dailyForecasts={weatherData.dailyForecasts} />
        </div>

        {/* Right Column - Map and Favorites (4/12) */}
        <div className="lg:w-4/12 space-y-5">
          {showLocationDetail && selectedDetailLocation ? (
            <div className="relative">
              <LocationDetail weatherData={selectedDetailLocation} />
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowLocationDetail(false)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Back to Favorites
                </button>
                <button
                  onClick={handleSwitchToLocation}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ) : (
            <>
              <MapComponent 
                location={weatherData.mapLocation} 
                onLocationSelect={handleLocationChange}
              />
              <FavoriteLocations 
                key={`favorites-${favoritesUpdateCounter}-${isAuthenticated}`}
                onLocationSelect={handleFavoriteLocationSelect} 
                currentLocation={selectedLocation} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecastContainer; 