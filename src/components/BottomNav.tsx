import { useState, useEffect } from 'react';
import { Home, Star, Clock } from 'lucide-react';
import { MapTrifold } from 'phosphor-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');
  
  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('home');
    } else if (location.pathname === '/recent') {
      setActiveTab('recent');
    } else if (location.pathname === '/map') {
      setActiveTab('map');
    }
  }, [location.pathname]);

  // Handle tab click
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'recent':
        navigate('/recent');
        break;
      case 'map':
        navigate('/map');
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/60 shadow-lg backdrop-blur-md py-3 shadow-lg rounded-t-2xl z-20">
      <div className="px-6 flex justify-around items-center text-white">
        <button 
          className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'home' ? 'text-yellow-300 scale-110' : 'text-white'}`}
          onClick={() => handleTabClick('home')}
        >
          <Home 
            size={24} 
            className={`transition-all duration-300 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
          />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'recent' ? 'text-yellow-300 scale-110' : 'text-white'}`}
          onClick={() => handleTabClick('recent')}
        >
          <Clock 
            size={24} 
            className={`transition-all duration-300 ${activeTab === 'recent' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} 
          />
          <span className="text-xs mt-1">Recent</span>
        </button>
        
        <button 
          className={`flex flex-col items-center transition-all duration-300 ${activeTab === 'map' ? 'text-yellow-300 scale-110' : 'text-white'}`}
          onClick={() => handleTabClick('map')}
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
