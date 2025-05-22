import { useState } from 'react';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, 
  Wind, Droplets, Thermometer, Heart, 
  Calendar, MapPin, Clock, BarChart3 
} from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import type { WeatherData } from '../../services/weatherService';

interface LocationDetailProps {
  weatherData: WeatherData;
}

const LocationDetail = ({ weatherData }: LocationDetailProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(weatherData.isFavorite || false);

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, className: string = 'w-12 h-12') => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Sun className={`${className} text-yellow-400`} />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRain className={`${className} text-blue-400`} />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className={`${className} text-blue-200`} />;
    } else if (lowerCondition.includes('thunder')) {
      return <CloudLightning className={`${className} text-purple-400`} />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className={`${className} text-gray-400`} />;
    } else {
      return <Sun className={`${className} text-yellow-400`} />;
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = () => {
    const isNowFavorite = weatherService.toggleFavorite(weatherData.location);
    setIsFavorite(isNowFavorite);
  };

  // Format date to display day and date
  const formatDate = (dateString: string): string => {
    return dateString; // Already formatted in mock data
  };

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 animate-fade-in">
      {/* Header with location name and favorite button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          <h2 className="text-2xl font-bold">{weatherData.location}</h2>
        </div>
        <button 
          onClick={handleToggleFavorite}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>
      
      {/* Current weather overview */}
      <div className="flex items-center mb-8">
        <div className="mr-4">
          {getWeatherIcon(weatherData.condition)}
        </div>
        <div className="flex-1">
          <div className="flex items-end">
            <span className="text-5xl font-bold mr-2">{weatherData.temperature}°</span>
            <span className="text-xl mb-1">{weatherData.condition}</span>
          </div>
          <div className="flex items-center text-sm mt-1">
            <Clock className="w-4 h-4 mr-1" />
            <span>{weatherData.localTime} ({weatherData.timezone.split('/')[1]})</span>
          </div>
        </div>
      </div>
      
      {/* Weather details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Thermometer className="w-4 h-4 mr-2 text-red-400" />
            <span className="text-sm">Feels Like</span>
          </div>
          <span className="text-xl font-semibold">{weatherData.feelsLike}°</span>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Droplets className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm">Humidity</span>
          </div>
          <span className="text-xl font-semibold">{weatherData.humidity}%</span>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Wind className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">Wind Speed</span>
          </div>
          <span className="text-xl font-semibold">{weatherData.windSpeed} km/h</span>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-sm">Pressure</span>
          </div>
          <span className="text-xl font-semibold">{weatherData.pressure} hPa</span>
        </div>
      </div>
      
      {/* Daily forecast preview */}
      <div>
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">3-Day Forecast</h3>
        </div>
        
        <div className="space-y-3">
          {weatherData.dailyForecasts.slice(0, 3).map((day, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center">
                <span className="w-24 font-medium">{day.day}</span>
                <span className="text-sm text-white/70">{formatDate(day.date)}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div>{getWeatherIcon(day.condition, 'w-6 h-6')}</div>
                <div className="text-right">
                  <span className="text-sm font-medium">{day.highTemp}° </span>
                  <span className="text-sm text-white/70">{day.lowTemp}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationDetail; 