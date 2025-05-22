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
