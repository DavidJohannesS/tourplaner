import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; //trash icon
import axios from "axios";

const API_BASE = "http://localhost:8080/api/tours";

export default function TourSearch({ onSearch, searchedTour, onSelectTour }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expandedTourId, setExpandedTourId] = useState(null);
  const [savedTours, setSavedTours] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);

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

  const handleDeleteTour = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tours/${id}`);
      setSavedTours((prev) => prev.filter((tour) => tour.id !== id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Fehler beim Löschen der Tour:", err);
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
          <div key={tour.id} className="mb-2 border rounded relative">
            <button
              className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 pr-10"
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

            <button
              onClick={() => {
                // Schließe die tour entry
                onSelectTour(null);

                setTourToDelete(tour);
                setShowDeleteModal(true);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <Trash2 size={18} />
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
      {showDeleteModal && tourToDelete && (
        <div className="fixed inset-0 z-50 bg-gray-200 bg-opacity-80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Tour löschen</h2>
            <p>
              Bist du sicher, dass du die Tour{" "}
              <strong>{tourToDelete.name}</strong> löschen möchtest?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDeleteTour(tourToDelete.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
