import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Maximize2, Minimize2, X } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { config } from '../../config';

interface MapComponentProps {
  location?: { lat: number; lon: number };
  onLocationSelect?: (location: string) => void;
}

const MapComponent = ({ location, onLocationSelect }: MapComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [mapUrl, setMapUrl] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Load available locations on mount
  useEffect(() => {
    const locations = weatherService.getAvailableLocations();
    setAvailableLocations(locations);
  }, []);

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate static map URL when location changes
  useEffect(() => {
    if (location?.lat && location?.lon) {
      const url = new URL(config.locationIQ.staticMapUrl);
      const params = new URLSearchParams({
        key: config.locationIQ.apiKey,
        center: `${location.lat},${location.lon}`,
        zoom: '16.5',
        size: '800x600',
        format: 'jpg',
        markers: `icon:default|color:red|size:large|${location.lat},${location.lon}`,
        style: 'streets',
        scale: '2',
      });
      url.search = params.toString();
      setMapUrl(url.toString());
    }
  }, [location]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    if (value.trim()) {
      // Filter locations based on search input
      const filtered = availableLocations.filter(
        loc => loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleLocationClick = (locationName: string) => {
    setSearchValue(locationName);
    setIsSearching(false);
    
    if (onLocationSelect) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        onLocationSelect(locationName);
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div 
      className={`bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden relative transition-all duration-300 ease-in-out ${
        isExpanded ? 'h-96' : 'h-60'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-500/5 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 p-5 flex flex-col h-full">
        <div className="flex justify-between mb-3">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <MapPin className="mr-2 text-yellow-300" size={20} />
            Weather Map
          </h3>
          
          <div className="flex space-x-2">
            <button 
              className={`w-8 h-8 rounded-full ${isSearching ? 'bg-blue-600' : 'bg-white/10'} flex items-center justify-center hover:bg-white/20 transition-colors`}
              onClick={() => setIsSearching(!isSearching)}
            >
              <Search size={16} className="text-white/80" />
            </button>
            
            <button 
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={toggleExpand}
            >
              {isExpanded ? 
                <Minimize2 size={16} className="text-white/80" /> : 
                <Maximize2 size={16} className="text-white/80" />
              }
            </button>
          </div>
        </div>

        {/* Search city input */}
        {isSearching && (
          <div ref={searchRef} className="absolute top-16 left-4 right-4 z-20 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-slate-800/95 backdrop-blur-md border border-white/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-lg shadow-lg"
                placeholder="Search for a city..."
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                autoFocus
              />
              <Search className="absolute top-3.5 left-4 h-6 w-6 text-white/50" />
              {searchValue && (
                <button 
                  onClick={() => setSearchValue('')}
                  className="absolute right-4 top-3.5"
                >
                  <X className="h-6 w-6 text-white/50 hover:text-white transition-colors" />
                </button>
              )}
            </div>
            
            {/* Search results dropdown */}
            {isSearching && filteredLocations.length > 0 && (
              <div className="mt-2 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl max-h-[calc(100vh-300px)] overflow-auto">
                {filteredLocations.map(loc => (
                  <button
                    key={loc}
                    className="w-full text-left px-6 py-3 hover:bg-white/10 text-white flex items-center transition-colors first:rounded-t-xl last:rounded-b-xl text-base"
                    onClick={() => handleLocationClick(loc)}
                  >
                    <MapPin size={18} className="mr-3 text-blue-400" />
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex-1 relative">
          <div className="relative h-full w-full rounded-xl overflow-hidden shadow-xl">
            {mapUrl ? (
              <div className="relative h-full w-full group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative h-full w-full overflow-hidden">
                  <img 
                    src={mapUrl} 
                    alt="Location Map"
                    className="absolute w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                    style={{ imageRendering: 'crisp-edges' }}
                    loading="eager"
                  />
                </div>
                {location && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-white/10 backdrop-blur-sm rounded-full animate-pulse" />
                      <MapPin size={32} className="text-red-500 drop-shadow-lg animate-bounce-slow" />
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-red-500 rounded-full opacity-30 animate-ping-slow" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-in-out transform translate-y-[calc(100%)] group-hover:translate-y-0 group-hover:bottom-4 z-20">
                  <div className="mx-4">
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 group-hover:bg-black/40">
                      <div className="p-3">
                        <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                          <MapPin size={16} className="text-white transition-colors" />
                          <div className="text-white font-medium transition-all duration-300 text-sm">
                            {searchValue || 'Selected Location'}
                          </div>
                        </div>
                        <div className="text-xs text-white/40 group-hover:text-white/70 mt-1 transition-all duration-300 opacity-0 group-hover:opacity-100">
                          {location ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` : 'Coordinates will appear here'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Enhanced fallback UI
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 space-y-3">
                  <MapPin size={40} className="text-white/40 mb-2" />
                  <div className="text-sm font-medium">Select a location to view the map</div>
                  <div className="text-xs opacity-60">The map will be displayed here</div>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24px,rgba(255,255,255,0.03)_25px,rgba(255,255,255,0.03)_26px,transparent_27px,transparent_49px,rgba(255,255,255,0.03)_50px,rgba(255,255,255,0.03)_51px,transparent_52px),linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.03)_25px,rgba(255,255,255,0.03)_26px,transparent_27px,transparent_49px,rgba(255,255,255,0.03)_50px,rgba(255,255,255,0.03)_51px,transparent_52px)] bg-[length:50px_50px]" />
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 text-xs text-white/50">
          Search for a city to see weather details for that location
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 