import React from "react";
import { useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { useDarkMode } from "../context/DarkModeContext";
import { jsPDF } from "jspdf";

// Helper function: calculates summarized report info from a tours array.
const generateSummarizedReport = (tours) => {
  return tours.map((tour) => {
    const logs = tour.tourEntries || [];
    const count = logs.length;
    const sumTime = logs.reduce((sum, log) => sum + parseFloat(log.time || 0), 0);
    const sumDistance = logs.reduce((sum, log) => sum + parseFloat(log.distance || 0), 0);
    const sumRating = logs.reduce((sum, log) => sum + parseFloat(log.rating || 0), 0);
    return {
      id: tour.id,
      name: tour.name,
      avgTime: count > 0 ? (sumTime / count).toFixed(2) : 0,
      avgDistance: count > 0 ? (sumDistance / count).toFixed(2) : 0,
      avgRating: count > 0 ? (sumRating / count).toFixed(2) : 0,
    };
  });
};

export default function Navbar() {
  // New: state to hold tours from backend.
  const [tours, setTours] = useState([]);
  const [toursLoading, setToursLoading] = useState(true);
  const { darkMode, setDarkMode } = useDarkMode();

  // Fetch tours on mount.
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tours");
        setTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setToursLoading(false);
      }
    };
    fetchTours();
  }, []);

  // Import feature (unchanged)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const toursArray = Array.isArray(data) ? data : [data];
        const promises = toursArray.map((tourData) =>
          axios.post("http://localhost:8080/api/tours", tourData, {
            headers: { "Content-Type": "application/json" },
          })
        );
        await Promise.all(promises);
        alert("Tours imported successfully!");
        // Optionally, re-fetch tours here to update your state.
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

  // Export menu states and selections.
  const [exportMenu, setExportMenu] = useState(false);
  const [reportType, setReportType] = useState(""); // "tour" or "summary"
  const [selectedTourId, setSelectedTourId] = useState("");

  const handleExportClick = () => {
    setExportMenu(!exportMenu);
  };

  const handleGenerateExport = () => {
    const doc = new jsPDF();
    if (reportType === "tour") {
      if (!selectedTourId) {
        alert("Please select a tour for the Tour Report.");
        return;
      }
      // Find the specific tour by comparing id as a string.
      const tour = tours.find((t) => String(t.id) === selectedTourId);
      if (!tour) {
        alert("Selected tour not found.");
        return;
      }
      // Generate Tour Report PDF.
      doc.setFontSize(16);
      doc.text(`Tour Report: ${tour.name}`, 10, 20);
      doc.setFontSize(12);
      let y = 30;
      doc.text(`Description: ${tour.description || "-"}`, 10, y);
      y += 10;
      doc.text(`From: ${tour.fromLocation || "-"}`, 10, y);
      y += 10;
      doc.text(`To: ${tour.toLocation || "-"}`, 10, y);
      y += 10;
      doc.text(`Transport: ${tour.transportType || "-"}`, 10, y);
      y += 10;
      doc.text(`Distance: ${tour.distance || "-"}`, 10, y);
      y += 10;
      doc.text(`Estimated Time: ${tour.estimatedTime || "-"}`, 10, y);
      y += 20;
      doc.text("Tour Logs:", 10, y);
      y += 10;
      if (tour.tourEntries && tour.tourEntries.length > 0) {
        tour.tourEntries.forEach((entry, index) => {
          const entryText = `${index + 1}. Date: ${new Date(entry.dateTime).toLocaleDateString()} | Comment: ${entry.comment} | Difficulty: ${entry.difficulty} | Distance: ${entry.distance} | Time: ${entry.time} | Rating: ${entry.rating}`;
          const textLines = doc.splitTextToSize(entryText, 180);
          doc.text(textLines, 10, y);
          y += textLines.length * 10;
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
      } else {
        doc.text("No tour logs available.", 10, y);
      }
      doc.save(`tour-report-${tour.id}.pdf`);
    } else if (reportType === "summary") {
      const summary = generateSummarizedReport(tours);
      doc.setFontSize(16);
      doc.text("Summarized Report", 10, 20);
      doc.setFontSize(12);
      let y = 30;
      summary.forEach((tourSummary) => {
        const text = `Tour: ${tourSummary.name} | Avg Time: ${tourSummary.avgTime} | Avg Distance: ${tourSummary.avgDistance} | Avg Rating: ${tourSummary.avgRating}`;
        doc.text(text, 10, y);
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save("summarized-report.pdf");
    } else {
      alert("Please choose a report type.");
    }
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
          onClick={handleExportClick}
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

      {/* Export selection UI */}
      {exportMenu && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-4 bg-white text-black rounded shadow-lg z-10">
          <p className="mb-2 font-semibold text-center">Select Report Type:</p>
          <div className="flex justify-center space-x-2 mb-2">
            <button
              onClick={() => setReportType("tour")}
              className={`px-3 py-1 rounded ${
                reportType === "tour" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Tour Report
            </button>
            <button
              onClick={() => setReportType("summary")}
              className={`px-3 py-1 rounded ${
                reportType === "summary" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Summarized Report
            </button>
          </div>
          {reportType === "tour" && (
            <div className="mb-2">
              <label className="block mb-1 text-center">Select Tour:</label>
              <select
                value={selectedTourId}
                onChange={(e) => setSelectedTourId(e.target.value)}
                className="w-full border rounded p-1"
              >
                <option value="" disabled>
                  -- Select a tour --
                </option>
                {toursLoading ? (
                  <option>Loading tours...</option>
                ) : tours.length > 0 ? (
                  tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No tours available</option>
                )}
              </select>
            </div>
          )}
          <button
            onClick={handleGenerateExport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Generate Export
          </button>
        </div>
      )}
    </nav>
  );
}
