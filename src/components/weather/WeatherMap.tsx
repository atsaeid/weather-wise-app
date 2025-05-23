import React from 'react';
import { config } from '../../config';

interface WeatherMapProps {
  latitude: number;
  longitude: number;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ latitude, longitude }) => {
  const mapUrl = `${config.endpoints.maps}/static?lat=${latitude}&lon=${longitude}&zoom=12&width=800&height=400`;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <img
        src={mapUrl}
        alt="Weather location map"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default WeatherMap; 