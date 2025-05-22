import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { weatherService } from '../services/weatherService';
import { MapPin, Heart, X, Compass, Layers, LogIn } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { config } from '../config';
import { Link } from 'react-router-dom';

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

// Custom component for map controls that don't cause re-renders
const MapController = ({ userPosition }: { userPosition: [number, number] | null }) => {
  const map = useMap();
  
  // Set initial view only once when the map loads
  useEffect(() => {
    if (userPosition) {
      map.setView(userPosition, 10);
    }
  }, []); // Empty dependency array - only run once on mount
  
  return null;
};

// Component to focus on selected location
const FocusLocation = ({ 
  position, 
  isActive 
}: { 
  position: [number, number] | null,
  isActive: boolean
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (position && isActive) {
      map.setView(position, 12);
    }
  }, [position, isActive, map]);
  
  return null;
};

// Component to focus on user location
const FocusUserLocation = ({
  position,
  shouldFocus,
  onFocusComplete
}: {
  position: [number, number] | null,
  shouldFocus: boolean,
  onFocusComplete: () => void
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (position && shouldFocus) {
      // Close any open popups first
      map.closePopup();
      
      // Set a small timeout to ensure popup closing has completed
      setTimeout(() => {
        map.setView(position, 10);
        onFocusComplete();
      }, 50);
    }
  }, [position, shouldFocus, map, onFocusComplete]);
  
  return null;
};

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; } | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [activeWeatherLayer, setActiveWeatherLayer] = useState('temp_new');
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [focusUserLocation, setFocusUserLocation] = useState(false);
  const { isAuthenticated } = useAuth();
  const mapInitialized = useRef(false);
  const mapRef = useRef<L.Map | null>(null);
  
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

  // Get user's location with more reliable fallbacks
  useEffect(() => {
    const getUserLocation = () => {
      // Only request location if we haven't set it yet
      if (!userLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            console.log("Successfully got user location:", newLocation);
            setUserLocation(newLocation);
            setMapReady(true);
          },
          (error) => {
            console.error('Error getting location:', error);
            // If can't get user location, default to Tehran
            const defaultLocation = { lat: 35.6892, lon: 51.3890 };
            console.log("Using default location:", defaultLocation);
            setUserLocation(defaultLocation);
            setMapReady(true);
          },
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 
          }
        );
      } else {
        setMapReady(true);
      }
    };
    
    getUserLocation();
  }, []);
  
  // Clear selected location if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedLocation(null);
      setFavoriteLocations([]);
    }
  }, [isAuthenticated]);
  
  // Get favorite locations if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      try {
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
      } catch (error) {
        console.error('Error loading favorite locations:', error);
        setFavoriteLocations([]);
      }
    } else {
      // Clear favorite locations when not authenticated
      setFavoriteLocations([]);
    }
  }, [isAuthenticated]);

  // Handle changing the weather map layer
  const handleLayerChange = (layer: string) => {
    setActiveWeatherLayer(layer);
    setShowLayerSelector(false);
  };

  // Handle user clicking "Find my location" button
  const handleGoToUserLocation = () => {
    if (userLocation) {
      // Clear any selected location
      setSelectedLocation(null);
      
      if (mapRef.current) {
        // Close any open popups
        mapRef.current.closePopup();
      }
      
      // Trigger a map focus on the user location
      setFocusUserLocation(true);
    }
  };
  
  // Called after map has focused on user location
  const handleUserLocationFocusComplete = () => {
    setFocusUserLocation(false);
  };
  
  // Handle selecting a location
  const handleSelectLocation = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 to-slate-900">
      <Header />
      
      <main className="flex-grow relative overflow-hidden map-page">
        {mapReady && userLocation && (
          <div className="absolute inset-0">
            <MapContainer 
              center={[userLocation.lat, userLocation.lon] as [number, number]} 
              zoom={10} 
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              zoomControl={false}
              whenReady={() => {
                if (!mapInitialized.current) {
                  mapInitialized.current = true;
                }
              }}
              ref={(map) => {
                if (map) {
                  mapRef.current = map;
                }
              }}
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
                <Popup closeButton={true} autoClose={false}>
                  <div className="text-center font-medium">Your Location</div>
                </Popup>
              </Marker>
              
              {/* Favorite location markers - only show when authenticated */}
              {isAuthenticated && favoriteLocations.map((location, index) => (
                <Marker 
                  key={index} 
                  position={[location.lat, location.lon] as [number, number]}
                  icon={favoriteIcon}
                  eventHandlers={{
                    click: () => {
                      handleSelectLocation(location);
                    },
                  }}
                >
                  <Popup closeButton={true} autoClose={true}>
                    <div className="text-center">
                      <div className="font-medium">{location.name}</div>
                      <div>{location.temperature}° | {location.condition}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Initial map controller */}
              <MapController userPosition={userLocation ? [userLocation.lat, userLocation.lon] : null} />
              
              {/* Focus controller for selected location */}
              {selectedLocation && (
                <FocusLocation 
                  position={[selectedLocation.lat, selectedLocation.lon] as [number, number]} 
                  isActive={true} 
                />
              )}
              
              {/* Focus controller for user location */}
              <FocusUserLocation
                position={userLocation ? [userLocation.lat, userLocation.lon] : null}
                shouldFocus={focusUserLocation}
                onFocusComplete={handleUserLocationFocusComplete}
              />
            </MapContainer>
          </div>
        )}
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button 
            className="w-10 h-10 rounded-full bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 transition-colors flex items-center justify-center text-white shadow-lg"
            title="Find my location"
            onClick={handleGoToUserLocation}
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
        
        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <div className="absolute bottom-20 left-0 right-0 mx-auto w-11/12 max-w-md bg-slate-800/90 backdrop-blur-md rounded-xl p-4 text-white z-30 animate-fade-in shadow-lg border border-slate-700/50">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 mr-2 text-slate-400" />
                <h3 className="text-lg font-semibold">Favorite Locations</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">Sign in to see your favorite locations on the map</p>
              <Link 
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </div>
          </div>
        )}
        
        {/* Selected location details */}
        {selectedLocation && (
          <div className="absolute bottom-20 left-0 right-0 mx-auto w-11/12 max-w-md bg-slate-800/90 backdrop-blur-md rounded-xl p-4 text-white z-30 animate-fade-in shadow-lg border border-slate-700/50">
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
        
        {/* Loading indicator */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MapPage; 