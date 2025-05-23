interface Config {
  api: {
    baseUrl: string;
    weather: {
      key: string;
      baseUrl: string;
      searchUrl: string;
    };
    locationIQ: {
      key: string;
    };
    map: {
      staticUrl: string;
    };
    favorites: {
      baseUrl: string;
    };
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
    endpoints: {
      base: string;
      login: string;
      register: string;
      logout: string;
      refresh: string;
    };
  };
  favorites: {
    baseUrl: string;
  };
  map: {
    defaultZoom: number;
    defaultCenter: {
      lat: number;
      lon: number;
    };
  };
  endpoints: {
    weather: string;
    maps: string;
    auth: string;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5083';

export const config: Config = {
  api: {
    baseUrl: API_BASE_URL,
    weather: {
      key: import.meta.env.VITE_WEATHER_API_KEY || '',
      baseUrl: `${API_BASE_URL}/api/Weather`,
      searchUrl: `${API_BASE_URL}/api/Weather/search`,
    },
    locationIQ: {
      key: import.meta.env.VITE_LOCATION_IQ_API_KEY || '',
    },
    map: {
      staticUrl: `${API_BASE_URL}/api/Map/static`,
    },
    favorites: {
      baseUrl: `${API_BASE_URL}/api/Favorites`,
    },
  },
  auth: {
    tokenKey: 'weather_wise_auth_token',
    refreshTokenKey: 'weather_wise_refresh_token',
    endpoints: {
      base: `${API_BASE_URL}/api/Auth`,
      login: '/api/Auth/login',
      register: '/api/Auth/register',
      logout: '/api/Auth/logout',
      refresh: '/api/Auth/refresh',
    },
  },
  favorites: {
    baseUrl: `${API_BASE_URL}/api/Favorites`,
  },
  map: {
    defaultZoom: Number(import.meta.env.VITE_MAP_ZOOM_LEVEL) || 12,
    defaultCenter: {
      lat: Number(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || 35.6892,
      lon: Number(import.meta.env.VITE_MAP_DEFAULT_CENTER_LON) || 51.3890,
    },
  },
  endpoints: {
    weather: import.meta.env.VITE_WEATHER_API_URL || 'http://localhost:3000/api/weather',
    maps: import.meta.env.VITE_MAPS_API_URL || 'http://localhost:3000/api/map',
    auth: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api/auth',
  },
};

// Type guard to check if all required API keys are present
export const isConfigValid = (): boolean => {
  const requiredKeys = [
    config.api.weather.key,
    config.api.locationIQ.key,
  ];

  return requiredKeys.every(key => key && key.length > 0);
};

// Function to validate configuration on app startup
export const validateConfig = (): void => {
  if (!isConfigValid()) {
    console.error('Missing required API keys in environment configuration');
    throw new Error('Application configuration is incomplete. Please check your environment variables.');
  }
};

export default config; 