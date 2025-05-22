import { useState } from 'react';
import { Home, Star, Clock } from 'lucide-react';
import { MapTrifold } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md py-3 shadow-lg rounded-t-2xl">
      <div className="container mx-auto px-6 flex justify-around items-center text-white">
        <button 
          className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'home' ? 'text-yellow-300 scale-110' : 'text-white'}`}
          onClick={() => setActiveTab('home')}
        >
          <Home 
            size={24} 
            className={`transition-all duration-300 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
          />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'favorites' ? 'text-yellow-300 scale-110' : 'text-white'}`}
          onClick={() => setActiveTab('favorites')}
        >
          {isAuthenticated ? (
            <Star 
              size={24} 
              className={`transition-all duration-300 ${activeTab === 'favorites' ? 'fill-yellow-300 stroke-yellow-300' : 'fill-transparent'}`} 
            />
          ) : (
            <Clock 
              size={24} 
              className={`transition-all duration-300 ${activeTab === 'favorites' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
            />
          )}
          <span className="text-xs mt-1">{isAuthenticated ? 'Favorites' : 'Recent'}</span>
        </button>
        
        <button 
          className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'map' ? 'text-yellow-300 scale-110' : 'text-white'}`}
          onClick={() => setActiveTab('map')}
        >
          <MapTrifold 
            size={24} 
            className={`transition-all duration-300 ${activeTab === 'map' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
          />
          <span className="text-xs mt-1">Map</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
