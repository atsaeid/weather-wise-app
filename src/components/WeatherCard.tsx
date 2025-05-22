import React from 'react';

type WeatherProps = {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
};

const WeatherCard: React.FC<WeatherProps> = ({ location, temperature, condition, icon }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{location}</h2>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-5xl font-extrabold">{temperature}°C</span>
          <span className="text-lg capitalize text-slate-200">{condition}</span>
        </div>
        <img src={icon} alt="Weather icon" className="w-20 h-20" />
      </div>
    </div>
  );
};

export default WeatherCard;
