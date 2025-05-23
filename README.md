# WeatherWise App

A modern weather application built with React, TypeScript, and Tailwind CSS that provides real-time weather information with a beautiful user interface.

## Features

- Current weather conditions with detailed information
- Hourly and weekly forecasts
- Air quality and UV index data
- Interactive weather map with different weather layers
- Favorite locations management
- Recent locations history
- User authentication
- Responsive design for all devices

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- [WeatherWise API](https://github.com/atsaeid/weather-wise-api) - .NET Core backend service

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/weather-wise-app.git
cd weather-wise-app
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Configure the OpenWeatherMap API key:
   - Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - Open `src/config.ts` and replace `YOUR_API_KEY_HERE` with your actual API key:
   ```typescript
   export const config = {
     openWeatherApiKey: 'YOUR_API_KEY_HERE',
   };
   ```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Weather Map Layers

The app includes an interactive map with the following weather layers from OpenWeatherMap:

- Temperature
- Clouds
- Precipitation
- Sea Level Pressure
- Wind Speed

## Building for Production

```bash
npm run build
# or
yarn build
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Leaflet Maps
- OpenWeatherMap API
- React Router
- Lucide Icons

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Environment Variables Setup

### Quick Start

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and replace the placeholder values with your actual configuration:
   - Get your Weather API key
   - Get your LocationIQ API key
   - Adjust the API base URL if needed
   - Customize other settings as needed

### Environment Files Explained

- `.env`: Contains your actual configuration (not committed to git)
- `.env.example`: Template file with placeholder values (committed to git)
- `.env.local`: Optional local overrides (not committed to git)
- `.env.development`: Development environment specific (not committed to git)
- `.env.production`: Production environment specific (not committed to git)

### Required Configuration

1. **API Keys** (Required):
   ```env
   VITE_WEATHER_API_KEY=your_weather_api_key_here
   VITE_LOCATION_IQ_API_KEY=your_location_iq_api_key_here
   ```

2. **API Base URL** (Required):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

3. **Authentication Storage** (Optional - defaults provided):
   ```env
   VITE_AUTH_TOKEN_KEY=weather_wise_auth_token
   VITE_REFRESH_TOKEN_KEY=weather_wise_refresh_token
   ```

4. **Map Configuration** (Optional - defaults to Tehran):
   ```env
   VITE_MAP_ZOOM_LEVEL=12
   VITE_MAP_DEFAULT_CENTER_LAT=35.6892
   VITE_MAP_DEFAULT_CENTER_LON=51.3890
   ```

### API Endpoints

All API endpoints are automatically derived from the base URL. For example:
- Auth endpoints: `${VITE_API_BASE_URL}/auth/*`
- Weather endpoints: `${VITE_API_BASE_URL}/weather/*`
- Favorites endpoints: `${VITE_API_BASE_URL}/favorites/*`

### Important Notes

1. **Security**:
   - Never commit `.env` file to version control
   - Keep your API keys secure
   - Use different keys for development and production

2. **Naming Convention**:
   - All environment variables must be prefixed with `VITE_` to be accessible in the application
   - Use descriptive names in SCREAMING_SNAKE_CASE

3. **Validation**:
   - The application validates required configuration on startup
   - Missing required values will trigger an error

4. **Development vs Production**:
   - Use different API keys for development and production
   - Consider using different base URLs
   - Production should always use HTTPS