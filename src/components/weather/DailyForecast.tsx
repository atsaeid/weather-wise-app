import React from 'react';
import type { DailyForecast } from '../../services/weatherService';
import { roundNumber } from '../../utils/numberFormatter';

interface DailyForecastProps {
  forecasts: DailyForecast[];
}

const DailyForecast: React.FC<DailyForecastProps> = ({ forecasts }) => {
  return (
    <div className="space-y-4">
      {forecasts.map((forecast, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white/5 rounded-lg p-4"
        >
          <div className="flex items-center space-x-4">
            <p className="text-white w-24">
              {new Date(forecast.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <img
              src={`/weather-icons/${forecast.condition.toLowerCase()}.svg`}
              alt={forecast.condition}
              className="w-8 h-8"
            />
            <p className="text-white/80 capitalize">{forecast.condition}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              </span>
              <span className="text-white font-semibold">{Math.round(forecast.maxTemp)}°</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </span>
              <span className="text-white/80">{Math.round(forecast.minTemp)}°</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-white/60">{roundNumber(forecast.precipitation)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyForecast; 