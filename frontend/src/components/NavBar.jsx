import React from "react";
import axios from "axios";

export default function Navbar() {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        // Parse the JSON file; it can be an object or an array of tours.
        const data = JSON.parse(e.target.result);
        const toursArray = Array.isArray(data) ? data : [data];

        // Iterate over all the tours and send a POST for each.
        const promises = toursArray.map((tour) =>
          axios.post("http://localhost:8080/api/tours", tour, {
            headers: { "Content-Type": "application/json" },
          })
        );

        await Promise.all(promises);
        alert("Tours imported successfully!");
      } catch (err) {
        console.error("Error importing tours:", err);
        alert("Error parsing JSON file or importing tours.");
      }
    };

    reader.onerror = (err) => {
      console.error("Error reading file:", err);
      alert("Error reading file.");
    };

    reader.readAsText(file);
  };

  const handleExport = () => {
    alert("Export functionality not implemented yet.");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      {/* Left: Site name that refreshes the page */}
      <a href="/" className="text-xl font-bold">
        Tourplaner
      </a>

      {/* Right: Import and Export buttons */}
      <div>
        <label className="mr-2 cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
          Import
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
        >
          Export
        </button>
      </div>
    </nav>
  );
}
