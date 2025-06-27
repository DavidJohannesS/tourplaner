vi.mock("../../context/DarkModeContext", () => ({
  useDarkMode: () => ({
    darkMode: false,
    setDarkMode: vi.fn(),
  }),
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../NavBar";      // adjust casing if your file is named Navbar.jsx
import axios from "axios";
import { jsPDF } from "jspdf";

// --- MOCKS --- //

vi.mock("axios");

// Mock jsPDF.
vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    splitTextToSize: vi.fn().mockReturnValue(["line1"]),
  })),
}));

// Override FileReader in tests to simulate reading a file (for Import functionality)
beforeAll(() => {
  class FakeFileReader {
    constructor() {}
    readAsText(file) {
      // In our fake, we assume the file object has a custom property "_content"
      if (this.onload) {
        this.onload({ target: { result: file._content } });
      }
    }
  }
  global.FileReader = FakeFileReader;
});

// --- MOCK DATA --- //
const mockTours = [
  {
    id: 1,
    name: "Tour One",
    description: "Description One",
    fromLocation: "City A",
    toLocation: "City B",
    transportType: "car",
    distance: "100",
    estimatedTime: "60",
    tourEntries: [],
  },
  {
    id: 2,
    name: "Tour Two",
    description: "Description Two",
    fromLocation: "City C",
    toLocation: "City D",
    transportType: "bus",
    distance: "200",
    estimatedTime: "120",
    tourEntries: [
      {
        id: 1,
        comment: "Great",
        difficulty: "easy",
        distance: "50",
        time: "30",
        rating: "4",
        dateTime: "2025-06-24T10:00:00.000Z",
      },
    ],
  },
];

describe("Navbar", () => {
  beforeEach(async () => {
    // Mock axios.get to resolve with our mock tours
    axios.get.mockResolvedValue({ data: mockTours });
    // Render the Navbar
    render(<Navbar />);
    // Wait for axios.get to be called so that tours are fetched
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the site name and Import/Export buttons", () => {
    // Check the site name (left positioned)
    expect(screen.getByText("Tourplaner")).toBeInTheDocument();
    // Check that the Import and Export buttons exist
    expect(screen.getByText("Import")).toBeInTheDocument();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("toggles the export menu when Export button is clicked", () => {
    // Initially, the export selection UI should not be visible:
    expect(screen.queryByText("Select Report Type:")).not.toBeInTheDocument();

    // Click Export to toggle the UI
    fireEvent.click(screen.getByText("Export"));
    expect(screen.getByText("Select Report Type:")).toBeInTheDocument();
  });

  it("populates the tour dropdown when Tour Report is selected", async () => {
    // Open export menu and choose Tour Report
    fireEvent.click(screen.getByText("Export"));
    fireEvent.click(screen.getByText("Tour Report"));

    // The export UI now renders a label "Select Tour:"
    expect(screen.getByText("Select Tour:")).toBeInTheDocument();
    // There should be an option element for each tour from mockTours.
    for (const tour of mockTours) {
      expect(screen.getByRole("option", { name: tour.name })).toBeInTheDocument();
    }
  });

  it("alerts when generating a tour report without selecting a tour", () => {
    window.alert = vi.fn();

    // Open export menu and choose Tour Report without selecting any tour.
    fireEvent.click(screen.getByText("Export"));
    fireEvent.click(screen.getByText("Tour Report"));
    fireEvent.click(screen.getByText("Generate Export"));

    expect(window.alert).toHaveBeenCalledWith("Please select a tour for the Tour Report.");
  });

  it("generates a Tour Report PDF when a tour is selected", async () => {
    window.alert = vi.fn();
    // Open export menu, select Tour Report, then choose a tour using the dropdown.
    fireEvent.click(screen.getByText("Export"));
    fireEvent.click(screen.getByText("Tour Report"));

    // Get the select element and choose the first tour
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: String(mockTours[0].id) } });

    fireEvent.click(screen.getByText("Generate Export"));

    await waitFor(() => {
      // Ensure jsPDF was used
      expect(jsPDF).toHaveBeenCalled();
    });
    const instance = jsPDF.mock.results[0].value;
    // Check that the PDF is created with the correct header text and saved with the proper file name.
    expect(instance.text).toHaveBeenCalledWith(`Tour Report: ${mockTours[0].name}`, 10, 20);
    expect(instance.save).toHaveBeenCalledWith(`tour-report-${mockTours[0].id}.pdf`);
  });

  it("generates a Summarized Report PDF", async () => {
    window.alert = vi.fn();
    // Open export menu, then select Summarized Report.
    fireEvent.click(screen.getByText("Export"));
    fireEvent.click(screen.getByText("Summarized Report"));
    fireEvent.click(screen.getByText("Generate Export"));

    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalled();
    });
    const instance = jsPDF.mock.results[0].value;
    // Check that the report header is added and it is saved under the correct filename.
    expect(instance.text).toHaveBeenCalledWith("Summarized Report", 10, 20);
    expect(instance.save).toHaveBeenCalledWith("summarized-report.pdf");
  });

  it("alerts when no report type is selected and Generate Export is clicked", () => {
    window.alert = vi.fn();
    // Open export menu without selecting a report type.
    fireEvent.click(screen.getByText("Export"));
    fireEvent.click(screen.getByText("Generate Export"));
    expect(window.alert).toHaveBeenCalledWith("Please choose a report type.");
  });

  it("imports tours from a file", async () => {
    const tourData = {
      id: 3,
      name: "Imported Tour",
      description: "Imported trip",
      fromLocation: "X",
      toLocation: "Y",
      transportType: "train",
      distance: "50",
      estimatedTime: "30",
      tourEntries: [],
    };
    const fileContent = JSON.stringify(tourData);
    // Create a dummy file and attach our JSON as a custom property (_content)
    const file = new File([fileContent], "tour.json", { type: "application/json" });
    file._content = fileContent;

    axios.post.mockResolvedValue({ data: tourData });
    window.alert = vi.fn();

    // The file input is nested inside the Import label.
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Tours imported successfully!");
    });
  });
});
