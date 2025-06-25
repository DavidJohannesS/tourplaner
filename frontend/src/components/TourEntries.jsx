import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { useDarkMode } from "../context/DarkModeContext";
import axios from "axios";
import classNames from "classnames";

const API_BASE = "http://localhost:8080/api";

export default function TourEntries({ selectedTour, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [newEntry, setNewEntry] = useState({
    comment: "",
    difficulty: "",
    distance: "",
    time: "",
    rating: 0,
  });

  const { darkMode } = useDarkMode();

  useEffect(() => {
    if (!selectedTour) return;

    const fetchEntries = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/tours/${selectedTour.id}`
        );
        console.log("Fetched tour:", response.data); // Debug
        setEntries(response.data.tourEntries || []);
      } catch (err) {
        console.error("Fehler beim Laden der TourLogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [selectedTour]);

  const handleStarClick = (value) => {
    setNewEntry((prev) => ({ ...prev, rating: value }));
  };

  const isFormValid = () => {
    const { comment, difficulty, distance, time, rating } = newEntry;
    return comment && difficulty && distance && time && rating > 0;
  };

  // Reload the tour so it will instantly show
  const reloadTour = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tours/${selectedTour.id}`);
      setEntries(res.data.tourEntries);
    } catch (error) {
      console.error("Fehler beim Laden der Tour-Einträge:", error);
    }
  };

  const handleAddOrUpdateEntry = async () => {
    const entryData = {
      comment: newEntry.comment,
      difficulty: newEntry.difficulty,
      distance: newEntry.distance,
      time: newEntry.time,
      rating: newEntry.rating,
      dateTime: new Date().toISOString(),
    };

    try {
      if (editingEntryId) {
        // UPDATE
        await axios.put(
          `http://localhost:8080/api/tour-entries/${editingEntryId}`,
          entryData
        );
      } else {
        // CREATE
        await axios.post(
          `http://localhost:8080/api/tours/${selectedTour.id}/entries`,
          entryData
        );
      }
      reloadTour();

      // Formular zurücksetzen
      setNewEntry({
        comment: "",
        difficulty: "",
        distance: "",
        time: "",
        rating: 0,
      });
      setEditingEntryId(null);
      // Formular ausblenden
      setShowForm(false);
    } catch (error) {
      console.error("Fehler beim Speichern des Log-Eintrags:", error);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tour-entries/${id}`);
      reloadTour();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Fehler beim Löschen der Tour:", err);
    }
  };

  const handleEditClick = (entry) => {
    setNewEntry({
      comment: entry.comment,
      difficulty: entry.difficulty,
      distance: entry.distance,
      time: entry.time,
      rating: entry.rating,
    });
    setEditingEntryId(entry.id);
    setShowForm(true);
  };

  if (!selectedTour) return null;

  return (
    <div
      className={classNames(
        "fixed right-0 top-16 h-[calc(100%-4rem)] w-96 shadow-lg p-4 border-l z-50 overflow-y-auto",
        {
          "bg-white text-black": !darkMode,
          "bg-gray-700 text-white": darkMode,
        }
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Tour Logs: {selectedTour.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black text-2xl"
        >
          ×
        </button>
      </div>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Neuen Log hinzufügen
      </button>

      {showForm && (
        <div
          className={classNames("border p-4 rounded shadow-sm mb-4", {
            "bg-gray-50 ": !darkMode,
            "dark:bg-gray-600": darkMode,
          })}
        >
          <div className="mb-2">
            <label className="block font-medium">Kommentar</label>
            <textarea
              value={newEntry.comment}
              onChange={(e) =>
                setNewEntry((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Schwierigkeit</label>
            <select
              value={newEntry.difficulty}
              onChange={(e) =>
                setNewEntry((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="w-full border rounded p-2"
              required
            >
              <option value="" disabled>
                Schwierigkeit wählen
              </option>
              <option value="very easy">Very Easy</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="very hard">Very Hard</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block font-medium">Distanz (km)</label>
            <input
              type="number"
              min="0"
              value={newEntry.distance}
              onChange={(e) =>
                setNewEntry((prev) => ({ ...prev, distance: e.target.value }))
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Dauer (min)</label>
            <input
              type="number"
              min="0"
              value={newEntry.time}
              onChange={(e) =>
                setNewEntry((prev) => ({ ...prev, time: e.target.value }))
              }
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Bewertung</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`text-yellow-400 ${
                    newEntry.rating >= star ? "fill-current" : "text-gray-300"
                  }`}
                >
                  <Star
                    fill={newEntry.rating >= star ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!isFormValid()}
            className={`mt-4 w-full px-4 py-2 rounded text-white ${
              isFormValid()
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleAddOrUpdateEntry}
          >
            {editingEntryId ? "Log aktualisieren" : "Log speichern"}
          </button>
        </div>
      )}

      {loading ? (
        <p>Lade Einträge...</p>
      ) : entries.length === 0 ? (
        <p>Keine TourLogs vorhanden.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => {
            const formattedDate = new Date(entry.dateTime).toLocaleString(
              "de-DE",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            );

            return (
              <li
                key={entry.id}
                className={classNames("relative border p-3 rounded shadow-sm", {
                  "text-white": !darkMode,
                  "dark:text-white": darkMode,
                })}
              >
                <button
                  className={classNames("absolute top-2 right-2", {
                    "text-gray-500 hover:text-red-600": !darkMode,
                    "dark:text-black hover:text-red-600": darkMode,
                  })}
                  onClick={() => {
                    setEntryToDelete(entry);
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  className={classNames("absolute bottom-2 right-2", {
                    "text-gray-500 hover:text-blue-700": !darkMode,
                    "dark:text-black hover:text-blue-700": darkMode,
                  })}
                  onClick={() => handleEditClick(entry)}
                >
                  <Pencil size={18} />
                </button>
                <p>
                  <strong>Datum:</strong> {formattedDate}
                </p>
                <p>
                  <strong>Dauer:</strong> {entry.time} min
                </p>
                <p>
                  <strong>Distanz:</strong> {entry.distance} km
                </p>
                <p>
                  <strong>Bewertung:</strong> {entry.rating}/5
                </p>
                <p>
                  <strong>Kommentar:</strong> {entry.comment}
                </p>
              </li>
            );
          })}
        </ul>
      )}
      {showDeleteModal && entryToDelete && (
        <div
          className={classNames(
            "fixed inset-0 z-50 bg-opacity-80 backdrop-blur-sm flex items-center justify-center",
            {
              "bg-gray-200 text-black": !darkMode,
              "dark:bg-gray-500 dark:text-black": darkMode,
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
              <strong>{entryToDelete.name}</strong> löschen möchtest?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDeleteEntry(entryToDelete.id)}
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
