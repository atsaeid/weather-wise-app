import { useState } from 'react';
import { Home, Star, Clock, MapPin, LogOut, UserCircle } from 'lucide-react';
import { MapTrifold } from 'phosphor-react';

const BottomNav = () => {
  // This would actually come from your auth context or state management
  // For now, using local state for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Toggle login state for demo purposes
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md py-3 px-6 flex justify-around items-center text-white rounded-t-2xl shadow-lg">
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
        {isLoggedIn ? (
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
        <span className="text-xs mt-1">{isLoggedIn ? 'Favorites' : 'Recent'}</span>
      </button>
      
      <button 
        className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'map' ? 'text-yellow-300 scale-110' : 'text-white'}`}
        onClick={() => setActiveTab('map')}
      >
        <MapTrifold 
          size={24} 
          weight={activeTab === 'map' ? 'fill' : 'regular'} 
          className="transition-all duration-300"
        />
        <span className="text-xs mt-1">Map</span>
      </button>
      
      <button 
        className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'profile' ? 'text-yellow-300 scale-110' : 'text-white'}`}
        onClick={() => {
          setActiveTab('profile');
          toggleLogin();
        }}
      >
        {isLoggedIn ? (
          <LogOut 
            size={24} 
            className={`transition-all duration-300 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
          />
        ) : (
          <UserCircle 
            size={24} 
            className={`transition-all duration-300 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
          />
        )}
        <span className="text-xs mt-1">{isLoggedIn ? 'Logout' : 'Login'}</span>
      </button>
    </div>
  );
};

export default BottomNav;
