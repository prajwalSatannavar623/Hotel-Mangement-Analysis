import HeroImage from "../../src/Hero.png";
import Button from "../components/Button";

const Home = () => {
  return (
    <div
      className="w-full h-screen bg-cover flex flex-col items-center justify-around gap-2"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      <div>
        <h1 className="text-hero text-static-white text-shadow-static-muted font-black">
          Hotelyzis
        </h1>
        <h3 className="text-large text-static-white font-bold bg-secondary rounded px-3 py-2 text-center">
          A tool for analysis of hotel reviews
        </h3>
      </div>
      <Button variant="outline" to={"/signin"} className="w-1/2 text-center">
        Get started
      </Button>
    </div>
  );
};

export default Home;
