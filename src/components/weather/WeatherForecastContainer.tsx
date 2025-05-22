import { useState, useEffect } from 'react';
import CurrentWeather from './CurrentWeather';
import AirConditions from './AirConditions';
import TodaysForecast from './TodaysForecast';
import WeeklyForecast from './WeeklyForecast';
import MapComponent from './MapComponent';
import FavoriteLocations from './FavoriteLocations';
import LocationDetail from './LocationDetail';
import { weatherService, type WeatherData } from '../../services/weatherService';

// Props interface
interface WeatherForecastContainerProps {
  onConditionChange?: (condition: string) => void;
}

const WeatherForecastContainer = ({ onConditionChange }: WeatherForecastContainerProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Tehran');
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationDetail, setShowLocationDetail] = useState(false);
  const [selectedDetailLocation, setSelectedDetailLocation] = useState<WeatherData | null>(null);

  // Fetch weather data on mount and when location changes
  useEffect(() => {
    const fetchWeatherData = () => {
      try {
        setIsLoading(true);
        // Get weather data for the selected location
        const data = weatherService.getWeatherData(selectedLocation);
        setWeatherData(data);
        
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
    <div className="px-4 pb-24">
      <div className="space-y-5">
        {/* Current Weather - Full Width */}
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
                <MapComponent location={weatherData.mapLocation} />
                <FavoriteLocations 
                  onLocationSelect={handleFavoriteLocationSelect} 
                  currentLocation={selectedLocation} 
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecastContainer; 