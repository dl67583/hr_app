import React from "react";
import "../styles/Home.css"; // Make sure to import your CSS file

function Home() {
  return (
    <div>
      <header>
        <video autoPlay muted loop>
          <source src="https://media.istockphoto.com/id/1740939953/video/world-wide-web-over-planet-earth-forming-a-grid-over-america-abstract-concept-of-global.mp4?s=mp4-640x640-is&k=20&c=UeHWfuogBGXpDX6_VIINgUIrRbV_iN-FI05zJRLhR3o=" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="header-content">
          <h1>Welcome to the Future</h1>
          <p>This is a webpage.</p>
        </div>
      </header>

      <div className="body-content">
        <h2>About Us</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel consectetur est. Donec eget purus eu elit viverra faucibus.
        </p>
        <p>
          Nulla facilisi. Nam sed purus at elit fermentum tempus. Suspendisse potenti. Fusce dignissim ipsum et ante dignissim, eu consectetur elit scelerisque. Nulla posuere arcu vel ligula faucibus rhoncus.
        </p>
      </div>

      <footer>
        <p>&copy; 2024 Webpage. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
