import axios from "axios";

const API_KEY = "5b3ce3597851110001cf62480ed1a13c708c4cd1a7e2ed747a4b49e1";

export const fetchRoute = async (startCoords, endCoords) => {
  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
    {
      coordinates: [
        [startCoords[1], startCoords[0]],
        [endCoords[1], endCoords[0]],
      ],
    },
    {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const routeCoords = response.data.features[0].geometry.coordinates.map(
    (c) => [c[1], c[0]]
  );

  const summary = response.data.features[0].properties.summary;
  const distanceKm = (summary.distance / 1000).toFixed(2);
  const durationMin = Math.round(summary.duration / 60);

  return {
    routeCoords,
    distanceKm,
    durationMin,
  };
};
