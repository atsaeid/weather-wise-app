import React, { useEffect, useState } from 'react';
import { weatherService } from '../../services/weatherService';

interface WeatherMapProps {
  latitude: number;
  longitude: number;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ latitude, longitude }) => {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true);
        setError(null);
        const imageBase64 = await weatherService.getStaticMapImage(latitude, longitude);
        setMapImage(imageBase64);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
        console.error('Error loading map:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMap();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
        <p className="text-white/80">{error}</p>
      </div>
    );
  }

  if (!mapImage) {
    return null;
  }

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <img
        src={`data:image/png;base64,${mapImage}`}
        alt="Location Map"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default WeatherMap; 