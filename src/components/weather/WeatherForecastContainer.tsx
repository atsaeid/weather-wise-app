import { useState, useEffect } from 'react';
import CurrentWeather from './CurrentWeather';
import AirConditions from './AirConditions';
import TodaysForecast from './TodaysForecast';
import WeeklyForecast from './WeeklyForecast';
import MapComponent from './MapComponent';

// Props interface
interface WeatherForecastContainerProps {
  onConditionChange?: (condition: string) => void;
}

// Mock data for example display
const mockWeatherData = {
  location: 'Tehran',
  temperature: 28,
  condition: 'Clear Sky',
  feelsLike: 30,
  humidity: 42,
  windSpeed: 8,
  uvIndex: 6,
  pressure: 1012,
  hourlyForecasts: [
    { time: '12:00', temperature: 28, condition: 'Clear Sky', precipitation: 0 },
    { time: '13:00', temperature: 29, condition: 'Clear Sky', precipitation: 0 },
    { time: '14:00', temperature: 30, condition: 'Clear Sky', precipitation: 0 },
    { time: '15:00', temperature: 30, condition: 'Few Clouds', precipitation: 0 },
    { time: '16:00', temperature: 29, condition: 'Few Clouds', precipitation: 0 },
    { time: '17:00', temperature: 28, condition: 'Few Clouds', precipitation: 0 },
    { time: '18:00', temperature: 26, condition: 'Few Clouds', precipitation: 0 },
    { time: '19:00', temperature: 25, condition: 'Clear Sky', precipitation: 0 },
    { time: '20:00', temperature: 24, condition: 'Clear Sky', precipitation: 0 },
    { time: '21:00', temperature: 23, condition: 'Clear Sky', precipitation: 0 },
    { time: '22:00', temperature: 22, condition: 'Clear Sky', precipitation: 0 },
    { time: '23:00', temperature: 21, condition: 'Clear Sky', precipitation: 0 },
  ],
  dailyForecasts: [
    { day: 'Monday', date: 'Jun 12', highTemp: 30, lowTemp: 21, condition: 'Clear Sky', precipitation: 0 },
    { day: 'Tuesday', date: 'Jun 13', highTemp: 32, lowTemp: 22, condition: 'Few Clouds', precipitation: 0 },
    { day: 'Wednesday', date: 'Jun 14', highTemp: 33, lowTemp: 23, condition: 'Few Clouds', precipitation: 0 },
    { day: 'Thursday', date: 'Jun 15', highTemp: 31, lowTemp: 22, condition: 'Scattered Clouds', precipitation: 10 },
    { day: 'Friday', date: 'Jun 16', highTemp: 29, lowTemp: 21, condition: 'Rain', precipitation: 40 },
    { day: 'Saturday', date: 'Jun 17', highTemp: 27, lowTemp: 20, condition: 'Rain', precipitation: 30 },
    { day: 'Sunday', date: 'Jun 18', highTemp: 28, lowTemp: 20, condition: 'Few Clouds', precipitation: 10 },
  ],
  mapLocation: { lat: 35.6892, lon: 51.3890 }
};

const WeatherForecastContainer = ({ onConditionChange }: WeatherForecastContainerProps) => {
  const [weatherData, setWeatherData] = useState(mockWeatherData);

  // Notify parent component when condition changes
  useEffect(() => {
    if (onConditionChange) {
      onConditionChange(weatherData.condition);
    }
  }, [weatherData.condition, onConditionChange]);

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

          {/* Right column - Map (desktop only) */}
          <div className="lg:w-2/5 order-1 lg:order-2">
            <MapComponent location={weatherData.mapLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecastContainer; 