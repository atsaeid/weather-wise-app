/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_LOCATION_IQ_API_KEY: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_WEATHER_API_URL: string;
  readonly VITE_LOCATION_SEARCH_API_URL: string;
  readonly VITE_AUTH_API_URL: string;
  readonly VITE_LOGIN_API_URL: string;
  readonly VITE_REGISTER_API_URL: string;
  readonly VITE_LOGOUT_API_URL: string;
  readonly VITE_REFRESH_TOKEN_API_URL: string;
  readonly VITE_FAVORITES_API_URL: string;
  readonly VITE_MAP_ZOOM_LEVEL: string;
  readonly VITE_MAP_DEFAULT_CENTER_LAT: string;
  readonly VITE_MAP_DEFAULT_CENTER_LON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 