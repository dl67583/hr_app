import React from "react";
import "../styles/Home.css"; // Make sure to import your CSS file

function Home() {
  return (
    <div>
      <header>
        <div class="bgfoto">
        <div className="header-content">
          <h1>Welcome to the Future</h1>
          <p>This is a webpage.</p>
        </div>
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
