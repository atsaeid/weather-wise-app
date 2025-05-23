import { Clock } from 'lucide-react';
import { Cloud, CloudRain, CloudSnow, CloudSun, Moon, Sun, Wind } from 'lucide-react';
import { formatToISOWithMilliseconds, formatTimeOnly } from '../../utils/dateFormatter';
import { roundNumber } from '../../utils/numberFormatter';

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

interface TodaysForecastProps {
  hourlyForecasts: HourlyForecast[];
}

// Weather icon mapping - simplified version from CurrentWeather
const getWeatherIcon = (condition: string, isNight: boolean) => {
  const className = "text-yellow-300";
  const size = 24;
  
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return isNight ? <Moon size={size} className={className} /> : <Sun size={size} className={className} />;
    case 'few clouds':
    case 'scattered clouds':
    case 'broken clouds':
    case 'overcast clouds':
      return isNight ? <Moon size={size} className={className} /> : <CloudSun size={size} className={className} />;
    case 'shower rain':
    case 'rain':
    case 'thunderstorm':
      return <CloudRain size={size} className={className} />;
    case 'snow':
      return <CloudSnow size={size} className={className} />;
    case 'mist':
    case 'fog':
    default:
      return <Cloud size={size} className={className} />;
  }
};

// Check if a given hour is night time (simplified)
const isNightTime = (hour: number): boolean => {
  return hour < 6 || hour >= 19;
};

const TodaysForecast = ({ hourlyForecasts }: TodaysForecastProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-500/5 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
          <Clock className="mr-2 text-yellow-300" size={20} />
          Today's Forecast
        </h3>

        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-3 min-w-max">
            {hourlyForecasts.map((forecast, index) => {
              const hour = parseInt(forecast.time.split(':')[0], 10);
              const isNight = isNightTime(hour);
              const now = new Date().getHours();
              const isCurrentHour = hour === now;
              
              return (
                <div 
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                    isCurrentHour ? 'bg-white/20 scale-105 shadow-lg' : 'hover:bg-white/10'
                  }`}
                >
                  <p className="text-white/80 text-xs mb-2">{formatTimeOnly(forecast.time)}</p>
                  
                  <div className={`transition-transform ${isCurrentHour ? 'animate-bounce-slow' : ''}`}>
                    {getWeatherIcon(forecast.condition, isNight)}
                  </div>
                  
                  <p className="text-white font-medium mt-2">{forecast.temperature}°C</p>
                  
                  {forecast.precipitation > 0 && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-blue-300 animate-pulse">💧</span>
                      <span className="text-xs text-blue-300 ml-0.5">{roundNumber(forecast.precipitation)}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual scrolling hint */}
        <div className="mt-3 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-8 h-1 rounded-full bg-white/30 animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-white/30 animate-pulse delay-150"></div>
            <div className="w-1 h-1 rounded-full bg-white/30 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysForecast; 