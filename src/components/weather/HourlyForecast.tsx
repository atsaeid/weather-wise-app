import React from 'react';
import type { HourlyForecast as HourlyForecastType } from '../../services/weatherService';
import { formatTimeOnly } from '../../utils/dateFormatter';
import { roundNumber } from '../../utils/numberFormatter';

interface HourlyForecastProps {
  forecasts: HourlyForecastType[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecasts }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-6 min-w-max">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white/5 rounded-lg p-4 min-w-[100px]"
          >
            <p className="text-white/80 text-sm">
              {formatTimeOnly(forecast.time)}
            </p>
            <div className="my-2">
              <img
                src={`/weather-icons/${forecast.condition.toLowerCase()}.svg`}
                alt={forecast.condition}
                className="w-8 h-8"
              />
            </div>
            <p className="text-white font-semibold">{Math.round(forecast.temperature)}°</p>
            <p className="text-white/60 text-sm">{roundNumber(forecast.precipitation)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast; 