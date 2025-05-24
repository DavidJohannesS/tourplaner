import { useState } from "react";

export default function Sidebar({ onSearch, onSaveTour, searchedTour, savedTours }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expandedTourId, setExpandedTourId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (start && end) {
      onSearch(start, end);
    }
  };

  const handleSave = () => {
    if (!searchedTour || !name || !description) return;

    const newTour = {
      id: crypto.randomUUID(),
      name,
      description,
      start: searchedTour.start,
      end: searchedTour.end,
      distance: searchedTour.distance,
      estimatedTime: searchedTour.estimatedTime,
    };

    onSaveTour(newTour);
    setName("");
    setDescription("");
  };

  const isTourAlreadySaved = () => {
    return savedTours.some(
      (tour) =>
        tour.start.toLowerCase() === searchedTour?.start.toLowerCase() &&
        tour.end.toLowerCase() === searchedTour?.end.toLowerCase()
    );
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

      {/* Neue Route speichern */}
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

      {/* Gespeicherte Touren */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Gespeicherte Touren</h3>
        {savedTours.map((tour) => (
          <div key={tour.id} className="mb-2 border rounded">
            <button
              className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200"
              onClick={() =>
                setExpandedTourId((prev) =>
                  prev === tour.id ? null : tour.id
                )
              }
            >
              <div className="font-medium">{tour.name}</div>
              <div className="text-sm text-gray-600">
                Zeit: {tour.estimatedTime} min
              </div>
            </button>
            {expandedTourId === tour.id && (
              <div className="p-2 text-sm text-gray-700 bg-white border-t">
                <p><strong>Beschreibung:</strong> {tour.description}</p>
                <p><strong>Start:</strong> {tour.start}</p>
                <p><strong>Ziel:</strong> {tour.end}</p>
                <p><strong>Distanz:</strong> {tour.distance} km</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
