import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { weatherService } from '../services/weatherService';
import { MapPin, Heart, X, Compass, Layers } from 'lucide-react';

interface MapLocation {
  name: string;
  lat: number;
  lon: number;
  temperature: number;
  condition: string;
  isFavorite: boolean;
}

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; } | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        // If can't get user location, default to Tehran
        setUserLocation({ lat: 35.6892, lon: 51.3890 });
      }
    );
    
    // Get favorite locations if user is authenticated
    if (isAuthenticated) {
      const favLocations = weatherService.getFavoriteLocations().map(loc => {
        const data = weatherService.getWeatherData(loc);
        return {
          name: data.location,
          lat: data.mapLocation.lat,
          lon: data.mapLocation.lon,
          temperature: data.temperature,
          condition: data.condition,
          isFavorite: true
        };
      });
      setFavoriteLocations(favLocations);
    }
  }, [isAuthenticated]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 to-slate-900">
      <Header />
      
      <main className="flex-grow relative">
        {/* Simulated map container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 overflow-hidden">
          {/* Simulated map grid */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-white/20"></div>
            ))}
          </div>
          
          {/* Simulated water bodies */}
          <div className="absolute bottom-10 left-5 w-60 h-20 bg-blue-700/20 rounded-full transform -rotate-45"></div>
          <div className="absolute top-40 right-20 w-80 h-30 bg-blue-700/20 rounded-full transform -rotate-12"></div>
          <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-blue-700/20 rounded-full"></div>
          
          {/* Simulated land masses */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/5 rounded-lg transform rotate-12"></div>
          <div className="absolute bottom-40 right-20 w-60 h-30 bg-white/5 rounded-lg transform -rotate-6"></div>
          
          {/* Simulated roads */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 transform -rotate-3"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 transform rotate-3"></div>
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white/10 transform rotate-1"></div>
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-white/10"></div>
          
          {/* User location marker */}
          {userLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs">
                Your Location
              </div>
            </div>
          )}
          
          {/* Favorite location markers */}
          {favoriteLocations.map((location, index) => {
            const randomTop = 10 + Math.random() * 80;
            const randomLeft = 10 + Math.random() * 80;
            return (
              <div 
                key={index} 
                className="absolute z-10" 
                style={{ top: `${randomTop}%`, left: `${randomLeft}%` }}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="flex flex-col items-center cursor-pointer group">
                  <MapPin className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <Heart className="w-4 h-4 -mt-1 fill-red-500 text-red-500" />
                  <div className="mt-1 whitespace-nowrap bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded text-white text-xs">
                    {location.name} | {location.temperature}°
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button 
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            title="Find my location"
          >
            <Compass className="w-5 h-5" />
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            title="Change map style"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
        
        {/* Selected location details */}
        {selectedLocation && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white/10 backdrop-blur-md rounded-xl p-4 text-white z-30 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
                <p className="text-sm text-white/80">{selectedLocation.condition}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">{selectedLocation.temperature}°</div>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MapPage; 