import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export default function TourEntries({ selectedTour, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedTour) return;

    const fetchEntries = async () => {
      try {
        const response = await axios.get(`${API_BASE}/tour-entries/${selectedTour.id}`);
        setEntries(response.data.tourEntries || []);
      } catch (err) {
        console.error("Fehler beim Laden der TourLogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [selectedTour]);

  const handleAddEntry = () => {
    // später implementieren
    alert("Neuen Log hinzufügen (noch nicht implementiert)");
  };

  if (!selectedTour) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-4 border-l z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tour Logs: {selectedTour.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">×</button>
      </div>

      <button
        onClick={handleAddEntry}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Neuen Log hinzufügen
      </button>

      {loading ? (
        <p>Lade Einträge...</p>
      ) : entries.length === 0 ? (
        <p>Keine TourLogs vorhanden.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="border p-3 rounded shadow-sm">
              <p><strong>Datum:</strong> {entry.dateTime}</p>
              <p><strong>Dauer:</strong> {entry.time} min</p>
              <p><strong>Distanz:</strong> {entry.distance} km</p>
              <p><strong>Bewertung:</strong> {entry.rating}/5</p>
              <p><strong>Kommentar:</strong> {entry.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
