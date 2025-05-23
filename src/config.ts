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
}

export const config: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    weather: {
      key: import.meta.env.VITE_WEATHER_API_KEY || '',
      baseUrl: import.meta.env.VITE_WEATHER_API_URL || 'http://localhost:5000/api/v1/weather',
      searchUrl: import.meta.env.VITE_LOCATION_SEARCH_API_URL || 'http://localhost:5000/api/v1/weather/search',
    },
    locationIQ: {
      key: import.meta.env.VITE_LOCATION_IQ_API_KEY || '',
    },
  },
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'weather_wise_auth_token',
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'weather_wise_refresh_token',
    endpoints: {
      base: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000/api/v1/auth',
      login: import.meta.env.VITE_LOGIN_API_URL || 'http://localhost:5000/api/v1/auth/login',
      register: import.meta.env.VITE_REGISTER_API_URL || 'http://localhost:5000/api/v1/auth/register',
      logout: import.meta.env.VITE_LOGOUT_API_URL || 'http://localhost:5000/api/v1/auth/logout',
      refresh: import.meta.env.VITE_REFRESH_TOKEN_API_URL || 'http://localhost:5000/api/v1/auth/refresh',
    },
  },
  favorites: {
    baseUrl: import.meta.env.VITE_FAVORITES_API_URL || 'http://localhost:5000/api/v1/favorites',
  },
  map: {
    defaultZoom: Number(import.meta.env.VITE_MAP_ZOOM_LEVEL) || 12,
    defaultCenter: {
      lat: Number(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || 35.6892,
      lon: Number(import.meta.env.VITE_MAP_DEFAULT_CENTER_LON) || 51.3890,
    },
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