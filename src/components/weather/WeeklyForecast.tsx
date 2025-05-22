import { Calendar } from 'lucide-react';
import { Cloud, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react';

interface DailyForecast {
  day: string;
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  precipitation: number;
}

interface WeeklyForecastProps {
  dailyForecasts: DailyForecast[];
}

// Weather icon mapping
const getWeatherIcon = (condition: string) => {
  const className = "text-yellow-300";
  const size = 24;
  
  switch (condition.toLowerCase()) {
    case 'clear sky':
      return <Sun size={size} className={className} />;
    case 'few clouds':
    case 'scattered clouds':
    case 'broken clouds':
    case 'overcast clouds':
      return <CloudSun size={size} className={className} />;
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

const WeeklyForecast = ({ dailyForecasts }: WeeklyForecastProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-500/5 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
          <Calendar className="mr-2 text-yellow-300" size={20} />
          7-Day Forecast
        </h3>

        <div className="space-y-4">
          {dailyForecasts.map((forecast, index) => {
            const isToday = index === 0;
            const tempRange = forecast.highTemp - forecast.lowTemp;
            const rangePercentage = (temp: number) => {
              // Calculate percentage position in the range (0-100%)
              const minTemp = Math.min(...dailyForecasts.map(f => f.lowTemp)) - 2;
              const maxTemp = Math.max(...dailyForecasts.map(f => f.highTemp)) + 2;
              const totalRange = maxTemp - minTemp;
              return ((temp - minTemp) / totalRange) * 100;
            };
            
            return (
              <div 
                key={index}
                className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-300 ${
                  isToday ? 'bg-white/15 shadow-md' : 'hover:bg-white/10'
                } animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Day and date */}
                <div className="w-20">
                  <p className="text-white font-medium">
                    {isToday ? 'Today' : forecast.day}
                  </p>
                  <p className="text-white/60 text-xs">{forecast.date}</p>
                </div>

                {/* Precipitation if any */}
                {forecast.precipitation > 0 && (
                  <div className="flex items-center text-blue-300">
                    <span className="text-sm mr-0.5">💧</span>
                    <span className="text-xs">{forecast.precipitation}%</span>
                  </div>
                )}

                {/* Weather icon */}
                <div className="mx-4 transition-transform hover:scale-110">
                  {getWeatherIcon(forecast.condition)}
                </div>

                {/* Temperature range */}
                <div className="flex-1 max-w-36">
                  <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-blue-400 to-yellow-300 rounded-full"
                      style={{ 
                        left: `${rangePercentage(forecast.lowTemp)}%`, 
                        width: `${rangePercentage(forecast.highTemp) - rangePercentage(forecast.lowTemp)}%`
                      }}
                    ></div>
                    <div 
                      className="absolute w-2 h-2 bg-white rounded-full -mt-0.25 transform -translate-y-1/4"
                      style={{ left: `${rangePercentage(forecast.highTemp)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Temperature values */}
                <div className="flex items-center gap-2 ml-2 w-20 justify-end">
                  <span className="text-white/60 text-sm">{forecast.lowTemp}°</span>
                  <span className="text-white font-medium">{forecast.highTemp}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyForecast; 