import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";
import classNames from "classnames";

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
  const { darkMode } = useDarkMode();

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
      await axios.delete(`${API_BASE}/${id}`);
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
      id: 0, // ignored by backend
      name,
      description,
      fromLocation: searchedTour.start,
      toLocation: searchedTour.end,
      transportType: "foot-walking",
      distance: String(searchedTour.distance),
      estimatedTime: String(searchedTour.estimatedTime),
      tourEntries: [],
      searchVector: "",
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
    <div
      className={classNames(
        "w-80 shadow-md p-4 flex flex-col overflow-y-auto",
        {
          "bg-white text-black": !darkMode,
          "dark:bg-gray-700 dark:text-white": darkMode,
        }
      )}
    >
      <h2 className="text-xl font-semibold mb-4">Tour suchen</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label htmlFor="start-input" className="text-sm font-medium">
            Startpunkt
          </label>
          <input
            id="start-input"
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="z. B. Berlin"
          />
        </div>
        <div>
          <label htmlFor="end-input" className="text-sm font-medium">
            Zielpunkt
          </label>
          <input
            id="end-input"
            type="text"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="z. B. Hamburg"
          />
        </div>
        <button
          type="submit"
          className={classNames("rounded p-2", {
            "bg-blue-600 text-white hover:bg-blue-700": !darkMode,
            "dark:bg-gray-800 dark:hover:bg-gray-600": darkMode,
          })}
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
              className={classNames("w-full text-left p-2 pr-10", {
                "bg-gray-100 text-black hover:bg-gray-200": !darkMode,
                "dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500":
                  darkMode,
              })}
              onClick={() => {
                setExpandedTourId((prev) =>
                  prev === tour.id ? null : tour.id
                );
                onSelectTour(tour);
              }}
            >
              <div className="font-medium">{tour.name}</div>
              <div
                className={classNames("text-sm", {
                  "text-gray-600": !darkMode,
                  "dark:text-black": darkMode,
                })}
              >
                Zeit: {tour.estimatedTime} min
              </div>
            </button>

            <button
              aria-label={`Lösche ${tour.name}`}
              onClick={() => {
                onSelectTour(null);
                setTourToDelete(tour);
                setShowDeleteModal(true);
              }}
              className={classNames("absolute top-2 right-2", {
                "text-gray-500 hover:text-red-600": !darkMode,
                "dark:text-black hover:text-red-600": darkMode,
              })}
            >
              <Trash2 size={18} />
            </button>

            {expandedTourId === tour.id && (
              <div
                className={classNames("p-2 text-sm border-t", {
                  "bg-white text-gray-700": !darkMode,
                  "dark:bg-gray-500 dark:text-black": darkMode,
                })}
              >
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
        <div
          className={classNames(
            "fixed inset-0 z-50 bg-opacity-80 backdrop-blur-sm flex items-center justify-center",
            {
              "bg-gray-200 text-black": !darkMode,
              "dark:bg-gray-500 dark:text-white": darkMode,
            }
          )}
        >
          <div
            className={classNames("p-6 rounded-lg shadow-lg w-96", {
              "bg-white": !darkMode,
              "dark:bg-gray-600": darkMode,
            })}
          >
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
