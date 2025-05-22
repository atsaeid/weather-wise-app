import { weatherService, type WeatherData } from './weatherService';

// Local storage key
const RECENT_LOCATIONS_KEY = 'weather_wise_recent_locations';

// Maximum number of recent locations to track
const MAX_RECENT_LOCATIONS = 20;

// Get recent locations from localStorage
const getRecentLocations = (): string[] => {
  const stored = localStorage.getItem(RECENT_LOCATIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Save recent locations to localStorage
const saveRecentLocations = (locations: string[]): void => {
  localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(locations));
};

// Export the service
export const recentService = {
  /**
   * Add a location to the recent locations list
   */
  addToRecent: (location: string): void => {
    const recents = getRecentLocations();
    
    // Remove the location if it already exists (to move it to the front)
    const filteredLocations = recents.filter(loc => loc !== location);
    
    // Add the new location at the beginning
    filteredLocations.unshift(location);
    
    // Limit to MAX_RECENT_LOCATIONS
    const limitedLocations = filteredLocations.slice(0, MAX_RECENT_LOCATIONS);
    
    saveRecentLocations(limitedLocations);
  },
  
  /**
   * Remove a location from the recent locations list
   */
  removeFromRecent: (location: string): void => {
    const recents = getRecentLocations();
    const updatedLocations = recents.filter(loc => loc !== location);
    saveRecentLocations(updatedLocations);
  },
  
  /**
   * Get all recent locations
   */
  getRecentLocations: (): string[] => {
    return getRecentLocations();
  },
  
  /**
   * Get weather data for all recent locations
   */
  getRecentLocationsWeather: (): WeatherData[] => {
    const recents = getRecentLocations();
    return recents.map(location => weatherService.getWeatherData(location));
  },
  
  /**
   * Clear all recent locations
   */
  clearRecentLocations: (): void => {
    saveRecentLocations([]);
  }
};

export default recentService; 