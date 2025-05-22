import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import WeatherForecastContainer from "../components/weather/WeatherForecastContainer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 to-blue-900 pb-20">
      <Header />
      <WeatherForecastContainer />
      <BottomNav />
    </div>
  );
};

export default Home;
