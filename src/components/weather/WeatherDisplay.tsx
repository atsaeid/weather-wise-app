import React from 'react';
import type { WeatherData } from '../../services/weatherService';
import WeatherForecastContainer from './WeatherForecastContainer';
import WeatherMap from './WeatherMap';

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-500 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Current Weather */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{weatherData.location}</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-5xl font-bold text-white">{Math.round(weatherData.temperature)}°C</p>
              <p className="text-xl text-white/80">{weatherData.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80">Feels like: {Math.round(weatherData.feelsLike)}°C</p>
              <p className="text-white/80">Humidity: {weatherData.humidity}%</p>
              <p className="text-white/80">Wind: {Math.round(weatherData.windSpeed)} km/h</p>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h2>
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {weatherData.hourlyForecasts.map((forecast, index) => (
              <div key={index} className="flex-shrink-0 text-center">
                <p className="text-white/80">{forecast.time}</p>
                <p className="text-2xl font-bold text-white">{Math.round(forecast.temperature)}°C</p>
                <p className="text-white/80">{forecast.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Forecast */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">7-Day Forecast</h2>
          <div className="space-y-4">
            {weatherData.dailyForecasts.map((forecast, index) => (
              <div key={index} className="grid grid-cols-3 gap-4">
                <p className="text-white">{forecast.day}</p>
                <div className="text-center">
                  <p className="text-white">{forecast.condition}</p>
                </div>
                <div className="text-right">
                  <span className="text-white">{Math.round(forecast.highTemp)}°</span>
                  <span className="text-white/60 ml-2">{Math.round(forecast.lowTemp)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Location Map</h2>
          <WeatherMap
            latitude={weatherData.mapLocation.lat}
            longitude={weatherData.mapLocation.lon}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay; 