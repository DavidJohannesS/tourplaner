import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/tours";

export default function TourSearch({ onSearch, searchedTour, onSelectTour }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expandedTourId, setExpandedTourId] = useState(null);
  const [savedTours, setSavedTours] = useState([]);

  useEffect(() => {
    async function loadTours() {
      try {
        const res = await axios.get(API_BASE);
        setSavedTours(res.data);
      } catch (e) {
        console.error("Fehler beim Laden der Touren:", e);
      }
    }
    loadTours();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (start && end) {
      onSearch(start, end);
    }
  };

  const isTourAlreadySaved = () =>
    savedTours.some(
      (t) =>
        t.fromLocation.toLowerCase() === searchedTour?.start.toLowerCase() &&
        t.toLocation.toLowerCase() === searchedTour?.end.toLowerCase()
    );

  const handleSave = async () => {
    if (!searchedTour || !name || !description) return;

    const newTourDTO = {
      id: 0, // Wird vom Backend ignoriert / überschrieben
      name,
      description,
      fromLocation: searchedTour.start,
      toLocation: searchedTour.end,
      transportType: "foot-walking",
      distance: String(searchedTour.distance),
      estimatedTime: String(searchedTour.estimatedTime),
      tourEntries: [],
      searchVector: "", // wird serverseitig generiert/verwendet
    };

    try {
      const res = await axios.post(API_BASE, newTourDTO);
      setSavedTours((prev) => [...prev, res.data]);
      setName("");
      setDescription("");
    } catch (e) {
      console.error("Fehler beim Speichern:", e);
    }
  };

  return (
    <div className="w-80 bg-white shadow-md p-4 flex flex-col overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Tour suchen</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-sm font-medium">Startpunkt</label>
          <input
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="z. B. Berlin"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Zielpunkt</label>
          <input
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="z. B. Hamburg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Route suchen
        </button>
      </form>

      {!isTourAlreadySaved() && searchedTour && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Neue Route speichern</h3>
          <input
            type="text"
            value={name}
            placeholder="Name der Route"
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 mb-2"
          />
          <textarea
            value={description}
            placeholder="Beschreibung"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 mb-2"
          />
          <button
            onClick={handleSave}
            disabled={!name || !description}
            className={`w-full p-2 rounded text-white ${
              name && description
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Route speichern
          </button>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Gespeicherte Touren</h3>
        {savedTours.map((tour) => (
          <div key={tour.id} className="mb-2 border rounded">
            <button
              className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200"
              onClick={() => {
                setExpandedTourId((prev) =>
                  prev === tour.id ? null : tour.id
                );
                onSelectTour(tour); 
              }}
            >
              <div className="font-medium">{tour.name}</div>
              <div className="text-sm text-gray-600">
                Zeit: {tour.estimatedTime} min
              </div>
            </button>
            {expandedTourId === tour.id && (
              <div className="p-2 text-sm text-gray-700 bg-white border-t">
                <p>
                  <strong>Beschreibung:</strong> {tour.description}
                </p>
                <p>
                  <strong>Start:</strong> {tour.fromLocation}
                </p>
                <p>
                  <strong>Ziel:</strong> {tour.toLocation}
                </p>
                <p>
                  <strong>Distanz:</strong> {tour.distance} km
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
