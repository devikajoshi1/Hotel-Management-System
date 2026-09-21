import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-content">
        <p className="hero-small-text">WELCOME TO LUXORA</p>

        <h1>
          Your stay,
          <br />
          <span>beautifully</span> designed.
        </h1>

        <p className="hero-description">
          Experience comfort, elegance and unforgettable moments
          in the heart of the city.
        </p>

        <button className="hero-button">
          Explore Rooms
        </button>
      </div>

    </section>
  );
};

export default Hero;