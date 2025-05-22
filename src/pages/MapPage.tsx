import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { weatherService } from '../services/weatherService';
import { MapPin, Heart, X, Compass, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { config } from '../config';

// Fix for default marker icons in Leaflet with Webpack
// Create custom icons for markers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const favoriteIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'favorite-marker'
});

// Set default icon for all markers
L.Marker.prototype.options.icon = defaultIcon;

interface MapLocation {
  name: string;
  lat: number;
  lon: number;
  temperature: number;
  condition: string;
  isFavorite: boolean;
}

// Weather map layer options
interface WeatherMapLayer {
  name: string;
  value: string;
  label: string;
}

// Custom component to set the map view to user location
const SetViewOnClick = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 10);
    }
  }, [coords, map]);
  return null;
};

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; } | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeWeatherLayer, setActiveWeatherLayer] = useState('temp_new');
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // OpenWeatherMap API key
  const apiKey = config.openWeatherApiKey;
  
  // Weather map layers
  const weatherLayers: WeatherMapLayer[] = [
    { name: 'Temperature', value: 'temp_new', label: 'Temperature' },
    { name: 'Clouds', value: 'clouds_new', label: 'Clouds' },
    { name: 'Precipitation', value: 'precipitation_new', label: 'Precipitation' },
    { name: 'Pressure', value: 'pressure_new', label: 'Sea Level Pressure' },
    { name: 'Wind', value: 'wind_new', label: 'Wind Speed' }
  ];

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

  // Handle changing the weather map layer
  const handleLayerChange = (layer: string) => {
    setActiveWeatherLayer(layer);
    setShowLayerSelector(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 to-slate-900">
      <Header />
      
      <main className="flex-grow relative overflow-hidden map-page">
        {userLocation && (
          <div className="absolute inset-0">
            <MapContainer 
              center={[userLocation.lat, userLocation.lon] as [number, number]} 
              zoom={10} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              zoomControl={false}
            >
              {/* Base map layer */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Weather map layer */}
              <TileLayer
                url={`https://tile.openweathermap.org/map/${activeWeatherLayer}/{z}/{x}/{y}.png?appid=${apiKey}`}
                attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                opacity={0.7}
              />
              
              {/* User location marker */}
              <Marker position={[userLocation.lat, userLocation.lon] as [number, number]}>
                <Popup>
                  <div className="text-center font-medium">Your Location</div>
                </Popup>
              </Marker>
              
              {/* Favorite location markers */}
              {favoriteLocations.map((location, index) => (
                <Marker 
                  key={index} 
                  position={[location.lat, location.lon] as [number, number]}
                  icon={favoriteIcon}
                  eventHandlers={{
                    click: () => setSelectedLocation(location),
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <div className="font-medium">{location.name}</div>
                      <div>{location.temperature}° | {location.condition}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Set view to user location */}
              <SetViewOnClick coords={userLocation ? [userLocation.lat, userLocation.lon] : null} />
            </MapContainer>
          </div>
        )}
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button 
            className="w-10 h-10 rounded-full bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 transition-colors flex items-center justify-center text-white shadow-lg"
            title="Find my location"
            onClick={() => {
              if (userLocation) {
                // This will re-center the map to user's location
                setUserLocation({...userLocation});
              }
            }}
          >
            <Compass className="w-5 h-5" />
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 transition-colors flex items-center justify-center text-white shadow-lg"
            title="Change weather layer"
            onClick={() => setShowLayerSelector(!showLayerSelector)}
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
        
        {/* Weather layer selector */}
        {showLayerSelector && (
          <div className="absolute top-16 right-4 bg-slate-800/90 backdrop-blur-md rounded-lg p-2 z-20 w-52 shadow-lg border border-slate-700/50 animate-fade-in">
            <h4 className="text-white text-xs uppercase font-medium mb-2 px-2">Weather Layers</h4>
            <div className="space-y-1">
              {weatherLayers.map((layer) => (
                <button
                  key={layer.value}
                  onClick={() => handleLayerChange(layer.value)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center ${
                    activeWeatherLayer === layer.value 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'text-white hover:bg-slate-700/80'
                  }`}
                >
                  <span className="h-3 w-3 rounded-full mr-2 border border-white/20 bg-white/30"></span>
                  {layer.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Selected location details */}
        {selectedLocation && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-slate-800/90 backdrop-blur-md rounded-xl p-4 text-white z-30 animate-fade-in shadow-lg border border-slate-700/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
                <p className="text-sm text-white/80">{selectedLocation.condition}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">{selectedLocation.temperature}°</div>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="w-8 h-8 rounded-full bg-slate-700/80 hover:bg-slate-600 flex items-center justify-center"
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