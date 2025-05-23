import { Droplets, Gauge, Sun, Thermometer, Wind } from 'lucide-react';
import { roundNumber } from '../../utils/numberFormatter';

interface AirConditionsProps {
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
}

const AirConditions = ({
  feelsLike,
  humidity,
  windSpeed,
  uvIndex,
  pressure
}: AirConditionsProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-500/5 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
          <Wind className="mr-2 text-yellow-300 animate-spin-slow" size={20} />
          Air Conditions
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Feels Like */}
          <div className="flex flex-col animate-fade-in">
            <div className="flex items-center mb-2 text-white/80">
              <Thermometer size={16} className="mr-1.5 text-yellow-300" />
              <p className="text-sm">Feels Like</p>
            </div>
            <p className="text-white text-lg font-semibold">{feelsLike}°C</p>
          </div>

          {/* Wind Speed */}
          <div className="flex flex-col animate-fade-in animation-delay-100">
            <div className="flex items-center mb-2 text-white/80">
              <Wind size={16} className="mr-1.5 text-yellow-300" />
              <p className="text-sm">Wind</p>
            </div>
            <p className="text-white text-lg font-semibold">{windSpeed} km/h</p>
          </div>

          {/* Humidity */}
          <div className="flex flex-col animate-fade-in animation-delay-200">
            <div className="flex items-center mb-2 text-white/80">
              <Droplets size={16} className="mr-1.5 text-yellow-300" />
              <p className="text-sm">Humidity</p>
            </div>
            <div className="relative pt-1">
              <p className="text-white text-lg font-semibold">{roundNumber(humidity)}%</p>
              <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-white/20 mt-1 w-full">
                <div 
                  style={{ width: `${roundNumber(humidity)}%` }} 
                  className="animate-grow-width shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-300 to-yellow-500">
                </div>
              </div>
            </div>
          </div>

          {/* UV Index */}
          <div className="flex flex-col animate-fade-in animation-delay-300">
            <div className="flex items-center mb-2 text-white/80">
              <Sun size={16} className="mr-1.5 text-yellow-300" />
              <p className="text-sm">UV Index</p>
            </div>
            <div className="flex items-center">
              <p className="text-white text-lg font-semibold mr-2">{uvIndex}</p>
              <div className="text-xs text-white/70 px-2 py-0.5 rounded bg-white/10">
                {uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : 'Very High'}
              </div>
            </div>
          </div>

          {/* Pressure */}
          <div className="flex flex-col animate-fade-in animation-delay-400 col-span-2">
            <div className="flex items-center mb-2 text-white/80">
              <Gauge size={16} className="mr-1.5 text-yellow-300" />
              <p className="text-sm">Pressure</p>
            </div>
            <p className="text-white text-lg font-semibold">{pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirConditions; 