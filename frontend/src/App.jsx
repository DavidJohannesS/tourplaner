import Navbar from "./components/NavBar";
import "tailwindcss";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { fetchRoute } from "./api/FetchRoute";
import axios from "axios";
import Sidebar from "./components/TourSearch";
import MapView from "./components/MapView";
import TourEntries from "./components/TourEntries";
import TourPreview from "./components/TourPreview";

const API_KEY = "5b3ce3597851110001cf62480ed1a13c708c4cd1a7e2ed747a4b49e1"; // Replace with your real API key

function App() {
  const [routeCoords, setRouteCoords] = useState([]);
  const [savedTours, setSavedTours] = useState([]);
  const [searchedTour, setSearchedTour] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);

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
const handleSelectTour = async (tour) => {
  console.log("Selected Tour:", tour);
  setSelectedTour(tour);

  try {
    const startCoords = await geocode(tour.fromLocation);
    const endCoords = await geocode(tour.toLocation);
    const { routeCoords } = await fetchRoute(startCoords, endCoords);
    setRouteCoords(routeCoords); // ← this updates the map
  } catch (e) {
    console.error("Fehler beim Laden der Route für gewählte Tour:", e);
  }
};  const handleSaveTour = (tour) => {
    setSavedTours((prev) => [...prev, tour]);
  };

  const handleCloseTourEntries = () => setSelectedTour(null);
const handleUpdateTour = (updatedTour) => {
  setSelectedTour({ ...updatedTour });  // Force a new object reference
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
          onSelectTour={handleSelectTour}
        />
        <div className="flex-1">
<TourPreview
  routeCoords={routeCoords}
  tour={selectedTour || searchedTour}
  onUpdateTour={handleUpdateTour}
/>
          {selectedTour && (
            <TourEntries
              selectedTour={selectedTour}
              onClose={handleCloseTourEntries}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
