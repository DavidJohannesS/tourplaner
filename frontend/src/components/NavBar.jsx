import React from "react";
import classNames from "classnames";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";

export default function Navbar() {
  const { darkMode, setDarkMode } = useDarkMode();

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
    <nav
      className={classNames("flex justify-between items-center p-4", {
        "bg-blue-300 text-black": !darkMode,
        "bg-gray-800 text-white": darkMode,
      })}
    >
      {/* Left: Site name */}
      <a href="/" className="text-xl font-bold">
        Tourplaner
      </a>

      {/* Right: Import, Export, and DarkMode Switch */}
      <div className="flex items-center gap-2">
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
        <label className="flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="hidden"
          />
          <div className="w-10 h-5 bg-gray-400 rounded-full p-1 flex items-center dark:bg-gray-700">
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                darkMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
    </nav>
  );
}
