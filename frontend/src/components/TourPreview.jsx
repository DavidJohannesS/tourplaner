import { useState, useEffect } from "react";
import MapView from "./MapView";
import { updateTour } from "../api/tours";

export default function TourPreview({ routeCoords, tour, onUpdateTour }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...tour });

  useEffect(() => {
    if (tour) {
      setFormData({ ...tour });
      setEditMode(false);
    }
  }, [tour]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await updateTour(tour.id, formData);
      onUpdateTour(response.data);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating tour:", err);
    }
  };

  if (!tour) return <div className="p-4 text-gray-600">Noch keine Route geladen.</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="h-1/2">
        <MapView routeCoords={routeCoords} />
      </div>

      <div className="p-4 bg-white shadow h-1/2 overflow-y-auto">
        {editMode ? (
          <form className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium mb-1">Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium mb-1">Beschreibung</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="fromLocation" className="text-sm font-medium mb-1">Startpunkt</label>
              <input
                id="fromLocation"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="toLocation" className="text-sm font-medium mb-1">Zielpunkt</label>
              <input
                id="toLocation"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="transportType" className="text-sm font-medium mb-1">Verkehrsmittel</label>
              <input
                id="transportType"
                name="transportType"
                value={formData.transportType}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="distance" className="text-sm font-medium mb-1">Distanz (km)</label>
                <input
                  id="distance"
                  name="distance"
                  type="number"
                  value={formData.distance}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="estimatedTime" className="text-sm font-medium mb-1">Dauer (min)</label>
                <input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="number"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
              >
                Speichern
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-xl font-bold">{tour.name}</h2>
            <p className="mb-4">{tour.description}</p>
            <button
              onClick={() => setEditMode(true)}
              className="text-sm text-blue-600 mb-4"
            >
              Bearbeiten ✏️
            </button>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Start:</strong> {tour.fromLocation}</p>
              <p><strong>Ziel:</strong> {tour.toLocation}</p>
              <p><strong>Verkehrsmittel:</strong> {tour.transportType}</p>
              <p><strong>Distanz:</strong> {tour.distance} km</p>
              <p><strong>Dauer:</strong> {tour.estimatedTime} min</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
