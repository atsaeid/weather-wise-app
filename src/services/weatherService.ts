// Weather data interface
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
  timezone: string;
  localTime: string;
  hourlyForecasts: HourlyForecast[];
  dailyForecasts: DailyForecast[];
  mapLocation: { lat: number; lon: number };
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  precipitation: number;
}

// Available locations with their time zones
const locationData = [
  { 
    name: 'Tehran',
    timezone: 'Asia/Tehran', 
    lat: 35.6892,
    lon: 51.3890,
    baseTemp: 28
  },
  { 
    name: 'New York',
    timezone: 'America/New_York', 
    lat: 40.7128,
    lon: -74.0060,
    baseTemp: 22
  },
  { 
    name: 'London',
    timezone: 'Europe/London', 
    lat: 51.5074,
    lon: -0.1278,
    baseTemp: 18
  },
  { 
    name: 'Tokyo',
    timezone: 'Asia/Tokyo', 
    lat: 35.6762,
    lon: 139.6503,
    baseTemp: 25
  },
  { 
    name: 'Sydney',
    timezone: 'Australia/Sydney', 
    lat: -33.8688,
    lon: 151.2093,
    baseTemp: 23
  },
];

// Functions to get localized time for each location
const getLocalTime = (timezone: string): string => {
  try {
    return new Date().toLocaleTimeString('en-US', { 
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error getting local time:', error);
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  }
};

// Weather conditions based on location and time
const getWeatherCondition = (locationName: string): string => {
  // For demonstration, we're using fixed conditions per location
  // In a real application, this would be fetched from a weather API
  const conditions = {
    'Tehran': 'Clear Sky',
    'New York': 'Few Clouds',
    'London': 'Rain',
    'Tokyo': 'Scattered Clouds',
    'Sydney': 'Overcast Clouds',
  };
  
  return conditions[locationName as keyof typeof conditions] || 'Clear Sky';
};

// Mock weather data generator
const generateWeatherData = (locationName: string): WeatherData => {
  const location = locationData.find(loc => loc.name === locationName) || locationData[0];
  const condition = getWeatherCondition(locationName);
  const timezone = location.timezone;
  const localTime = getLocalTime(timezone);
  
  // Generate mock hourly forecast
  const hourlyForecasts: HourlyForecast[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  
  for (let i = 0; i < 12; i++) {
    const forecastHour = (currentHour + i) % 24;
    const time = `${forecastHour}:00`;
    const temp = location.baseTemp + Math.floor(Math.random() * 5) - 2; // Random temperature variation
    
    hourlyForecasts.push({
      time,
      temperature: temp,
      condition,
      precipitation: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0,
    });
  }
  
  // Generate mock daily forecast
  const dailyForecasts: DailyForecast[] = [];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + i);
    const day = days[forecastDate.getDay()];
    const date = `${months[forecastDate.getMonth()]} ${forecastDate.getDate()}`;
    
    dailyForecasts.push({
      day,
      date,
      highTemp: location.baseTemp + Math.floor(Math.random() * 5),
      lowTemp: location.baseTemp - Math.floor(Math.random() * 8) - 2,
      condition: i === 0 ? condition : getWeatherCondition(locationName),
      precipitation: Math.random() > 0.7 ? Math.floor(Math.random() * 40) : 0,
    });
  }
  
  return {
    location: locationName,
    temperature: location.baseTemp,
    condition,
    feelsLike: location.baseTemp + 2,
    humidity: Math.floor(Math.random() * 60) + 30,
    windSpeed: Math.floor(Math.random() * 15) + 5,
    uvIndex: Math.floor(Math.random() * 10) + 1,
    pressure: Math.floor(Math.random() * 30) + 1000,
    timezone,
    localTime,
    hourlyForecasts,
    dailyForecasts,
    mapLocation: { lat: location.lat, lon: location.lon },
  };
};

// Export the service
export const weatherService = {
  getWeatherData: (locationName: string = 'Tehran'): WeatherData => {
    return generateWeatherData(locationName);
  },
  getAvailableLocations: (): string[] => {
    return locationData.map(loc => loc.name);
  },
  getLocalTime: (timezone: string): string => {
    return getLocalTime(timezone);
  }
};

export default weatherService; 