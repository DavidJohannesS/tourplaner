import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";

export default function MapView({ routeCoords }) {
  const [center, setCenter] = useState([51.1657, 10.4515]); // Mitte Deutschlands
  const zoom = 6;

  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      // Setze Center auf den ersten Punkt der Route
      setCenter(routeCoords[0]);
    }
  }, [routeCoords]);

  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
}
