import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { useEffect } from "react";

function FitBounds({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords]);

  return null;
}

export default function MapView({ routeCoords }) {
  return (
    <MapContainer
      center={[51.1657, 10.4515]}
      zoom={6}
      className="w-full h-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routeCoords.length > 0 && (
        <>
          <Polyline positions={routeCoords} color="blue" />
          <FitBounds coords={routeCoords} />
        </>
      )}
    </MapContainer>
  );
}
