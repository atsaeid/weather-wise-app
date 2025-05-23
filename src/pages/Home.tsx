import React, { useEffect, useState } from 'react';
import type { WeatherData } from '../services/weatherService';
import { weatherService } from '../services/weatherService';
import WeatherDisplay from '../components/weather/WeatherDisplay';
import LoadingScreen from '../components/LoadingScreen';

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, get the user's current location
        const location = await weatherService.getCurrentLocation();
        
        // Then fetch weather data for those coordinates
        const data = await weatherService.getWeatherByCoordinates(
          location.latitude,
          location.longitude
        );
        
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialWeatherData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  return <WeatherDisplay weatherData={weatherData} />;
};

export default Home;
