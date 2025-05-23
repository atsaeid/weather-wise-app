import React from 'react';
import type { WeatherData } from '../../services/weatherService';

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{weatherData.location}</h1>
          <p className="text-white/80">{new Date(weatherData.localTime).toLocaleString()}</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-5xl font-bold text-white">{Math.round(weatherData.temperature)}°</span>
          <div className="ml-4">
            <p className="text-white text-lg capitalize">{weatherData.condition}</p>
            <p className="text-white/80">Feels like {Math.round(weatherData.feelsLike)}°</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/5 rounded p-3">
          <p className="text-white/60">Humidity</p>
          <p className="text-white text-lg">{weatherData.humidity}%</p>
        </div>
        <div className="bg-white/5 rounded p-3">
          <p className="text-white/60">Wind Speed</p>
          <p className="text-white text-lg">{weatherData.windSpeed} km/h</p>
        </div>
        <div className="bg-white/5 rounded p-3">
          <p className="text-white/60">Timezone</p>
          <p className="text-white text-lg">{weatherData.timezone}</p>
        </div>
        <div className="bg-white/5 rounded p-3">
          <p className="text-white/60">Pressure</p>
          <p className="text-white text-lg">{weatherData.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 