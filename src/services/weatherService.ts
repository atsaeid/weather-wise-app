import { isAxiosError } from 'axios';
import axiosInstance from '../lib/axios';
import { config } from '../config';

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
  isFavorite?: boolean;
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

export interface LocationSearchResult {
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  timezone: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

// Available locations with their time zones
const locationData = [
  { 
    name: 'Tehran',
    timezone: 'Asia/Tehran', 
    lat: 35.6892,
    lon: 51.3890,
    baseTemp: 28,
    isFavorite: true
  },
  { 
    name: 'New York',
    timezone: 'America/New_York', 
    lat: 40.7128,
    lon: -74.0060,
    baseTemp: 22,
    isFavorite: true
  },
  { 
    name: 'London',
    timezone: 'Europe/London', 
    lat: 51.5074,
    lon: -0.1278,
    baseTemp: 18,
    isFavorite: true
  },
  { 
    name: 'Tokyo',
    timezone: 'Asia/Tokyo', 
    lat: 35.6762,
    lon: 139.6503,
    baseTemp: 25,
    isFavorite: true
  },
  { 
    name: 'Sydney',
    timezone: 'Australia/Sydney', 
    lat: -33.8688,
    lon: 151.2093,
    baseTemp: 23,
    isFavorite: true
  },
  { 
    name: 'Dubai',
    timezone: 'Asia/Dubai', 
    lat: 25.2048,
    lon: 55.2708,
    baseTemp: 33,
    isFavorite: true
  },
  { 
    name: 'Paris',
    timezone: 'Europe/Paris', 
    lat: 48.8566,
    lon: 2.3522,
    baseTemp: 20,
    isFavorite: true
  },
  { 
    name: 'Moscow',
    timezone: 'Europe/Moscow', 
    lat: 55.7558,
    lon: 37.6173,
    baseTemp: 15,
    isFavorite: true
  },
];

// Local storage key for favorites
const FAVORITE_LOCATIONS_KEY = 'weather_wise_favorite_locations';

// Function to get favorite locations from local storage
const getFavoriteLocations = (): string[] => {
  const storedFavorites = localStorage.getItem(FAVORITE_LOCATIONS_KEY);
  if (storedFavorites) {
    return JSON.parse(storedFavorites);
  }
  // Default favorites if none are stored
  return locationData.filter(loc => loc.isFavorite).map(loc => loc.name);
};

// Function to save favorite locations to local storage
const saveFavoriteLocations = (favorites: string[]): void => {
  localStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(favorites));
  // Dispatch a custom event to notify components that favorites have changed
  window.dispatchEvent(new CustomEvent('favorites-updated'));
};

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
  const favorites = getFavoriteLocations();
  
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
    isFavorite: favorites.includes(locationName)
  };
};

// Helper function to get auth header
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem(config.auth.tokenKey);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const weatherService = {
  async getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    });
  },

  async getWeatherByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<WeatherData> {
    try {
      const { data } = await axiosInstance.get<WeatherData>(
        `${config.api.weather.baseUrl}/coordinates`,
        {
          params: { lat: latitude, lon: longitude },
        }
      );
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch weather data'
        );
      }
      throw error;
    }
  },

  async getWeatherData(locationName: string): Promise<WeatherData> {
    try {
      const { data } = await axiosInstance.get<WeatherData>(
        `${config.api.weather.baseUrl}/${encodeURIComponent(locationName)}`
      );
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch weather data'
        );
      }
      throw error;
    }
  },

  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    try {
      const { data } = await axiosInstance.get<LocationSearchResult[]>(
        config.api.weather.searchUrl,
        {
          params: { query },
        }
      );
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Location search failed'
        );
      }
      throw error;
    }
  },

  async getFavoriteLocations(): Promise<string[]> {
    try {
      const { data } = await axiosInstance.get<{ locations: string[] }>(
        config.api.favorites.baseUrl
      );
      return data.locations;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch favorites'
        );
      }
      throw error;
    }
  },

  async addToFavorites(locationName: string): Promise<void> {
    try {
      await axiosInstance.post(
        `${config.api.favorites.baseUrl}/${encodeURIComponent(locationName)}`
      );
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to add to favorites'
        );
      }
      throw error;
    }
  },

  async removeFromFavorites(locationName: string): Promise<void> {
    try {
      await axiosInstance.delete(
        `${config.api.favorites.baseUrl}/${encodeURIComponent(locationName)}`
      );
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to remove from favorites'
        );
      }
      throw error;
    }
  },

  async getStaticMapImage(
    lat: number,
    lon: number,
    zoom: number = 12,
    width: number = 800,
    height: number = 600
  ): Promise<string> {
    try {
      const { data } = await axiosInstance.get<{ imageBase64: string }>(
        config.api.map.staticUrl,
        {
          params: {
            latitude: lat,
            longitude: lon,
            zoom,
            width,
            height,
          },
        }
      );
      return data.imageBase64;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch map image'
        );
      }
      throw error;
    }
  },
};

export default weatherService; 