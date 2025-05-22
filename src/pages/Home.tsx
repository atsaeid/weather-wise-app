import Header from "../components/Header";
import WeatherCard from "../components/WeatherCard";
import LocationList from "../components/LocationList";
import BottomNav from "../components/BottomNav";

const Home = () => {
  const mockLocations = ['Tehran', 'Paris', 'New York', 'Berlin'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-blue-900 pb-20">
      <Header />
      <WeatherCard
        location="Tehran"
        temperature={28}
        condition="Clear Sky"
        icon="https://openweathermap.org/img/wn/01d@2x.png"
      />
      <LocationList locations={mockLocations} />
      {/* ForecastSlider قرار می‌گیرد اینجا بعداً */}
      <BottomNav />
    </div>
  );
};

export default Home;
