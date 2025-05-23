import React, { useEffect, useState } from 'react';
import type { WeatherData } from '../../services/weatherService';
import { weatherService } from '../../services/weatherService';
import LoadingBar from '../ui/LoadingBar';
import WeatherCard from './WeatherCard';
import WeatherMap from './WeatherMap';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import CurrentWeather from './CurrentWeather';
import AirConditions from './AirConditions';
import TodaysForecast from './TodaysForecast';
import WeeklyForecast from './WeeklyForecast';
import MapComponent from './MapComponent';
import FavoriteLocations from './FavoriteLocations';
import LocationDetail from './LocationDetail';
import { recentService } from '../../services/recentService';
import { useAuth } from '../../context/AuthContext';

// Props interface
interface WeatherForecastContainerProps {
  onConditionChange?: (condition: string) => void;
  initialLocation?: string | null;
}

const WeatherForecastContainer: React.FC<WeatherForecastContainerProps> = ({
  onConditionChange,
  initialLocation,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || 'Tehran');
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
  const refreshFavorites = () => {
    setFavoritesUpdateCounter(prev => prev + 1);
  };

  // Attach a global event listener for favorites changes
  useEffect(() => {
    // Create a custom event for favorites updates
    window.addEventListener('favorites-updated', refreshFavorites);
    
    return () => {
      window.removeEventListener('favorites-updated', refreshFavorites);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: WeatherData;
        if (initialLocation) {
          data = await weatherService.getWeatherData(initialLocation);
        } else {
          const location = await weatherService.getCurrentLocation();
          data = await weatherService.getWeatherByCoordinates(
            location.latitude,
            location.longitude
          );
        }

        if (isMounted) {
          setWeatherData(data);
          onConditionChange?.(data.condition);
          
          // Add to recent locations
          recentService.addToRecent(selectedLocation);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
          console.error('Error fetching weather data:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWeatherData();

    return () => {
      isMounted = false;
    };
  }, [initialLocation, onConditionChange, selectedLocation]);

  // Handle location change
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setShowLocationDetail(false);
  };
  
  // Handle location selection from favorites
  const handleFavoriteLocationSelect = (location: string) => {
    // If it's the same as current location, just update main view
    if (location === selectedLocation) {
      setShowLocationDetail(false);
      return;
    }
    
    // Get weather data for selected favorite location
    const locationData = weatherService.getWeatherData(location);
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

  // Only show loading bar when loading
  if (loading) {
    return <LoadingBar isLoading={true} />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Don't render anything if we don't have weather data
  if (!weatherData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <WeatherCard weatherData={weatherData} />

      {/* Hourly Forecast */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h2>
        <HourlyForecast forecasts={weatherData.hourlyForecasts} />
      </div>

      {/* Daily Forecast */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">7-Day Forecast</h2>
        <DailyForecast forecasts={weatherData.dailyForecasts} />
      </div>

      {/* Map */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
        <WeatherMap
          latitude={weatherData.mapLocation.lat}
          longitude={weatherData.mapLocation.lon}
        />
      </div>

      {/* Two column layout for desktop */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left column - scrollable content */}
        <div className="flex-1 space-y-5 order-2 lg:order-1">
          {/* Air Conditions */}
          <AirConditions
            feelsLike={weatherData.feelsLike}
            humidity={weatherData.humidity}
            windSpeed={weatherData.windSpeed}
            uvIndex={weatherData.uvIndex}
            pressure={weatherData.pressure}
          />

          {/* Today's Forecast */}
          <TodaysForecast hourlyForecasts={weatherData.hourlyForecasts} />

          {/* Weekly Forecast */}
          <WeeklyForecast dailyForecasts={weatherData.dailyForecasts} />
        </div>

        {/* Right column - Map and Favorites */}
        <div className="lg:w-2/5 order-1 lg:order-2 space-y-5">
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