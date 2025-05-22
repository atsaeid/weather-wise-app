import { useState } from 'react';
import { MapPin, Layers, Search, Maximize2, Minimize2 } from 'lucide-react';

interface MapComponentProps {
  location?: { lat: number; lon: number };
  onLocationSelect?: (location: { lat: number; lon: number }) => void;
}

const MapComponent = ({ location, onLocationSelect }: MapComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // This would be replaced with actual map integration (e.g., Google Maps, Leaflet)
  const fakeMap = (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-inner">
      {/* Placeholder for the map - in a real app, this would be a proper map API integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700 opacity-70"></div>
      
      {/* Decorative map elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[25%] bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-[15%] right-[20%] w-[35%] h-[30%] bg-blue-500/20 rounded-full blur-xl"></div>
        
        {/* Fake landmass */}
        <div className="absolute top-[10%] left-[15%] w-[70%] h-[65%] bg-green-800/30 rounded-[40%] blur-sm"></div>
        
        {/* Fake rivers/lakes */}
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[5%] bg-blue-400/40 rounded-full blur-sm"></div>
        <div className="absolute top-[45%] left-[25%] w-[15%] h-[15%] bg-blue-400/40 rounded-full blur-sm"></div>
        
        {/* Overlay grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_49px,rgba(255,255,255,0.05)_50px,rgba(255,255,255,0.05)_51px,transparent_52px),linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.05)_25px,rgba(255,255,255,0.05)_26px,transparent_27px,transparent_49px,rgba(255,255,255,0.05)_50px,rgba(255,255,255,0.05)_51px,transparent_52px)] bg-[length:50px_50px]"></div>
      </div>

      {/* Marker for the selected location */}
      {location && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPin size={28} className="text-red-500 animate-bounce-slow" />
            <div className="absolute -top-1 -left-1 w-7 h-7 bg-red-500 rounded-full opacity-30 animate-ping-slow"></div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );

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
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setIsLoading(prev => !prev)} // Just for demo
            >
              <Search size={16} className="text-white/80" />
            </button>
            
            <button 
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Layers size={16} className="text-white/80" />
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
        
        <div className="flex-1 relative">
          {fakeMap}
        </div>
        
        <div className="mt-3 text-center text-xs text-white/50">
          Click on the map to see weather details for that location
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 