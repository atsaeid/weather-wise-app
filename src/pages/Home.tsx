import { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import WeatherForecastContainer from "../components/weather/WeatherForecastContainer";

const Home = () => {
  const [backgroundClass, setBackgroundClass] = useState("from-sky-500 to-blue-900");
  const [isNight, setIsNight] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState("Clear Sky");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Check for selected location in session storage
  useEffect(() => {
    const storedLocation = sessionStorage.getItem('selected_location');
    if (storedLocation) {
      setSelectedLocation(storedLocation);
      // Clear the stored location after reading it
      sessionStorage.removeItem('selected_location');
    }
  }, []);

  // Update background based on weather condition and time of day
  useEffect(() => {
    // Check if it's night
    const hours = new Date().getHours();
    const night = hours < 6 || hours >= 19;
    setIsNight(night);
    
    // Set background color based on condition and time
    let bgColor = '';
    
    if (night) {
      switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
          bgColor = '#0f172a'; // Dark blue for clear night
          break;
        case 'few clouds':
        case 'scattered clouds':
          bgColor = '#1e293b'; // Slate blue for cloudy night
          break;
        case 'broken clouds':
        case 'overcast clouds':
          bgColor = '#1e1e1e'; // Dark gray for overcast night
          break;
        case 'rain':
        case 'shower rain':
          bgColor = '#172554'; // Dark navy for rainy night
          break;
        case 'thunderstorm':
          bgColor = '#1e1b4b'; // Dark purple for thunderstorm night
          break;
        case 'snow':
          bgColor = '#1e293b'; // Slate for snowy night
          break;
        default:
          bgColor = '#0c1d37'; // Default night color
      }
    } else {
      switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
          bgColor = '#0284c7'; // Sky blue for clear day
          break;
        case 'few clouds':
        case 'scattered clouds':
          bgColor = '#0369a1'; // Blue for partly cloudy day
          break;
        case 'broken clouds':
        case 'overcast clouds':
          bgColor = '#475569'; // Slate for overcast day
          break;
        case 'rain':
        case 'shower rain':
          bgColor = '#1e40af'; // Blue for rainy day
          break;
        case 'thunderstorm':
          bgColor = '#4338ca'; // Indigo for thunderstorm day
          break;
        case 'snow':
          bgColor = '#2563eb'; // Lighter blue for snowy day
          break;
        default:
          bgColor = '#0c4a6e'; // Default day color
      }
    }
    
    // Apply background color to body
    document.body.style.backgroundColor = bgColor;
    
    if (night) {
      switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
          setBackgroundClass('from-blue-900 via-indigo-900 to-purple-800');
          break;
        case 'few clouds':
        case 'scattered clouds':
          setBackgroundClass('from-slate-800 via-blue-900 to-indigo-900');
          break;
        case 'broken clouds':
        case 'overcast clouds':
          setBackgroundClass('from-slate-900 via-gray-800 to-slate-700');
          break;
        case 'rain':
        case 'shower rain':
          setBackgroundClass('from-slate-900 via-blue-900 to-slate-800');
          break;
        case 'thunderstorm':
          setBackgroundClass('from-gray-900 via-indigo-900 to-purple-900');
          break;
        case 'snow':
          setBackgroundClass('from-slate-800 via-blue-900 to-slate-700');
          break;
        default:
          setBackgroundClass('from-blue-900 via-indigo-900 to-purple-800');
      }
    } else {
      switch (weatherCondition.toLowerCase()) {
        case 'clear sky':
          setBackgroundClass('from-sky-400 via-blue-500 to-blue-600');
          break;
        case 'few clouds':
        case 'scattered clouds':
          setBackgroundClass('from-blue-400 via-sky-500 to-blue-600');
          break;
        case 'broken clouds':
        case 'overcast clouds':
          setBackgroundClass('from-gray-400 via-slate-500 to-blue-600');
          break;
        case 'rain':
        case 'shower rain':
          setBackgroundClass('from-blue-500 via-blue-600 to-indigo-700');
          break;
        case 'thunderstorm':
          setBackgroundClass('from-slate-600 via-indigo-600 to-purple-700');
          break;
        case 'snow':
          setBackgroundClass('from-blue-300 via-sky-400 to-indigo-600');
          break;
        default:
          setBackgroundClass('from-sky-400 via-blue-500 to-blue-600');
      }
    }
    
    // Clean up function to reset body background when component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [weatherCondition]);

  // Handler to receive condition changes from the WeatherForecastContainer
  const handleConditionChange = (condition: string) => {
    setWeatherCondition(condition);
  };

  // Generate weather effects based on the condition
  const renderWeatherEffects = () => {
    const lowerCaseCondition = weatherCondition.toLowerCase();
    
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('shower')) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i} 
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.7 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      );
    }
    
    if (lowerCaseCondition.includes('snow')) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="snow-flake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      );
    }
    
    if (lowerCaseCondition.includes('clear') && !isNight) {
      return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-yellow-200 blur-xl opacity-50 animate-pulse-slow"></div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      {/* Fixed background that covers the entire screen regardless of content height */}
      <div className="fixed inset-0 w-full h-full z-[-2]">
        <div className={`w-full h-full bg-gradient-to-br ${backgroundClass} transition-colors duration-1000`}></div>
      </div>
      
      {/* Weather effects */}
      {renderWeatherEffects()}
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow overflow-y-auto">
          <div className="px-4">
            <WeatherForecastContainer 
              onConditionChange={handleConditionChange} 
              initialLocation={selectedLocation}
            />
          </div>
        </main>
        <BottomNav />
      </div>
    </>
  );
};

export default Home;
