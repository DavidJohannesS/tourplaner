import Navbar from "./components/NavBar"
import "tailwindcss";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { fetchRoute } from "./api/FetchRoute";
import axios from "axios";
import Sidebar from "./components/TourSearch";
import MapView from "./components/MapView";
import TourPreview from "./components/TourPreview";
const API_KEY = "5b3ce3597851110001cf62480ed1a13c708c4cd1a7e2ed747a4b49e1"; // Replace with your real API key

function App() {
  const [routeCoords, setRouteCoords] = useState([]);
  const [savedTours, setSavedTours] = useState([]);
  const [searchedTour, setSearchedTour] = useState(null);

  const geocode = async (place) => {
    const response = await axios.get(
      `https://api.openrouteservice.org/geocode/search`,
      {
        params: {
          api_key: API_KEY,
          text: place,
          size: 1,
        },
      }
    );
    const coords = response.data.features[0].geometry.coordinates;
    return [coords[1], coords[0]]; // [lat, lon]
  };

  const handleSearch = async (start, end) => {
    const startCoords = await geocode(start);
    const endCoords = await geocode(end);
    const { routeCoords, distanceKm, durationMin } = await fetchRoute(
      startCoords,
      endCoords
    );

    setRouteCoords(routeCoords);
    setSearchedTour({
      start,
      end,
      distance: distanceKm,
      estimatedTime: durationMin,
    });
  };

  const handleSaveTour = (tour) => {
    setSavedTours((prev) => [...prev, tour]);
  };

 return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar
          onSearch={handleSearch}
          onSaveTour={handleSaveTour}
          searchedTour={searchedTour}
          savedTours={savedTours}
        />
        <div className="flex-1">
          <TourPreview routeCoords={routeCoords} tour={searchedTour} />
        </div>
      </div>
    </div>
  );
}
export default App;
